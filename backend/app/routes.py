from flask_restful import Api
from .controllers import CampaignList, CampaignDetail, Donate, ApproveCampaign,Test_Route

api=Api()

def init_app(app):
    api.add_resource(CampaignList,'/campaigns')
    api.add_resource(CampaignDetail,'/campaigns/<int:id>')
    api.add_resource(Donate,'/campaigns/<int:id>/donate')
    api.add_resource(ApproveCampaign,'/campaigns/<int:id>/approve')
    api.add_resource(Test_Route,'/test')
    api.init_app(app)