// File: app/api/teams/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

interface RequestParams {
  params: {
    id: string;
  };
}

// Get a specific user
export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    const id = params.id;
    const [rows] = await pool.query(
      `SELECT t.id, t.name, t.email, r.name AS role, r.id AS roleId, t.added_on
       FROM teams t
       JOIN roles r ON r.id = t.role_id
       WHERE t.id = ?`,
      [id]
    );
    const teams = rows as any[];

    if (teams.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(teams[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

// Update a specific user
export async function PUT(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    const id = params.id;
    const { name, email, roleId } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!roleId || Number.isNaN(Number(roleId))) {
      return NextResponse.json({ error: "roleId is required" }, { status: 400 });
    }
    // Validate roleId exists
    const [r] = await pool.query("SELECT id FROM roles WHERE id = ?", [roleId]);
    if ((r as any[]).length === 0) {
      return NextResponse.json({ error: "Invalid roleId" }, { status: 400 });
    }

    const [result] = await pool.query(
      "UPDATE teams SET name = ?, email = ?, role_id = ? WHERE id = ?",
      [name, email, roleId, id]
    );
    
    const affectedRows = (result as any).affectedRows;
    
    if (affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the updated record from the database to include all fields
    const [rows] = await pool.query(
      `SELECT t.id, t.name, t.email, r.name AS role, r.id AS roleId, t.added_on
       FROM teams t
       JOIN roles r ON r.id = t.role_id
       WHERE t.id = ?`,
      [id]
    );
    const updatedUser = (rows as any[])[0];

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

// Delete a specific user
export async function DELETE(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    const id = params.id;
    
    const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [id]);
    
    const affectedRows = (result as any).affectedRows;
    
    if (affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}