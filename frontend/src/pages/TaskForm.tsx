// frontend/src/pages/TaskForm.tsx

import React, { useState } from 'react';
import { createTask } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized');
      return;
    }
    try {
      await createTask(token, title, description, status, dueDate);
      alert('Task created!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error creating task');
    }
  };

  return (
    <div>
      <h1>Create a new task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>
        <div>
          <label>Status: </label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label>Due Date: </label>
          <input 
            type="date" 
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit">Save Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
