import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ProjectDashboardData } from '@/models/project';
import { RowDataPacket } from 'mysql2';

// GET - Fetch project dashboard data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    // Fetch project with basic details
    const [projectRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(DISTINCT pm.user_id) as member_count,
        COUNT(DISTINCT t.id) as task_count,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       LEFT JOIN tasks t ON p.id = t.project_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [projectId]
    );

    if (projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectRows[0];

    // Fetch upcoming tasks (due within next 7 days)
    const [upcomingTasksRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        id, title, due_date, status, priority
       FROM tasks
       WHERE project_id = ?
       AND due_date IS NOT NULL
       AND due_date >= CURDATE()
       AND due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       AND status != 'completed'
       ORDER BY due_date ASC
       LIMIT 10`,
      [projectId]
    );

    // Calculate sprint progress
    const totalTasks = project.task_count || 0;
    const completedTasks = project.completed_tasks || 0;
    const sprintProgress = {
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      completed: completedTasks,
      total: totalTasks
    };

    // Fetch team members
    const [teamMembersRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        pm.*,
        u.name as user_name,
        u.email as user_email
       FROM project_members pm
       LEFT JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?
       ORDER BY pm.role, pm.joined_at`,
      [projectId]
    );

    // Fetch recent activity (last 10 activities)
    const [recentActivityRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        'task_created' as type,
        CONCAT('Task "', title, '" was created') as message,
        created_at as timestamp
       FROM tasks
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [projectId]
    );

    // Fetch project insights
    const [insightRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM project_insights
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [projectId]
    );

    const dashboardData = {
      project: {
        ...project,
        insights: insightRows
      },
      upcomingTasks: upcomingTasksRows,
      sprintProgress,
      teamMembers: teamMembersRows,
      recentActivity: recentActivityRows
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching project dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch project dashboard' }, { status: 500 });
  }
}
