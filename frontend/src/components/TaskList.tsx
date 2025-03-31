import React, { useState } from 'react';
import { Task, Subtask } from '../models/models';
import { getSubtasks } from '../services/api';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onAddSubtask: (task: Task) => void;
  onEditSubtask: (subtask: Subtask, parent: Task) => void;
  onDeleteSubtask: (subtaskId: number, parentTaskId: number) => void;
  onOpenSubtasks: (task: Task) => void;
  subtasksMap: Record<number, Subtask[]>;
  setSubtasksMap: React.Dispatch<React.SetStateAction<Record<number, Subtask[]>>>;
}

const formatDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onOpenSubtasks,
  subtasksMap,
  setSubtasksMap,
}) => {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const token = localStorage.getItem('token');

  const handleToggleExpand = async (task: Task) => {
    const isExpanded = expandedTasks.includes(task.id!);
    if (isExpanded) {
      setExpandedTasks(expandedTasks.filter((id) => id !== task.id));
    } else {
      if (token && !subtasksMap[task.id!]) {
        try {
          const res = await getSubtasks(token, task.id!);
          setSubtasksMap((prev) => ({
            ...prev,
            [task.id!]: res.data,
          }));
        } catch (err) {
          console.error('Failed to fetch subtasks', err);
        }
      }
      setExpandedTasks([...expandedTasks, task.id!]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-300 bg-white shadow-sm">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Due Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isExpanded = expandedTasks.includes(task.id!);
            const subtasks = subtasksMap[task.id!] || [];

            return (
              <React.Fragment key={task.id}>
                <tr
                  onClick={() => handleToggleExpand(task)}
                  className="cursor-pointer hover:bg-gray-50 text-sm"
                >
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border">{formatDateTime(task.due_date)}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id!);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddSubtask(task);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                      >
                        Add Subtask
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={4} className="bg-gray-50 px-4 py-2">
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-dashed border-gray-300 py-2"
                        >
                          <div className="text-sm">
                            <strong>{subtask.title}</strong> – {subtask.status} –{' '}
                            {formatDateTime(subtask.due_date)}
                          </div>
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <button
                              onClick={() => onEditSubtask(subtask, task)}
                              className="bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteSubtask(subtask.id!, task.id!)}
                              className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {subtasks.length === 0 && (
                        <p className="text-sm text-gray-500">No subtasks found.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;