import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { CreateProjectRequest, Project, ProjectWithDetails } from '@/models/project';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch all projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const teamId = searchParams.get('team_id');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(DISTINCT pm.user_id) as member_count,
        COUNT(DISTINCT t.id) as task_count,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND p.priority = ?';
      params.push(priority);
    }
    if (teamId) {
      query += ' AND p.team_id = ?';
      params.push(parseInt(teamId));
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectRequest = await request.json();
    const { 
      name, 
      description, 
      status = 'open', 
      priority = 'medium', 
      category = '',
      start_date, 
      end_date,
      team_id,
      member_ids = []
    } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    // For now, using a default created_by value. In a real app, this would come from JWT token
    const created_by = 1;

    const query = `
      INSERT INTO projects (name, description, status, priority, category, start_date, end_date, created_by, team_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [name, description, status, priority, category, start_date, end_date, created_by, team_id]
    );

    const projectId = result.insertId;

    // Add project members if provided
    if (member_ids.length > 0) {
      const memberQuery = 'INSERT INTO project_members (project_id, user_id, role) VALUES ?';
      const memberValues = member_ids.map(userId => [projectId, userId, 'member']);
      await pool.query(memberQuery, [memberValues]);
    }

    // Add creator as owner
    await pool.execute(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [projectId, created_by, 'owner']
    );

    // Fetch the created project with joined data
    const [projectRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(DISTINCT pm.user_id) as member_count
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [projectId]
    );

    return NextResponse.json({ project: projectRows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
