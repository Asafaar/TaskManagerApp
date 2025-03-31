

import os
import os
from dotenv import load_dotenv

load_dotenv()  


JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'mysecretkey')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'password')
DB_NAME = os.environ.get('DB_NAME', 'task_manager_db')

