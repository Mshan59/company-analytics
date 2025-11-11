// File: app/api/users/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface User {
  id: number;
  name: string;
  email: string;
}

// Fetch all users
export async function GET(): Promise<NextResponse> {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return NextResponse.json(rows as User[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// Insert a new user
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const [result] = await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    return NextResponse.json({ id: (result as any).insertId, name, email });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
  }
}