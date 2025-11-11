// // File: app/api/signup/route.ts
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// // interface User {
// //   id: number;
// //   name: string;
// //   email: string;
// //   password: string;
// //   added_on: string;
// // }


// // Insert a new user
// export async function POST(req: Request): Promise<NextResponse> {
//   try {
//     const { name, email, password } = await req.json();
    
//     if (!name || !email) {
//       return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
//     }
  

//     const [result] = await pool.query(
//       "INSERT INTO teams (name, email, password) VALUES (?, ?, ?)", 
//       [name, email, password]
//     );
    
//     // Get the timestamp from the database for the new record
//     const [rows] = await pool.query("SELECT added_on FROM users WHERE id = ?", [(result as any).insertId]);
//     const added_on = (rows as any[])[0].added_on;
    
//     return NextResponse.json({ 
//       id: (result as any).insertId, 
//       name, 
//       email, 
//       password,
//       added_on
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
//   }
// }



// File: app/api/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Fetch the created_at field for the new user
    const [rows] = await pool.query("SELECT created_at FROM users WHERE id = ?", [(result as any).insertId]);
    const created_at = (rows as any[])[0]?.created_at;

    return NextResponse.json({
      id: (result as any).insertId,
      name,
      email,
      created_at
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
  }
}
