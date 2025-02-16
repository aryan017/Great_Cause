from flask_restful import Api
from .controllers import CampaignList, CampaignDetail,UserCampaigns, GoogleAuthorize, GoogleOauthCallback, UpdateCampaign,Campaign_Comment, DeleteCampaign, LIKE_Comment, DISLIKE_Comment, Share_Campaign, Donate, Transactions, DownloadReceipt, ApproveCampaign,Test_Route,VerifyPayment, Register,Login

api=Api()

def init_app(app):
    api.add_resource(Register,'/register')
    api.add_resource(Login,'/login')
    api.add_resource(UserCampaigns,'/user_campaigns')
    api.add_resource(DeleteCampaign,'/user_campaigns/<int:id>')
    api.add_resource(UpdateCampaign,'/user_campaigns/<int:id>')
    api.add_resource(CampaignList,'/campaigns')
    api.add_resource(CampaignDetail,'/campaigns/<int:id>')
    api.add_resource(Share_Campaign,'/campaigns/<int:id>/share')
    api.add_resource(Donate,'/campaigns/<int:id>/donate')
    api.add_resource(ApproveCampaign,'/campaigns/<int:id>/approve')
    api.add_resource(VerifyPayment,'/payments/verify')
    api.add_resource(Transactions,'/transactions')
    api.add_resource(DownloadReceipt,'/downloadRecepit/<int:id>')
    api.add_resource(Campaign_Comment,'/campaigns/<int:id>/comments')
    api.add_resource(LIKE_Comment,'/comments/<int:id>/like')
    api.add_resource(GoogleAuthorize,'/authorize')
    api.add_resource(GoogleOauthCallback,'/oauth2callback',endpoint='oauth2callback')
    api.add_resource(DISLIKE_Comment,'/comments/<int:id>/dislike')
    api.add_resource(Test_Route,'/test')
    api.init_app(app)