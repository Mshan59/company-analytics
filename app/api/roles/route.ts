import { NextResponse } from "next/server";
import { ROLE_HIERARCHY, DEPARTMENTS, Role } from "@/models/roles";

export type RolesResponse = {
  roles: Role[];
  hierarchy: Record<string, Role[]>;
  departments: Record<string, Role[]>;
};

export async function GET() {
  try {
    const rolesSet = new Set<Role>();

    Object.keys(ROLE_HIERARCHY).forEach((k) => rolesSet.add(k as Role));
    Object.values(ROLE_HIERARCHY).flat().forEach((r) => rolesSet.add(r));
    Object.values(DEPARTMENTS).flat().forEach((r) => rolesSet.add(r));

    const payload: RolesResponse = {
      roles: Array.from(rolesSet).sort(),
      hierarchy: ROLE_HIERARCHY,
      departments: DEPARTMENTS,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error building roles payload", error);
    return NextResponse.json({ error: "Error fetching roles" }, { status: 500 });
  }
}
