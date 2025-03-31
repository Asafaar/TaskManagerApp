import React, { useEffect, useState } from 'react';
import { Subtask } from '../models/models';

interface SubtaskFormProps {
  subtask: Subtask | null;
  parentTaskId: number | null;
  onClose: () => void;
  onSave: (subtask: Subtask) => void;
}

const SubtaskForm: React.FC<SubtaskFormProps> = ({ subtask, parentTaskId, onClose, onSave }) => {
  const [title, setTitle] = useState(subtask?.title || '');
  const [status, setStatus] = useState(subtask?.status || 'pending');
  const [dueDate, setDueDate] = useState(subtask?.due_date?.slice(0, 10) || '');

  useEffect(() => {
    if (subtask) {
      setTitle(subtask.title);
      setStatus(subtask.status);
      setDueDate(subtask.due_date?.slice(0, 10) || '');
    }
  }, [subtask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentTaskId) {
      alert('Parent task not found');
      return;
    }

    const newSubtask: Subtask = {
      ...subtask,
      title,
      status,
      due_date: dueDate,
      task_id: parentTaskId,
    };

    onSave(newSubtask);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{subtask ? 'Edit Subtask' : 'Create Subtask'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubtaskForm;