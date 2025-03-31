// src/components/TaskModal.tsx

import React, { useState, useEffect } from 'react';
import { Task } from '../models/models';

interface TaskModalProps {
  task: Task | null;              // null => מצב יצירה, אחרת => עריכה
  onClose: () => void;            // פונקציה לסגירת המודאל
  onSave: (taskData: Task) => void; // פונקציה שקורית כשמשתמש לוחץ על "Submit"
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  // בעת פתיחת המודאל, אם יש 'task' => עריכה, נטען את השדות
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setDueDate(task.due_date ? task.due_date.slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: task?.id,
      title,
      description,
      status,
      due_date: dueDate === '' ? null : dueDate
    };

    onSave(newTask);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label>Due Date and Time:</label>
            <input
              type="datetime-local"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button type="submit">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  minWidth: '300px'
};

export default TaskModal;