from flask_restful import Api
from .controllers import CampaignList, CampaignDetail,Profile,UserCampaigns, Donate, Transactions, DownloadReceipt, ApproveCampaign,Test_Route,VerifyPayment, Register,Login

api=Api()

def init_app(app):
    api.add_resource(Register,'/register')
    api.add_resource(Login,'/login')
    api.add_resource(Profile,'/profile')
    api.add_resource(UserCampaigns,'/profile/campaigns')
    api.add_resource(CampaignList,'/campaigns')
    api.add_resource(CampaignDetail,'/campaigns/<int:id>')
    api.add_resource(Donate,'/campaigns/<int:id>/donate')
    api.add_resource(ApproveCampaign,'/campaigns/<int:id>/approve')
    api.add_resource(VerifyPayment,'/payments/verify')
    api.add_resource(Transactions,'/transactions')
    api.add_resource(DownloadReceipt,'/downloadRecepit/<int:id>')
    api.add_resource(Test_Route,'/test')
    api.init_app(app)