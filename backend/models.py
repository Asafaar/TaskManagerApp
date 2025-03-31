from database import get_connection
import bcrypt

# ---------------------------------------
# USERS
# ---------------------------------------

def create_user(email, username, password):
    """
    יוצר משתמש חדש במסד הנתונים עם סיסמה מוצפנת (hashed).
    """
    # נוודא שה-Hash נשמר כמחרוזת ולא כ-bytes
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO users (email, username, password)
            VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (email, username, hashed))
        conn.commit()

def get_user_by_email(email):
    """
    מחזיר נתוני משתמש (email, password וכו') לפי email.
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM users WHERE email = %s"
            cursor.execute(sql, (email,))
            return cursor.fetchone()

def get_user_by_id(user_id):
    """
    מחזיר נתוני משתמש לפי user_id.
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM users WHERE id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()

# ---------------------------------------
# TASKS
# ---------------------------------------

def create_task(user_id, title, description, status, due_date):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO tasks (title, description, status, due_date, user_id)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (title, description, status, due_date, user_id))
        conn.commit()

def get_tasks_by_user_id(user_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM tasks WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()

def get_task_by_id(task_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM tasks WHERE id = %s"
            cursor.execute(sql, (task_id,))
            return cursor.fetchone()

def update_task(task_id, title, description, status, due_date):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = """
            UPDATE tasks
            SET title=%s, description=%s, status=%s, due_date=%s
            WHERE id = %s
            """
            cursor.execute(sql, (title, description, status, due_date, task_id))
        conn.commit()

def delete_task(task_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "DELETE FROM tasks WHERE id = %s"
            cursor.execute(sql, (task_id,))
        conn.commit()

# ---------------------------------------
# SUBTASKS
# ---------------------------------------

def create_subtask(task_id, title, status, due_date):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO subtasks (task_id, title, status, due_date)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (task_id, title, status, due_date))
        conn.commit()

def get_subtasks_by_task_id(task_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM subtasks WHERE task_id = %s"
            cursor.execute(sql, (task_id,))
            return cursor.fetchall()

def get_subtask_by_id(subtask_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM subtasks WHERE id = %s"
            cursor.execute(sql, (subtask_id,))
            return cursor.fetchone()

def update_subtask(subtask_id, title, status, due_date):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = """
            UPDATE subtasks
            SET title = %s, status = %s, due_date = %s
            WHERE id = %s
            """
            cursor.execute(sql, (title, status, due_date, subtask_id))
        conn.commit()

def delete_subtask(subtask_id):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            sql = "DELETE FROM subtasks WHERE id = %s"
            cursor.execute(sql, (subtask_id,))
        conn.commit()
