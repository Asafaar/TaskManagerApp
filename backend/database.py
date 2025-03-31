# backend/database.py

import pymysql
from pymysql.cursors import DictCursor
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

import os
import psycopg2
import psycopg2.extras
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()  # טוען את .env במידה ואתה מפתח מקומית

def get_connection():
    db_url = os.getenv("DATABASE_URL")
    url = urlparse(db_url)

    return psycopg2.connect(
        dbname=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port,
        cursor_factory=psycopg2.extras.RealDictCursor  # מחזיר תוצאה כמו DictCursor
    )
