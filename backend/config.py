import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'mysecretkey')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///crowdfunding.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
   # STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
