from . import db
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy.schema import UniqueConstraint, ForeignKeyConstraint

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Add unique constraints at the table level with names
    __table_args__ = (
        UniqueConstraint('username', name='uq_users_username'),
        UniqueConstraint('email', name='uq_users_email'),
    )

    # Set the hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Check if the provided password matches the hashed password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Return user details as a dictionary
    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}


class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    goal_amount = db.Column(db.Float, nullable=False)
    raised_amount = db.Column(db.Float, default=0)
    creator_id = db.Column(db.Integer, nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Add foreign key constraint with a name
    __table_args__ = (
        ForeignKeyConstraint(['creator_id'], ['users.id'], name='fk_campaigns_creator_id'),
    )

    # Establish relationship with the User model
    creator = db.relationship('User', backref='campaigns', lazy=True)

    # Return campaign details as a dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'goal_amount': self.goal_amount,
            'raised_amount': self.raised_amount,
            'creator': self.creator.to_dict(),  # Include user info in response
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
