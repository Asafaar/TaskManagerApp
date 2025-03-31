// frontend/src/services/api.ts

import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:5000'; 

// -------------------------------------
// AUTH
// -------------------------------------
export const signup = async (email: string, username: string, password: string) => {
  return axios.post(`${API_BASE_URL}/signup`, { email, username, password });
};

export const login = async (email: string, password: string) => {
  return axios.post(`${API_BASE_URL}/login`, { email, password });
};

// -------------------------------------
// TASKS
// -------------------------------------


export const getTasks = async (token: string) => {
  return axios.get(`${API_BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// יצירת משימה חדשה
export const createTask = async (
  token: string,
  title: string,
  description: string,
  status: string,
  dueDate: string | null
) => {
  return axios.post(`${API_BASE_URL}/tasks`,
    { title, description, status, due_date: dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateTask = async (
  token: string,
  taskId: number,
  title: string,
  description: string,
  status: string,
  dueDate: string | null
) => {
  return axios.put(`${API_BASE_URL}/tasks/${taskId}`,
    { title, description, status, due_date: dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteTask = async (token: string, taskId: number) => {
  return axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// -------------------------------------
// SUBTASKS
// -------------------------------------

// משיכת כל תתי-המשימות של משימה מסוימת
export const getSubtasks = async (token: string, taskId: number) => {
  return axios.get(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createSubtask = async (
  token: string,
  taskId: number,
  title: string,
  status: string,
  dueDate: string | null
) => {
  return axios.post(`${API_BASE_URL}/tasks/${taskId}/subtasks`,
    { title, status, due_date: dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
export const updateSubtask = async (
    token: string,
    subtaskId: number,
    title: string,
    status: string,
    dueDate: string | null
  ) => {
    return axios.put(`${API_BASE_URL}/subtasks/${subtaskId}`, 
      { title, status, due_date: dueDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };
  
  export const deleteSubtask = async (
    token: string,
    subtaskId: number
  ) => {
    return axios.delete(`${API_BASE_URL}/subtasks/${subtaskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
  
