from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
cors = CORS()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    cors.init_app(app)

    # Defina o diretório onde as imagens estão
    UPLOAD_FOLDER = '/var/www/ticketshelpme/tickets/backend/app/static/uploads'

    @app.route('/media/<filename>')
    def serve_media(filename):
        # Envia o arquivo estático da pasta uploads
        return send_from_directory(UPLOAD_FOLDER, filename)


    with app.app_context():
        from app.routes.auth.views import auth_bp
        from app.routes.login.views import login_bp
        from app.routes.register.views import register_bp
        from app.routes.config.views import config_bp
        from app.routes.user.views import user_bp
        from app.routes.tickets.views import tickets_bp
        
    app.register_blueprint(auth_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(config_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(tickets_bp)

    return app