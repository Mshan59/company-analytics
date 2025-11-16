import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET single timesheet
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.user_id AS userId, u.name AS userName,
              t.project_id AS projectId, p.name AS projectName,
              t.team_id AS teamId, tm.name AS teamName,
              t.work_date AS workDate, t.hours, t.notes, t.created_at AS createdAt
         FROM timesheets t
         LEFT JOIN users u ON u.id = t.user_id
         LEFT JOIN projects p ON p.id = t.project_id
         LEFT JOIN teams tm ON tm.id = t.team_id
         WHERE t.id = ?`,
      [id]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ timesheet: rows[0] });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to get timesheet' }, { status: 500 });
  }
}

// PUT update timesheet
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await req.json();
    const { userId, projectId, teamId, workDate, hours, notes } = body as {
      userId?: number; projectId?: number|null; teamId?: number|null; workDate?: string; hours?: number; notes?: string|null;
    };

    const sets: string[] = [];
    const vals: any[] = [];
    if (userId !== undefined) { sets.push('user_id = ?'); vals.push(userId); }
    if (projectId !== undefined) { sets.push('project_id = ?'); vals.push(projectId); }
    if (teamId !== undefined) { sets.push('team_id = ?'); vals.push(teamId); }
    if (workDate !== undefined) { sets.push('work_date = ?'); vals.push(workDate); }
    if (hours !== undefined) { sets.push('hours = ?'); vals.push(Number(hours)); }
    if (notes !== undefined) { sets.push('notes = ?'); vals.push(notes); }

    if (sets.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    vals.push(id);
    const [res] = await pool.execute<ResultSetHeader>(`UPDATE timesheets SET ${sets.join(', ')} WHERE id = ?`, vals);
    if ((res as ResultSetHeader).affectedRows === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.user_id AS userId, u.name AS userName,
              t.project_id AS projectId, p.name AS projectName,
              t.team_id AS teamId, tm.name AS teamName,
              t.work_date AS workDate, t.hours, t.notes, t.created_at AS createdAt
         FROM timesheets t
         LEFT JOIN users u ON u.id = t.user_id
         LEFT JOIN projects p ON p.id = t.project_id
         LEFT JOIN teams tm ON tm.id = t.team_id
         WHERE t.id = ?`,
      [id]
    );
    return NextResponse.json({ timesheet: rows[0] });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update timesheet' }, { status: 500 });
  }
}

// DELETE timesheet
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const [res] = await pool.execute<ResultSetHeader>('DELETE FROM timesheets WHERE id = ?', [id]);
    if ((res as ResultSetHeader).affectedRows === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete timesheet' }, { status: 500 });
  }
}
