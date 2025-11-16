import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/timesheets?userId=&projectId=&teamId=&from=&to=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');
    const teamId = searchParams.get('teamId');
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    const where: string[] = [];
    const params: any[] = [];
    if (userId) { where.push('t.user_id = ?'); params.push(Number(userId)); }
    if (projectId) { where.push('t.project_id = ?'); params.push(Number(projectId)); }
    if (teamId) { where.push('t.team_id = ?'); params.push(Number(teamId)); }
    if (from && to) { where.push('t.work_date BETWEEN ? AND ?'); params.push(from, to); }
    else if (from) { where.push('t.work_date >= ?'); params.push(from); }
    else if (to) { where.push('t.work_date <= ?'); params.push(to); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.user_id AS userId, u.name AS userName,
              t.project_id AS projectId, p.name AS projectName,
              t.team_id AS teamId, tm.name AS teamName,
              t.work_date AS workDate, t.hours, t.notes, t.created_at AS createdAt
         FROM timesheets t
         LEFT JOIN users u ON u.id = t.user_id
         LEFT JOIN projects p ON p.id = t.project_id
         LEFT JOIN teams tm ON tm.id = t.team_id
         ${whereSql}
         ORDER BY t.work_date DESC, t.created_at DESC`,
      params
    );

    return NextResponse.json({ timesheets: rows });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list timesheets' }, { status: 500 });
  }
}

// POST /api/timesheets
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, projectId, teamId, workDate, hours, notes } = body as {
      userId: number; projectId?: number|null; teamId?: number|null; workDate: string; hours: number; notes?: string|null;
    };

    if (!userId || !workDate || hours === undefined) {
      return NextResponse.json({ error: 'userId, workDate, hours are required' }, { status: 400 });
    }

    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO timesheets (user_id, project_id, team_id, work_date, hours, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, projectId ?? null, teamId ?? null, workDate, Number(hours), notes ?? null]
    );

    const id = (res as ResultSetHeader).insertId;
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

    return NextResponse.json({ timesheet: rows[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create timesheet' }, { status: 500 });
  }
}
