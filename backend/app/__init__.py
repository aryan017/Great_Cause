from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db=SQLAlchemy()   ## Create SQLAlchemy instance
migrate=Migrate() ## Create Migrate Instance

def create_app() :
    app=Flask(__name__)
    app.config.from_object('config.Config')
    
    db.init_app(app)
    
    migrate.init_app(app,db)
    
    ## Register Routes
    
    from .routes import api
    api.init_app(app)
    
    return app