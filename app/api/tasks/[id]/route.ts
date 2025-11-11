import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { UpdateTaskRequest } from '@/models/task';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, u.name as assigned_to_name, creator.name as created_by_name 
       FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       LEFT JOIN users creator ON t.created_by = creator.id
       WHERE t.id = ?`,
      [taskId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task: rows[0] });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    const body: UpdateTaskRequest = await request.json();

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const { title, description, status, priority, assigned_to, project_id, due_date } = body;

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (assigned_to !== undefined) {
      updateFields.push('assigned_to = ?');
      updateValues.push(assigned_to);
    }
    if (project_id !== undefined) {
      updateFields.push('project_id = ?');
      updateValues.push(project_id);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(due_date);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(taskId);

    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await pool.execute<ResultSetHeader>(query, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Fetch updated task
    const [taskRows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, u.name as assigned_to_name, creator.name as created_by_name 
       FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       LEFT JOIN users creator ON t.created_by = creator.id
       WHERE t.id = ?`,
      [taskId]
    );

    return NextResponse.json({ task: taskRows[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM tasks WHERE id = ?',
      [taskId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
