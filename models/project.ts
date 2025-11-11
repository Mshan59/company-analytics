export type Project = {
  id: number;
  name: string;
  description: string;
  status: 'open' | 'at-risk' | 'blocked' | 'on-track';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  start_date: string | null;
  end_date: string | null;
  created_by: number;
  team_id: number | null;
  progress: number;
  created_at: string;
  updated_at: string;
};

export type ProjectWithDetails = Project & {
  created_by_name?: string;
  team_name?: string;
  member_count?: number;
  task_count?: number;
  completed_tasks?: number;
  members?: ProjectMember[];
  insights?: ProjectInsight[];
};

export type ProjectMember = {
  id: number;
  project_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
  user_name?: string;
  user_email?: string;
};

export type ProjectInsight = {
  id: number;
  project_id: number;
  insight_type: 'risk' | 'suggestion' | 'milestone' | 'alert';
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
};

export type CreateProjectRequest = {
  name: string;
  description: string;
  status?: 'open' | 'at-risk' | 'blocked' | 'on-track';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  start_date?: string | null;
  end_date?: string | null;
  team_id?: number | null;
  member_ids?: number[];
};

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  id: number;
  progress?: number;
};

export type ProjectDashboardData = {
  project: ProjectWithDetails;
  upcomingTasks: Array<{
    id: number;
    title: string;
    due_date: string;
    status: string;
    priority: string;
  }>;
  sprintProgress: {
    percentage: number;
    completed: number;
    total: number;
  };
  teamMembers: ProjectMember[];
  recentActivity: Array<{
    id: number;
    type: 'task_created' | 'task_completed' | 'member_added' | 'status_changed';
    message: string;
    timestamp: string;
  }>;
};

export type ProjectListFilters = {
  status?: string;
  priority?: string;
  team_id?: number;
  search?: string;
};
