import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch project insights
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    const [insightRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM project_insights
       WHERE project_id = ?
       ORDER BY created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ insights: insightRows });
  } catch (error) {
    console.error('Error fetching project insights:', error);
    return NextResponse.json({ error: 'Failed to fetch project insights' }, { status: 500 });
  }
}

// POST - Add insight to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();
    const { insight_type = 'suggestion', message, severity = 'medium' } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO project_insights (project_id, insight_type, message, severity) VALUES (?, ?, ?, ?)',
      [projectId, insight_type, message, severity]
    );

    const [insightRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM project_insights WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({ insight: insightRows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding project insight:', error);
    return NextResponse.json({ error: 'Failed to add project insight' }, { status: 500 });
  }
}
