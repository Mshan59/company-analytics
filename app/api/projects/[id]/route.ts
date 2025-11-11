import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { UpdateProjectRequest } from '@/models/project';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch single project by ID with full details
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

    // Fetch project members
    const [memberRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        pm.*,
        u.name as user_name,
        u.email as user_email
       FROM project_members pm
       LEFT JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?`,
      [projectId]
    );

    // Fetch project insights
    const [insightRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM project_insights
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [projectId]
    );

    const projectWithDetails = {
      ...project,
      members: memberRows,
      insights: insightRows
    };

    return NextResponse.json({ project: projectWithDetails });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body: UpdateProjectRequest = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    if (body.name !== undefined) {
      updates.push('name = ?');
      values.push(body.name);
    }
    if (body.description !== undefined) {
      updates.push('description = ?');
      values.push(body.description);
    }
    if (body.status !== undefined) {
      updates.push('status = ?');
      values.push(body.status);
    }
    if (body.priority !== undefined) {
      updates.push('priority = ?');
      values.push(body.priority);
    }
    if (body.category !== undefined) {
      updates.push('category = ?');
      values.push(body.category);
    }
    if (body.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(body.start_date);
    }
    if (body.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(body.end_date);
    }
    if (body.team_id !== undefined) {
      updates.push('team_id = ?');
      values.push(body.team_id);
    }
    if (body.progress !== undefined) {
      updates.push('progress = ?');
      values.push(body.progress);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(projectId);

    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(query, values);

    // Fetch updated project
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

    return NextResponse.json({ project: projectRows[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    // Delete project members first (foreign key constraint)
    await pool.execute('DELETE FROM project_members WHERE project_id = ?', [projectId]);
    
    // Delete project insights
    await pool.execute('DELETE FROM project_insights WHERE project_id = ?', [projectId]);
    
    // Update tasks to remove project reference
    await pool.execute('UPDATE tasks SET project_id = NULL WHERE project_id = ?', [projectId]);

    // Delete the project
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM projects WHERE id = ?',
      [projectId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
