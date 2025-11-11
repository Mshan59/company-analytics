export type Task = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: number | null; // user id
  created_by: number; // user id
  project_id: number | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number | null;
  project_id?: number | null;
  due_date?: string | null;
};

export type UpdateTaskRequest = Partial<CreateTaskRequest> & {
  id: number;
};
