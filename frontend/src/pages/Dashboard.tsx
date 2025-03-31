import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TaskList from '../components/TaskList';
import TaskFormModal from '../components/TaskForm';

import { Task, Subtask } from '../models/models';
import {
  getTasks,
  deleteTask,
  createTask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  updateTask,
} from '../services/api';

const formatForMySQL = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtasksMap, setSubtasksMap] = useState<Record<number, Subtask[]>>({});

  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [updatedTasks, setUpdatedTasks] = useState<Task[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<number[]>([]);

  const [createdSubtasks, setCreatedSubtasks] = useState<Subtask[]>([]);
  const [updatedSubtasks, setUpdatedSubtasks] = useState<Subtask[]>([]);
  const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<number[]>([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [currentSubtask, setCurrentSubtask] = useState<Subtask | null>(null);
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchAllTasks(token);
  }, [navigate]);

  const fetchAllTasks = async (token: string) => {
    setLoading(true);
    try {
      const res = await getTasks(token);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch tasks.');
    }
    setLoading(false);
  };

  const openCreateTaskModal = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleSaveTask = (taskData: Task) => {
    if (taskData.id) {
      setUpdatedTasks((prev) => {
        const exists = prev.find((t) => t.id === taskData.id);
        return exists
          ? prev.map((t) => (t.id === taskData.id ? taskData : t))
          : [...prev, taskData];
      });
    } else {
      setCreatedTasks((prev) => [...prev, taskData]);
    }
    setTasks((prev) => {
      const existing = prev.find((t) => t.id === taskData.id);
      return existing
        ? prev.map((t) => (t.id === taskData.id ? taskData : t))
        : [...prev, { ...taskData, id: Date.now() }];
    });
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: number) => {
    setDeletedTaskIds((prev) => [...prev, taskId]);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSubtasksMap((prev) => {
      const newMap = { ...prev };
      delete newMap[taskId];
      return newMap;
    });
  };

  const openCreateSubtaskModal = (task: Task) => {
    setCurrentSubtask(null);
    setParentTaskId(task.id || null);
    setIsSubtaskModalOpen(true);
  };

  const openEditSubtaskModal = (subtask: Subtask, parent: Task) => {
    setCurrentSubtask(subtask);
    setParentTaskId(parent.id || null);
    setIsSubtaskModalOpen(true);
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
  };

  const handleSaveSubtask = (subtaskData: Subtask) => {
    if (subtaskData.id) {
      setUpdatedSubtasks((prev) => {
        const exists = prev.find((s) => s.id === subtaskData.id);
        return exists
          ? prev.map((s) => (s.id === subtaskData.id ? subtaskData : s))
          : [...prev, subtaskData];
      });
    } else {
      const newSubtask = { ...subtaskData, id: Date.now() };
      setCreatedSubtasks((prev) => [...prev, newSubtask]);
      subtaskData = newSubtask;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === subtaskData.task_id
          ? {
              ...task,
              subtasks: task.subtasks
                ? [...task.subtasks.filter((s) => s.id !== subtaskData.id), subtaskData]
                : [subtaskData],
            }
          : task
      )
    );

    setSubtasksMap((prev) => {
      const taskId = subtaskData.task_id!;
      const existingSubtasks = prev[taskId] || [];
      const updatedSubtasks = existingSubtasks.filter((s) => s.id !== subtaskData.id);
      return {
        ...prev,
        [taskId]: [...updatedSubtasks, subtaskData],
      };
    });

    setIsSubtaskModalOpen(false);
  };

  const handleDeleteSubtask = (subtaskId: number, parentTaskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === parentTaskId
          ? {
              ...task,
              subtasks: task.subtasks ? task.subtasks.filter((s) => s.id !== subtaskId) : [],
            }
          : task
      )
    );

    setSubtasksMap((prev) => {
      const existingSubtasks = prev[parentTaskId] || [];
      return {
        ...prev,
        [parentTaskId]: existingSubtasks.filter((s) => s.id !== subtaskId),
      };
    });

    setDeletedSubtaskIds((prev) => [...prev, subtaskId]);
    setCreatedSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    setUpdatedSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
  };

  const getFilteredTasks = (): Task[] => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (dueDateFilter && (!task.due_date || task.due_date.slice(0, 10) !== dueDateFilter)) return false;
      return true;
    });
  };

  const handleSubmitAllChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      for (const task of createdTasks) {
        await createTask(token, task.title, task.description || '', task.status, formatForMySQL(task.due_date));
      }
      for (const task of updatedTasks) {
        if (task.id) {
          await updateTask(token, task.id, task.title, task.description || '', task.status, formatForMySQL(task.due_date));
        }
      }
      for (const taskId of deletedTaskIds) {
        await deleteTask(token, taskId);
      }
      for (const subtask of createdSubtasks) {
        await createSubtask(token, subtask.task_id!, subtask.title, subtask.status, formatForMySQL(subtask.due_date));
      }
      for (const subtask of updatedSubtasks) {
        if (subtask.id) {
          await updateSubtask(token, subtask.id, subtask.title, subtask.status, formatForMySQL(subtask.due_date));
        }
      }
      for (const subId of deletedSubtaskIds) {
        await deleteSubtask(token, subId);
      }

      setCreatedTasks([]);
      setUpdatedTasks([]);
      setDeletedTaskIds([]);
      setCreatedSubtasks([]);
      setUpdatedSubtasks([]);
      setDeletedSubtaskIds([]);

      fetchAllTasks(token);
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Error submitting changes', error);
      alert('Failed to submit changes.');
    }
  };

  const filteredTasks = getFilteredTasks().filter(task =>
    task.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
  <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded">
    

    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={openCreateTaskModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Task
        </button>
        <button
          onClick={handleSubmitAllChanges}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit Changes
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Search by Title</label>
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search..."
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status Filter</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        {dueDateFilter && (
          <button
            onClick={() => setDueDateFilter('')}
            className="text-sm text-blue-600 mt-1 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>

    {loading ? (
      <p>Loading tasks...</p>
    ) : (
      <TaskList
        tasks={filteredTasks}
        onEditTask={openEditTaskModal}
        onDeleteTask={handleDeleteTask}
        onAddSubtask={openCreateSubtaskModal}
        onEditSubtask={openEditSubtaskModal}
        onDeleteSubtask={handleDeleteSubtask}
        onOpenSubtasks={() => {}}
        subtasksMap={subtasksMap}
        setSubtasksMap={setSubtasksMap}
      />
    )}
  </div>

  {isTaskModalOpen && (
    <TaskFormModal
      item={currentTask}
      onClose={closeTaskModal}
      onSave={handleSaveTask}
    />
  )}

  {isSubtaskModalOpen && (
    <TaskFormModal
      item={currentSubtask}
      parentTaskId={parentTaskId}
      onClose={closeSubtaskModal}
      onSave={handleSaveSubtask}
    />
  )}
</div>

  );
};

export default Dashboard;
