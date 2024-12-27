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
        return jsonify([c.__dict__ for c in campaigns if '_sa_instance_state' not in c.__dict__])
    
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
        campaign=Campaign.get_or_404(id)
        return jsonify(campaign.__dict__)
    
class Donate(Resource):
    pass

class ApproveCampaign(Resource):
    pass