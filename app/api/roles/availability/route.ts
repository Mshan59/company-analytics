import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [ownerRows] = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role='owner'");
    const [adminRows] = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role='admin'");
    const ownerCount = (ownerRows as any[])[0]?.cnt ?? 0;
    const adminCount = (adminRows as any[])[0]?.cnt ?? 0;

    return NextResponse.json({
      ownerExists: ownerCount > 0,
      adminExists: adminCount > 0,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to check roles" }, { status: 500 });
  }
}
