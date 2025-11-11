import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET - Fetch overall project statistics for home page
export async function GET(request: NextRequest) {
  try {
    // Get total projects count by status
    const [statusStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        status,
        COUNT(*) as count
       FROM projects
       GROUP BY status`
    );

    // Get total projects count by priority
    const [priorityStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        priority,
        COUNT(*) as count
       FROM projects
       GROUP BY priority`
    );

    // Get overall statistics
    const [overallStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(DISTINCT p.id) as total_projects,
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
        COUNT(DISTINCT pm.user_id) as total_members,
        COUNT(DISTINCT CASE WHEN p.status = 'at-risk' THEN p.id END) as at_risk_projects,
        COUNT(DISTINCT CASE WHEN p.status = 'blocked' THEN p.id END) as blocked_projects
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       LEFT JOIN project_members pm ON p.id = pm.project_id`
    );

    // Get recent projects
    const [recentProjects] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(DISTINCT pm.user_id) as member_count,
        COUNT(DISTINCT t.id) as task_count
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       LEFT JOIN tasks t ON p.id = t.project_id
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT 5`
    );

    // Get projects by team
    const [teamStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        p.team_id,
        COUNT(*) as project_count
       FROM projects p
       WHERE p.team_id IS NOT NULL
       GROUP BY p.team_id`
    );

    const statistics = {
      overall: overallStats[0],
      byStatus: statusStats,
      byPriority: priorityStats,
      byTeam: teamStats,
      recentProjects: recentProjects
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching project statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch project statistics' }, { status: 500 });
  }
}
