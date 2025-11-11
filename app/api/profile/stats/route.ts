import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/profile/stats - Get current user's profile statistics
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

    let activeCases = 0;
    let completedCases = 0;
    let hoursBilled = 0;

    try {
      // Count active cases (status = 'active' or 'in_progress')
      const [activeCasesResult] = await pool.query(
        `SELECT COUNT(*) as count 
         FROM projects 
         WHERE user_id = ? AND status IN ('active', 'in_progress')`,
        [userId]
      );
      activeCases = (activeCasesResult as any[])[0]?.count || 0;

      // Count completed cases (status = 'completed')
      const [completedCasesResult] = await pool.query(
        `SELECT COUNT(*) as count 
         FROM projects 
         WHERE user_id = ? AND status = 'completed'`,
        [userId]
      );
      completedCases = (completedCasesResult as any[])[0]?.count || 0;

      // Calculate hours billed (sum of all tasks' estimated_hours for user's projects)
      const [hoursResult] = await pool.query(
        `SELECT COALESCE(SUM(t.estimated_hours), 0) as totalHours
         FROM tasks t
         INNER JOIN projects p ON t.project_id = p.id
         WHERE p.user_id = ?`,
        [userId]
      );
      hoursBilled = Math.round((hoursResult as any[])[0]?.totalHours || 0);
    } catch (dbError) {
      // If projects/tasks tables don't exist or have different structure, return zeros
      console.warn("Could not fetch project stats, using default values:", dbError);
    }

    // Calculate success rate (completed / total)
    const totalCases = activeCases + completedCases;
    const successRate = totalCases > 0 
      ? `${Math.round((completedCases / totalCases) * 100)}%` 
      : "0%";

    return NextResponse.json({
      activeCases,
      completedCases,
      successRate,
      hoursBilled
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return NextResponse.json({ error: "Error fetching profile stats" }, { status: 500 });
  }
}
