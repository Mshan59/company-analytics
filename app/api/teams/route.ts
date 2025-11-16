// File: app/api/teams/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface TeamRow {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId: number;
  added_on: string;
}

// Fetch all teams
export async function GET(): Promise<NextResponse> {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.name, t.email, r.name AS role, r.id AS roleId, t.added_on
       FROM teams t
       JOIN roles r ON r.id = t.role_id
       ORDER BY t.id DESC`
    );
    return NextResponse.json(rows as TeamRow[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching teams" }, { status: 500 });
  }
}

// Insert a new user
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, roleId } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (!roleId || Number.isNaN(Number(roleId))) {
      return NextResponse.json({ error: "roleId is required" }, { status: 400 });
    }

    // Validate roleId exists
    const [r] = await pool.query("SELECT id, name FROM roles WHERE id = ?", [roleId]);
    if ((r as any[]).length === 0) {
      return NextResponse.json({ error: "Invalid roleId" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO teams (name, email, role_id) VALUES (?, ?, ?)", 
      [name, email, roleId]
    );
    
    // Get the timestamp from the database for the new record
    const [rows] = await pool.query("SELECT added_on FROM teams WHERE id = ?", [(result as any).insertId]);
    const added_on = (rows as any[])[0].added_on;
    
    return NextResponse.json({ 
      id: (result as any).insertId, 
      name, 
      email, 
      role: (r as any[])[0].name,
      roleId: Number(roleId),
      added_on
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
  }
}