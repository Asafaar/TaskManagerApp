from flask import Blueprint, jsonify
from database import get_connection

health_bp = Blueprint('health', __name__)
## check if the server if the mysql and the server is ok
@health_bp.route('/health', methods=['GET'])
def health_check():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()

        return jsonify({
            "status": "Server is up and running",
            "db_connection": "OK",
            "db_test_result": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "Server is running, but database connection failed",
            "error": str(e)
        }), 500
