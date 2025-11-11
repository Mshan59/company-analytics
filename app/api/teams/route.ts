// File: app/api/teams/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Role, isRole } from "@/models/roles";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  added_on: string;
}

// Fetch all teams
export async function GET(): Promise<NextResponse> {
  try {
    const [rows] = await pool.query("SELECT * FROM teams");
    return NextResponse.json(rows as User[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching teams" }, { status: 500 });
  }
}

// Insert a new user
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, role } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    
    // Use the role provided or default to a sensible role if not specified
    const userRole: Role = isRole(role) ? role : 'Frontend Developer';
    if (!isRole(userRole)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO teams (name, email, role) VALUES (?, ?, ?)", 
      [name, email, userRole]
    );
    
    // Get the timestamp from the database for the new record
    const [rows] = await pool.query("SELECT added_on FROM teams WHERE id = ?", [(result as any).insertId]);
    const added_on = (rows as any[])[0].added_on;
    
    return NextResponse.json({ 
      id: (result as any).insertId, 
      name, 
      email, 
      role: userRole,
      added_on
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
  }
}