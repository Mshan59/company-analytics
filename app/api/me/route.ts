import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';
import { canAddTeam, canViewBudget, canManageBudget } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId, id, email, name, role } = payload as any;

    // Fetch org role name from DB if available
    let orgRoleName: string | null = null;
    try {
      const dbId = userId || id;
      if (dbId) {
        const [rows] = await pool.query(
          `SELECT r.name AS orgRoleName
           FROM users u
           LEFT JOIN roles r ON r.id = u.org_role_id
           WHERE u.id = ?`,
          [dbId]
        );
        orgRoleName = (rows as any[])[0]?.orgRoleName ?? null;
      }
    } catch {}

    const tier = (role || 'member') as any;
    const can_add_team = canAddTeam({ tier, orgRoleName: orgRoleName || undefined });
    const can_view_budget = canViewBudget(tier);
    const can_manage_budget = canManageBudget(tier);

    return NextResponse.json({
      id: userId || id,
      email,
      name,
      role,
      orgRoleName,
      permissions: {
        canAddTeam: can_add_team,
        canViewBudget: can_view_budget,
        canManageBudget: can_manage_budget,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
