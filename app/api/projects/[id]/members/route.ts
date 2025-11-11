import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch project members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    const [memberRows] = await pool.execute<RowDataPacket[]>(
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

    return NextResponse.json({ members: memberRows });
  } catch (error) {
    console.error('Error fetching project members:', error);
    return NextResponse.json({ error: 'Failed to fetch project members' }, { status: 500 });
  }
}

// POST - Add member to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();
    const { user_id, role = 'member' } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if member already exists
    const [existingMembers] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, user_id]
    );

    if (existingMembers.length > 0) {
      return NextResponse.json({ error: 'User is already a member of this project' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [projectId, user_id, role]
    );

    // Fetch the added member with user details
    const [memberRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        pm.*,
        u.name as user_name,
        u.email as user_email
       FROM project_members pm
       LEFT JOIN users u ON pm.user_id = u.id
       WHERE pm.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ member: memberRows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding project member:', error);
    return NextResponse.json({ error: 'Failed to add project member' }, { status: 500 });
  }
}

// DELETE - Remove member from project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, parseInt(userId)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing project member:', error);
    return NextResponse.json({ error: 'Failed to remove project member' }, { status: 500 });
  }
}
