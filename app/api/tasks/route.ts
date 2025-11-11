import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { CreateTaskRequest, Task } from '@/models/task';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assigned_to');
    const projectId = searchParams.get('project_id');

    let query = `
      SELECT t.*, u.name as assigned_to_name, creator.name as created_by_name 
      FROM tasks t 
      LEFT JOIN users u ON t.assigned_to = u.id 
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }
    if (assignedTo) {
      query += ' AND t.assigned_to = ?';
      params.push(parseInt(assignedTo));
    }
    if (projectId) {
      query += ' AND t.project_id = ?';
      params.push(parseInt(projectId));
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return NextResponse.json({ tasks: rows });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskRequest = await request.json();
    const { title, description, status = 'pending', priority = 'medium', assigned_to, project_id, due_date } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // For now, using a default created_by value. In a real app, this would come from JWT token
    const created_by = 1;

    const query = `
      INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, project_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [title, description, status, priority, assigned_to, created_by, project_id, due_date]
    );

    const taskId = result.insertId;

    // Fetch the created task with joined data
    const [taskRows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, u.name as assigned_to_name, creator.name as created_by_name 
       FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       LEFT JOIN users creator ON t.created_by = creator.id
       WHERE t.id = ?`,
      [taskId]
    );

    return NextResponse.json({ task: taskRows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
