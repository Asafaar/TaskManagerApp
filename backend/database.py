from urllib.parse import urlparse
import os
import psycopg2
import psycopg2.extras

def get_connection():
    db_url = os.getenv("DATABASE_URL")  # למשל: postgresql://user:pass@host:5432/db
    url = urlparse(db_url)

    return psycopg2.connect(
        dbname=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port or 5432,
        cursor_factory=psycopg2.extras.RealDictCursor
    )
