from flask import request,jsonify
from flask_restful import Resource
from .models import Campaign
from . import db
import os
import razorpay


razorpay_client=razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'),os.getenv('RAZORPAY_SECRET'))
)

class CampaignList(Resource):
    def get(self):
        campaigns=Campaign.query.all()
        return jsonify([c.to_dict() for c in campaigns])
    
    def post(self):
        data=request.json
        new_campaign=Campaign(
            title=data['title'],
            description=data['description'],
            goal_amount=data['goal_amount'],
            creator=data['creator']
        )
        
        db.session.add(new_campaign)
        db.session.commit()
        
        return jsonify({'msg':"New Campaign is Created",'campaign':new_campaign.id})

class CampaignDetail(Resource):
    def get(self,id):
        campaign=Campaign.query.get(id)
        return jsonify(campaign.to_dict())
    
    def put(self,id):
        data =request.json
        campaign =Campaign.query.get(id)
        campaign.title=data.get('title',campaign.title)
        campaign.description=data.get('description',campaign.description)
        campaign.goal_amount=data.get('goal_amount',campaign.goal_amount)
        db.session.commit()
        return jsonify({'msg' : 'Campaign  is Updated'})
    
    def delete(self,id):
        campaign=Campaign.query.get_or_404(id)
        db.session.delete(campaign)
        db.session.commit()
        return jsonify({"msg" : f"Campaign {id} is Deleted"})
        
    
class Donate(Resource):
    def post(self,id):
        data=request.json
        print(data)
        campaign=Campaign.query.get(id)
        
        try :
            order_data={
                "amount" : int(data['amount']*100),
                "currency" : "INR",
                "receipt" : f"campaign_{campaign.id}",
                "payment_capture" : 1
            }
            
            razorpay_order=razorpay_client.order.create(order_data)
            
            campaign.raised_amount+=data['amount']
            db.session.commit()
            
            return jsonify({
                'order_id' : razorpay_order['id'],
                'amount' : razorpay_order['amount'],
                'currency': razorpay_order['currency']
            })
            
        except Exception as e : 
            return jsonify({'error' : str(e)})
        

class ApproveCampaign(Resource):
    def patch(self,id):
        campaign=Campaign.query.get(id)
        campaign.is_approved=True
        db.session.commit()
        return jsonify({'msg' : 'Campaign is Approved'})

class Test_Route(Resource):
    def get(self):
        return jsonify({'msg':'Server is working'})