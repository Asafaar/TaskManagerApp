# 📂 Task Manager App

A full-stack Task Manager application built using **React (TypeScript)** on the frontend, **Flask (Python)** on the backend, and **MySQL** as the database.

This application allows users to manage personal tasks and subtasks with secure authentication, filtering, and responsive UI.

---

## 🌐 Live Demo
**Frontend:** [https://taskapp-frontend-64an.onrender.com](https://taskapp-frontend-64an.onrender.com)

---

## 🎡 Features

- User Authentication with JWT
- Password hashing with bcrypt
- Task CRUD operations
- Subtask support
- Filter by status/date
- Responsive design

---

## 💻 Local Development

### 🔹 Clone & Checkout Local Branch
```bash
git clone https://github.com/Asafaar/TaskManagerApp.git
cd task-manager-app
git checkout local
```

### 🔧 Backend Setup (Flask)
```bash
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 🌎 Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📃 API Documentation

All protected routes require an `Authorization: Bearer <token>` header.

### 🛡️ Auth Endpoints

| Method | Endpoint   | Description         |
|--------|------------|---------------------|
| POST   | /signup    | Register new user   |
| POST   | /login     | Login user & get JWT|

### 📋 Task Endpoints

| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | /tasks            | Get all user tasks        |
| POST   | /tasks            | Create a new task         |
| PUT    | /tasks/:id        | Update a task             |
| DELETE | /tasks/:id        | Delete a task             |

#### Task Fields
```json
{
  "title": "Task title",
  "description": "Optional description",
  "status": "pending" | "done",
  "due_date": "YYYY-MM-DD"
}
```

### 📒 Subtask Endpoints

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | /tasks/:id/subtasks          | Get subtasks for a task        |
| POST   | /tasks/:id/subtasks          | Create a subtask               |
| PUT    | /subtasks/:subtask_id        | Update a subtask               |
| DELETE | /subtasks/:subtask_id        | Delete a subtask               |

#### Subtask Fields
```json
{
  "title": "Subtask title",
  "status": "pending" | "done",
  "due_date": "YYYY-MM-DD"
}
```

---

## 📊 Database Schema

### `users` Table
| Field     | Type         | Description           |
|-----------|--------------|-----------------------|
| id        | INT (PK)     | User ID               |
| email     | VARCHAR      | User email (unique)   |
| username  | VARCHAR      | Username              |
| password  | VARCHAR      | Hashed password       |

### `tasks` Table
| Field      | Type         | Description              |
|------------|--------------|--------------------------|
| id         | INT (PK)     | Task ID                  |
| title      | VARCHAR      | Task title               |
| description| TEXT         | Task description         |
| status     | VARCHAR      | Task status (pending/done)|
| due_date   | DATE         | Due date (optional)      |
| user_id    | INT (FK)     | Owner of the task        |

### `subtasks` Table
| Field     | Type         | Description                   |
|-----------|--------------|-------------------------------|
| id        | INT (PK)     | Subtask ID                    |
| task_id   | INT (FK)     | Reference to parent task      |
| title     | VARCHAR      | Subtask title                 |
| status    | VARCHAR      | Subtask status (pending/done) |
| due_date  | DATE         | Due date (optional)           |

---

## 🛠️ Environment Variables

Create a `.env` file in your backend root directory:

### `.env.example`
```
SECRET_KEY=your_jwt_secret
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_DB=task_manager
```

---


---

## 📅 Project Structure

```
task-manager-app/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes/
├── frontend/
│   ├── src/
│   │   ├── services/api.ts
│   │   ├── components/
│   │   └── pages/
```



