# backend/database.py

import pymysql
from pymysql.cursors import DictCursor
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME


def get_connection():
    
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=DictCursor
    )
