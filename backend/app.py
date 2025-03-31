from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.task_routes import task_bp
from routes.health_route import health_bp  

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix='/')
app.register_blueprint(task_bp, url_prefix='/')
app.register_blueprint(health_bp, url_prefix='/') 

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)
