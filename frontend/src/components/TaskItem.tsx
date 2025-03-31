// src/components/TaskItem.tsx

import React, { useState } from 'react';
import { Task, Subtask } from '../models';
import { getSubtasks } from '../services/api';

interface TaskItemProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onAddSubtask: (task: Task) => void;  
  onEditSubtask: (sub: Subtask, parent: Task) => void;   // חדש
  onDeleteSubtask: (subtaskId: number) => void;          // חדש
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask
}) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [expanded, setExpanded] = useState(false);

  const token = localStorage.getItem('token');

  const handleToggleSubtasks = async () => {
    if (!expanded) {
      // אם פותחים עכשיו, נמשוך תתי משימות
      if (token && task.id) {
        try {
          const res = await getSubtasks(token, task.id);
          setSubtasks(res.data);
        } catch (err) {
          console.error('Failed to fetch subtasks', err);
        }
      }
    }
    setExpanded(!expanded);
  };

  const handleDeleteTask = () => {
    if (task.id) {
      onDeleteTask(task.id);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Due: {task.due_date || 'N/A'}</p>

      <button onClick={() => onEditTask(task)}>Edit</button>
      <button onClick={handleDeleteTask} style={{ marginLeft: '8px' }}>
        Delete
      </button>

      <button onClick={handleToggleSubtasks} style={{ marginLeft: '8px' }}>
        {expanded ? 'Hide Subtasks' : 'Show Subtasks'}
      </button>

      <button onClick={() => onAddSubtask(task)} style={{ marginLeft: '8px' }}>
        + Subtask
      </button>

      {expanded && (
        <div style={{ marginTop: '8px', marginLeft: '16px' }}>
          {subtasks.length === 0 ? (
            <p>No subtasks found.</p>
          ) : (
            subtasks.map((sub) => (
              <div
                key={sub.id}
                style={{ border: '1px dashed #aaa', margin: '4px', padding: '4px' }}
              >
                <p>Subtask: {sub.title}</p>
                <p>Status: {sub.status}</p>
                <p>Due: {sub.due_date || 'N/A'}</p>
                {/* כפתורי עריכה/מחיקה */}
                <button onClick={() => onEditSubtask(sub, task)}>Edit Subtask</button>
                <button
                  onClick={() => onDeleteSubtask(sub.id!)}
                  style={{ marginLeft: '8px' }}
                >
                  Delete Subtask
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
