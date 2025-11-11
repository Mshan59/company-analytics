"use client";
import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest } from '@/models/task';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Plus, Filter } from 'lucide-react';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_to: '',
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.assigned_to) queryParams.append('assigned_to', filters.assigned_to);

      const response = await fetch(`/api/tasks?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks);
      } else {
        console.error('Failed to fetch tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Create new task
  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTasks([data.task, ...tasks]);
        setShowForm(false);
      } else {
        console.error('Failed to create task:', data.error);
        alert('Failed to create task: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  // Update task
  const handleUpdateTask = async (taskData: CreateTaskRequest & { id: number }) => {
    try {
      const response = await fetch(`/api/tasks/${taskData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTasks(tasks.map(task => task.id === taskData.id ? data.task : task));
        setEditingTask(null);
        setShowForm(false);
      } else {
        console.error('Failed to update task:', data.error);
        alert('Failed to update task: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        const data = await response.json();
        console.error('Failed to delete task:', data.error);
        alert('Failed to delete task: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task');
    }
  };

  // Update task status
  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTasks(tasks.map(task => task.id === taskId ? data.task : task));
      } else {
        console.error('Failed to update task status:', data.error);
        alert('Failed to update task status: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task status');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {filters.status || filters.priority ? (
            <button
              onClick={() => setFilters({ status: '', priority: '', assigned_to: '' })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Task Stats */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Task Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => t.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
