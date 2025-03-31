# backend/routes/task_routes.py

from flask import Blueprint, request, jsonify
from models import (
    create_task, get_tasks_by_user_id, get_task_by_id,
    update_task, delete_task, create_subtask, get_subtasks_by_task_id
)
import jwt
from config import JWT_SECRET_KEY

task_bp = Blueprint('task_bp', __name__)

def decode_jwt(token):
    """
    מפענח את ה-JWT ומחזיר את ה-Payload.
    במקרה של שגיאה - מחזיר None.
    """
    try:
        decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return decoded
    except Exception:
        return None

def get_user_id_from_token(request):
    """
    מוציא את user_id מתוך ה-Token שב-Header.
    """
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)
        if payload:
            return payload.get('user_id')
    return None

@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    tasks = get_tasks_by_user_id(user_id)
    return jsonify(tasks), 200

@task_bp.route('/tasks', methods=['POST'])
def create_new_task():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    status = data.get('status', 'pending')
    due_date = data.get('due_date', None)

    create_task(user_id, title, description, status, due_date)
    return jsonify({"message": "Task created successfully"}), 201

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_existing_task(task_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    # קודם נבדוק אם המשימה קיימת
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    # בדיקה שהמשתמש הוא הבעלים
    if task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    title = data.get('title', task['title'])
    description = data.get('description', task['description'])
    status = data.get('status', task['status'])
    due_date = data.get('due_date', task['due_date'])

    update_task(task_id, title, description, status, due_date)
    return jsonify({"message": "Task updated successfully"}), 200

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_existing_task(task_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    if task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    delete_task(task_id)
    return jsonify({"message": "Task deleted successfully"}), 200

@task_bp.route('/tasks/<int:task_id>/subtasks', methods=['POST'])
def create_subtask_for_task(task_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    # ראשית, מוודאים שהמשימה אכן בבעלות המשתמש
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    if task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    title = data.get('title')
    status = data.get('status', 'pending')
    due_date = data.get('due_date', None)

    create_subtask(task_id, title, status, due_date)
    return jsonify({"message": "Subtask created successfully"}), 201

@task_bp.route('/tasks/<int:task_id>/subtasks', methods=['GET'])
def get_subtasks(task_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    if task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    subtasks = get_subtasks_by_task_id(task_id)
    return jsonify(subtasks), 200
@task_bp.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
def delete_subtask_route(subtask_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    from models import get_subtask_by_id, delete_subtask

    subtask = get_subtask_by_id(subtask_id)
    if not subtask:
        return jsonify({"message": "Subtask not found"}), 404

    task = get_task_by_id(subtask['task_id'])
    if not task or task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    delete_subtask(subtask_id)
    return jsonify({"message": "Subtask deleted successfully"}), 200
@task_bp.route('/subtasks/<int:subtask_id>', methods=['PUT'])
def update_subtask_route(subtask_id):
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    from models import get_subtask_by_id, update_subtask

    subtask = get_subtask_by_id(subtask_id)
    if not subtask:
        return jsonify({"message": "Subtask not found"}), 404

    task = get_task_by_id(subtask['task_id'])
    if not task or task['user_id'] != user_id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    title = data.get('title', subtask['title'])
    status = data.get('status', subtask['status'])
    due_date = data.get('due_date', subtask['due_date'])

    update_subtask(subtask_id, title, status, due_date)
    return jsonify({"message": "Subtask updated successfully"}), 200
