"use client";
import React from 'react';
import { Task } from '@/models/task';
import { Calendar, User, Flag, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task & { assigned_to_name?: string; created_by_name?: string };
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-4">
          {task.title}
        </h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        {task.assigned_to_name && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{task.assigned_to_name}</span>
          </div>
        )}
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Created {formatDate(task.created_at)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
