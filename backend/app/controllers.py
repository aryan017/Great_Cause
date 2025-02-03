from flask import request,jsonify,send_file
from flask_restful import Resource
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from mailjet_rest import Client
from .models import Campaign, User, Transaction, Comment
from . import db
import json
import io
import os
import razorpay

load_dotenv() 

razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

class CampaignList(Resource):
    def get(self):
        campaigns=Campaign.query.all()
        return jsonify([c.to_dict() for c in campaigns])
    
    @jwt_required() 
    def post(self):
        user_identity = json.loads(get_jwt_identity())
        data=request.json
        new_campaign=Campaign(
            title=data['title'],
            description=data['description'],
            goal_amount=data['goal_amount'],
            creator_id=user_identity['id']  # Linking campaign to the logged-in user
        )
        
        db.session.add(new_campaign)
        db.session.commit()
        
        return jsonify({'msg':"New Campaign is Created",'campaign':new_campaign.id})

class CampaignDetail(Resource):
    def get(self,id):
        campaign=Campaign.query.get(id)
        return jsonify(campaign.to_dict())
    
    @jwt_required()
    def put(self,id):
        user_identity = json.loads(get_jwt_identity())
       ## print("Headers:", request.headers) 
        data =request.json
        campaign =Campaign.query.get(id)
        
        # Check if the logged-in user is the creator of the campaign
        if campaign.creator_id != user_identity['id']:
            return jsonify({"msg": "Unauthorized to update this campaign"})
        
        campaign.title=data.get('title',campaign.title)
        campaign.description=data.get('description',campaign.description)
        campaign.goal_amount=data.get('goal_amount',campaign.goal_amount)
        db.session.commit()
        return jsonify({'msg' : 'Campaign  is Updated'})
    
    @jwt_required()
    def delete(self,id):
        user_identity = json.loads(get_jwt_identity())
        campaign=Campaign.query.get_or_404(id)
         # Check if the logged-in user is the creator of the campaign
        if campaign.creator_id != user_identity['id']:
            return jsonify({"msg": "Unauthorized to delete this campaign"}), 403
        
        db.session.delete(campaign)
        db.session.commit()
        return jsonify({"msg" : f"Campaign {id} is Deleted"})
    
class Share_Campaign(Resource):
    @jwt_required()
    def post(self,id):
        campaign = Campaign.query.get(id)
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
      
        if campaign.share_count is None:
            campaign.share_count = 0
        campaign.share_count += 1
        db.session.commit()
    
        return jsonify({'message': 'Campaign shared successfully!', 'share_count': campaign.share_count})    
    
class Donate(Resource):
    @jwt_required()
    def post(self,id):
        data=request.json
        campaign=Campaign.query.get(id)
        
        try :
            order_data={
                "amount" : int(float(data['amount']) * 100),
                "currency" : "INR",
                "receipt" : f"campaign_{campaign.id}",
                "payment_capture" : 1
            }
            
            razorpay_order=razorpay_client.order.create(order_data)
           
            return jsonify({
                'order_id' : razorpay_order['id'],
                'amount' : razorpay_order['amount'],
                'currency': razorpay_order['currency']
            })
            
        except Exception as e : 
            return jsonify({'error' : str(e)})
        

class ApproveCampaign(Resource):
    @jwt_required()
    def patch(self,id):
        campaign=Campaign.query.get(id)
        campaign.is_approved=True
        db.session.commit()
        return jsonify({'msg' : 'Campaign is Approved'})
    
class VerifyPayment(Resource):

    @staticmethod
    def send_email(to_email, subject, message):
        """Send email using Mailjet"""
        mailjet = Client(auth=(os.getenv("MAILJET_API_KEY"), os.getenv("MAILJET_SECRET_KEY")), version='v3.1')
        data = {
            'Messages': [{
                "From": {"Email": os.getenv("MAILJET_SENDER_EMAIL"), "Name": "Great_Cause"},
                "To": [{"Email": to_email}],
                "   Subject": subject,
                "TextPart": message
            }]
        }
        result = mailjet.send.create(data=data)
        return result.status_code, result.json()

    @jwt_required()
    def post(self):
        data=request.json
        user_identity = json.loads(get_jwt_identity())
        user=User.query.get(user_identity['id'])
        razorpay_order_id=data['razorpay_order_id']
        razorpay_payment_id=data['razorpay_payment_id']
        razorpay_signature=data['razorpay_signature']
        
        try :
            razorpay_client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id" : razorpay_payment_id,
                "razorpay_signature" : razorpay_signature
            })
            
            
            campaign_id = data["campaign_id"]
            amount = data["amount"] / 100 

            campaign = Campaign.query.get(campaign_id)
            if campaign:
                campaign.raised_amount += amount
                db.session.commit()
                
            
            transaction = Transaction(
                user_id=user_identity['id'],
                campaign_id=campaign_id,
                campaign_title=campaign.title,
                campaign_goal_amount=campaign.goal_amount,
                amount=amount
            )
            print(f'Here is your transaction details {transaction.to_dict()}')
            
            db.session.add(transaction)
            db.session.commit()
            
            VerifyPayment.send_email(
            to_email=campaign.creator.email,
            subject="🎉 New Donation Received!",
            message=f"Your campaign '{campaign.title}' just received a donation of Rs {amount} from {user.username}!"
            )
               
            return jsonify({'success': True,'msg' : "Payment is verified SuccessFully and Campaign is Updated SuccessFully and Transaction Recorded SuccessFully"})
        
        except Exception as e:
            return jsonify({'error' : str(e)})
        
class Register(Resource):
    def post(self):
        data=request.json
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'msg' : "Missing Required Fields"})
        
        if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first() :
            return jsonify({'msg' : "Username or Email Already Exists"})
        
        user =User(username=data['username'],email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
             
        return jsonify({'msg' : 'User Registered SuccessFully'}) 
    
class Login(Resource):
    def post(self):
        data=request.json
        user=User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data.get('password')):
            return jsonify({'msg' : 'Invalid Email or Password'})
        
        access_token = create_access_token(identity=json.dumps({'id': user.id, 'username': user.username}))
        return jsonify({'token' : access_token , 'user' : user.to_dict()})
    
class Profile(Resource):
    @jwt_required()
    def get(self):
        user_id =get_jwt_identity()
        user = User.query.get_or_404(user_id, description="User not found")
        return jsonify(user.to_dict())

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id, description="User not found")
        
        try:
            data = request.get_json()
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict()})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to update profile', 'details': str(e)}), 500


class UserCampaigns(Resource):
    @jwt_required()
    def get(self):
        user_id =get_jwt_identity()
        campaigns = Campaign.query.filter_by(creator_id=user_id).all()
        return jsonify({'campaigns': [campaign.to_dict() for campaign in campaigns]})
    
class Transactions(Resource):
    @jwt_required()
    def get(self):
        user_identity = json.loads(get_jwt_identity())
        transactions = Transaction.query.filter_by(user_id=user_identity['id']).all()
        return jsonify({'transactions': [d.to_dict() for d in transactions]})


class DownloadReceipt(Resource):
    @jwt_required()
    def get(self, id):
        user_identity = json.loads(get_jwt_identity())
        transaction = Transaction.query.get_or_404(id)
        
        if transaction.user_id != user_identity['id']:
            return jsonify({"msg": "Unauthorized to access this receipt"}), 403

        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.drawString(100, 750, "Transaction Receipt")
        pdf.drawString(100, 730, f"Donor ID: {transaction.user_id}")
        pdf.drawString(100, 710, f"Campaign ID: {transaction.campaign_id}")
        pdf.drawString(100, 690, f"Campaign Title: {transaction.campaign_title}")
        pdf.drawString(100, 670, f"Goal Amount: INR {transaction.campaign_goal_amount}")
        pdf.drawString(100, 650, f"Donated Amount: INR {transaction.amount}")
        ##pdf.drawString(100, 690, f"Date: {transaction.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
        pdf.save()
        buffer.seek(0)

        return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f"Receipt_{transaction.id}.pdf")    

class Campaign_Comment(Resource):
    @jwt_required()
    def get(self,id):
        comments = Comment.query.filter_by(campaign_id=id).all()
        return jsonify([comment.to_dict() for comment in comments])
    
    @jwt_required()
    def post(self,id):
        user_id = get_jwt_identity()
        data = request.get_json()
        content = data.get('content')
    
        if not content:
            return jsonify({'error': 'Content is required'}), 400
    
        new_comment = Comment(campaign_id=id, user_id=user_id, content=content)
        db.session.add(new_comment)
        db.session.commit()
    
        return jsonify(new_comment.to_dict()), 201
    
class LIKE_Comment(Resource):
    @jwt_required()
    def put(self,id):
        comment = Comment.query.get(id)
        if not comment:
            return jsonify({'error': 'Comment not found'}), 404
        if comment.likes is None:
            comment.likes = 0
        comment.likes += 1
        db.session.commit()
        return jsonify(comment.to_dict())
    
class DISLIKE_Comment(Resource):
    @jwt_required()
    def put(self,id):
        comment = Comment.query.get(id)
        if not comment:
            return jsonify({'error': 'Comment not found'}), 404
        if comment.dislikes is None:
            comment.dislikes = 0
        comment.dislikes += 1
        db.session.commit()
        return jsonify(comment.to_dict())

class Test_Route(Resource):
    def get(self):
        return jsonify({'msg':'Server is working'})