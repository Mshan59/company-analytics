/**
 * Helper functions for project-related operations
 */

import { Project, ProjectWithDetails } from '@/models/project';

/**
 * Calculate project progress based on task completion
 */
export function calculateProjectProgress(totalTasks: number, completedTasks: number): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Get status color for UI display
 */
export function getStatusColor(status: Project['status']): string {
  const colors = {
    'open': 'bg-purple-100 text-purple-700',
    'on-track': 'bg-green-100 text-green-700',
    'at-risk': 'bg-yellow-100 text-yellow-700',
    'blocked': 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

/**
 * Get priority color for UI display
 */
export function getPriorityColor(priority: Project['priority']): string {
  const colors = {
    'low': 'bg-blue-100 text-blue-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-orange-100 text-orange-700',
    'urgent': 'bg-red-100 text-red-700'
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return 'No dates set';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const formatDate = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };
  
  return `${formatDate(start)} - ${formatDate(end)}`;
}

/**
 * Check if project is overdue
 */
export function isProjectOverdue(endDate: string | null, status: Project['status']): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  const today = new Date();
  return end < today;
}

/**
 * Get days remaining until project deadline
 */
export function getDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get project health status based on multiple factors
 */
export function getProjectHealth(project: ProjectWithDetails): 'healthy' | 'warning' | 'critical' {
  const { status, progress, task_count = 0, completed_tasks = 0 } = project;
  
  if (status === 'blocked') return 'critical';
  if (status === 'at-risk') return 'warning';
  
  const daysRemaining = getDaysRemaining(project.end_date);
  if (daysRemaining !== null && daysRemaining < 7 && progress < 80) {
    return 'warning';
  }
  
  if (daysRemaining !== null && daysRemaining < 0) {
    return 'critical';
  }
  
  return 'healthy';
}

/**
 * Filter projects by search query
 */
export function filterProjectsBySearch(projects: Project[], searchQuery: string): Project[] {
  if (!searchQuery.trim()) return projects;
  
  const query = searchQuery.toLowerCase();
  return projects.filter(project => 
    project.name.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query) ||
    project.category?.toLowerCase().includes(query)
  );
}

/**
 * Sort projects by different criteria
 */
export function sortProjects(
  projects: Project[], 
  sortBy: 'name' | 'created_at' | 'end_date' | 'priority' | 'status',
  order: 'asc' | 'desc' = 'asc'
): Project[] {
  const sorted = [...projects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'end_date':
        const dateA = a.end_date ? new Date(a.end_date).getTime() : 0;
        const dateB = b.end_date ? new Date(b.end_date).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case 'priority':
        const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}

/**
 * Group projects by status
 */
export function groupProjectsByStatus(projects: Project[]): Record<Project['status'], Project[]> {
  return projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<Project['status'], Project[]>);
}

/**
 * Get project completion percentage text
 */
export function getProgressText(progress: number): string {
  if (progress === 0) return 'Not started';
  if (progress === 100) return 'Completed';
  return `${progress}% complete`;
}

/**
 * Validate project dates
 */
export function validateProjectDates(startDate: string | null, endDate: string | null): {
  valid: boolean;
  error?: string;
} {
  if (!startDate || !endDate) {
    return { valid: true }; // Dates are optional
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  return { valid: true };
}

/**
 * Get insight severity icon
 */
export function getInsightIcon(type: 'risk' | 'suggestion' | 'milestone' | 'alert'): string {
  const icons = {
    risk: '⚠️',
    suggestion: '💡',
    milestone: '🎯',
    alert: '🔔'
  };
  return icons[type] || '📌';
}

/**
 * Format member count for display
 */
export function formatMemberCount(count: number): string {
  if (count === 0) return 'No members';
  if (count === 1) return '1 member';
  return `${count} members`;
}

/**
 * Get project status badge text
 */
export function getStatusBadgeText(status: Project['status']): string {
  const texts = {
    'open': 'Open',
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    'blocked': 'Blocked'
  };
  return texts[status] || status;
}
