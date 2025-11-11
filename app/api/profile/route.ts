import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user ID
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    // Fetch user profile from database
    const [rows] = await pool.query(
      `SELECT 
        id, name, email, phone, address, firm, position, 
        specialty, bar_number as barNumber, years_experience as yearsExperience, 
        education, bio
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user ID
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    // Get updated data from request
    const data = await request.json();
    const {
      name,
      email,
      phone,
      address,
      firm,
      position,
      specialty,
      barNumber,
      yearsExperience,
      education,
      bio
    } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update user profile in database
    const [result] = await pool.query(
      `UPDATE users 
      SET name = ?, email = ?, phone = ?, address = ?, firm = ?, 
          position = ?, specialty = ?, bar_number = ?, years_experience = ?, 
          education = ?, bio = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        name,
        email,
        phone || null,
        address || null,
        firm || null,
        position || null,
        specialty || null,
        barNumber || null,
        yearsExperience || null,
        education || null,
        bio || null,
        userId
      ]
    );

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch and return updated profile
    const [rows] = await pool.query(
      `SELECT 
        id, name, email, phone, address, firm, position, 
        specialty, bar_number as barNumber, years_experience as yearsExperience, 
        education, bio
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
