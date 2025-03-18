from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    from app.routes.login.views import login_bp
    from app.routes.register.views import register_bp

    app.register_blueprint(login_bp)
    app.register_blueprint(register_bp)

    with app.app_context():
        db.create_all()

    return app