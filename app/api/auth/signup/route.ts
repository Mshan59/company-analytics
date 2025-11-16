// // File: app/api/signup/route.ts
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";
import { deriveTierFromRoleName } from "@/lib/permissions";

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
    const { name, email, password, role: rawRole, orgRoleName, orgRoleId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Determine org role id and name if provided
    let orgRoleIdFinal: number | null = null;
    let orgRoleNameFinal: string | undefined = undefined;
    if (orgRoleId) {
      orgRoleIdFinal = Number(orgRoleId) || null;
      if (orgRoleIdFinal) {
        const [rname] = await pool.query("SELECT name FROM roles WHERE id=?", [orgRoleIdFinal]);
        orgRoleNameFinal = (rname as any[])[0]?.name as string | undefined;
      }
    } else if (orgRoleName) {
      const [rid] = await pool.query("SELECT id FROM roles WHERE name=?", [orgRoleName]);
      orgRoleIdFinal = (rid as any[])[0]?.id ?? null;
      orgRoleNameFinal = orgRoleName as string;
    }

    // Normalize and map incoming global tier
    const inputRole = (rawRole || '').toString().toLowerCase();
    let role: 'owner' | 'admin' | 'manager' | 'member' = 'member';
    if (inputRole) {
      if (inputRole === 'super-admin' || inputRole === 'owner' || inputRole === 'ceo') role = 'owner';
      else if (inputRole === 'admin' || inputRole === 'manager') role = 'admin';
      else role = 'member';
    } else if (orgRoleNameFinal) {
      const tier = deriveTierFromRoleName(orgRoleNameFinal);
      role = tier;
    }

    // Enforce singletons
    if (role === 'owner') {
      const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'owner'");
      const cnt = (rows as any[])[0]?.cnt ?? 0;
      if (cnt > 0) {
        return NextResponse.json({ error: 'Super Admin already exists' }, { status: 409 });
      }
    }

    if (role === 'admin') {
      const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'admin'");
      const cnt = (rows as any[])[0]?.cnt ?? 0;
      if (cnt > 0) {
        return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, org_role_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, orgRoleIdFinal]
    );

    // Fetch the created_at field for the new user
    const [rows] = await pool.query("SELECT created_at FROM users WHERE id = ?", [(result as any).insertId]);
    const created_at = (rows as any[])[0]?.created_at;

    return NextResponse.json({
      id: (result as any).insertId,
      name,
      email,
      role,
      org_role_id: orgRoleIdFinal,
      org_role_name: orgRoleNameFinal,
      created_at
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Error inserting user" }, { status: 500 });
  }
}
