from dotenv import load_dotenv # type: ignore
import os
from sqlalchemy import create_engine
from urllib.parse import quote_plus

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:

    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')

    # Construindo a URL de conexão do MySQL
    DB_USERNAME = os.getenv('DB_USERNAME')
    DB_PASSWORD = quote_plus(os.getenv('DB_PASSWORD'))
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT', 3306)
    DB_NAME = os.getenv('DB_NAME')

    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

def get_engine():
    database_url = Config.SQLALCHEMY_DATABASE_URI
    if not database_url:
        raise ValueError("No DATABASE_URL set for SQLAlchemy engine")
    
    engine = create_engine(
        database_url,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=1800,
    )
    return engine