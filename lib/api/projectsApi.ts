/**
 * API Service Layer for Projects
 * Handles all API calls to the backend
 */

import { 
  Project, 
  ProjectWithDetails, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ProjectDashboardData,
  ProjectListFilters 
} from '@/models/project';

const API_BASE = '/api/projects';

/**
 * Fetch all projects with optional filters
 */
export async function fetchProjects(filters?: ProjectListFilters): Promise<Project[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.team_id) params.append('team_id', filters.team_id.toString());
    if (filters?.search) params.append('search', filters.search);

    const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Fetch single project by ID
 */
export async function fetchProjectById(id: number): Promise<ProjectWithDetails> {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Create a new project
 */
export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }
    
    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Update a project
 */
export async function updateProject(id: number, updates: Partial<UpdateProjectRequest>): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }
    
    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Fetch project dashboard data
 */
export async function fetchProjectDashboard(id: number): Promise<ProjectDashboardData> {
  try {
    const response = await fetch(`${API_BASE}/${id}/dashboard`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
}

/**
 * Fetch project statistics
 */
export async function fetchProjectStats(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

/**
 * Add member to project
 */
export async function addProjectMember(projectId: number, userId: number, role: string = 'member'): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, role }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add member');
    }
    
    const data = await response.json();
    return data.member;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
}

/**
 * Remove member from project
 */
export async function removeProjectMember(projectId: number, userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/members?user_id=${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove member');
    }
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}

/**
 * Add insight to project
 */
export async function addProjectInsight(
  projectId: number, 
  insightType: string, 
  message: string, 
  severity: string = 'medium'
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ insight_type: insightType, message, severity }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add insight');
    }
    
    const data = await response.json();
    return data.insight;
  } catch (error) {
    console.error('Error adding insight:', error);
    throw error;
  }
}
