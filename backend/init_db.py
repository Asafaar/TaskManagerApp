from database import get_connection

def create_tables():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    password TEXT NOT NULL
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    title TEXT NOT NULL,
                    description TEXT,
                    status VARCHAR(20),
                    due_date TIMESTAMP
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS subtasks (
                    id SERIAL PRIMARY KEY,
                    task_id INTEGER REFERENCES tasks(id),
                    title TEXT NOT NULL,
                    status VARCHAR(20),
                    due_date TIMESTAMP
                )
            """)
        conn.commit()
    print("✅ Tables created successfully.")

if __name__ == '__main__':
    create_tables()
