
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
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users[0]);
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
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
    
    const affectedRows = (result as any).affectedRows;
    
    if (affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id, name, email });
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
    
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    
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