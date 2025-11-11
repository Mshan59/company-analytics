"use client";

import React from 'react';
import { Calendar, CircleCheck, AlertTriangle, XCircle, Circle } from 'lucide-react';
import { Project } from '@/models/project';
import { formatDateRange, getStatusColor, getPriorityColor } from '@/lib/projectHelpers';

interface ProjectCardProps {
  project: Project & { member_count?: number; task_count?: number; completed_tasks?: number };
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CircleCheck className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'open':
        return <Circle className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'blocked':
        return 'bg-red-500';
      case 'open':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'at-risk':
        return 'At Risk';
      case 'blocked':
        return 'Blocked';
      case 'open':
        return 'Open';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {getPriorityText(project.priority)}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{project.category || project.description}</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
          <div
            className={`h-2 rounded-full ${getProgressColor(project.status)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>

        {/* Date range */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDateRange(project.start_date, project.end_date)}
          </div>
          <div className={`px-3 py-1 rounded-md text-sm ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </div>
        </div>

        {/* Team members and task count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <div className="flex -space-x-2 mr-2">
              {/* Placeholder avatars */}
              {[...Array(Math.min(project.member_count || 0, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {(project.member_count || 0) > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-200 text-gray-600 text-xs">
                  +{(project.member_count || 0) - 3}
                </div>
              )}
            </div>
            <span>{project.member_count || 0} members</span>
          </div>

          <div className="text-sm text-gray-600">
            {project.completed_tasks || 0}/{project.task_count || 0} tasks
          </div>
        </div>

        {/* Status and insights */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {getStatusIcon(project.status)}
            <span className="ml-2 text-sm text-gray-700">{getStatusText(project.status)}</span>
          </div>
          <div className="text-purple-600 text-sm font-medium hover:text-purple-700">
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
