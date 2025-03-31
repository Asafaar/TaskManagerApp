# backend/routes/auth_routes.py

from flask import Blueprint, request, jsonify
from models import create_user, get_user_by_email
import bcrypt
import jwt
import datetime
from config import JWT_SECRET_KEY

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"message": "Missing fields"}), 400

    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    create_user(email, username, password)
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    user = get_user_by_email(email)
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # create jwt
        payload = {
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)  #time for token 2 hours
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
