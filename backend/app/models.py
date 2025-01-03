from . import db

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    goal_amount = db.Column(db.Float, nullable=False)
    raised_amount = db.Column(db.Float, default=0)
    creator = db.Column(db.String(100), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'goal_amount': self.goal_amount,
            'raised_amount': self.raised_amount,
            'creator': self.creator,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
