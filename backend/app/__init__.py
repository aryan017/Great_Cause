from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()   ## Create SQLAlchemy instance
migrate = Migrate() ## Create Migrate Instance
jwt = JWTManager()  ## Create JWT Instance

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    from .routes import init_app
    init_app(app)
    
    return app
