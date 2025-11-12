"use client";

import React, { useEffect, useState } from "react";
import ProjectList from "@/components/Projects/ProjectList";
import TaskManager from "@/components/Tasks/TaskManager";

type Me = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

function isOwnerOrAdmin(role?: string) {
  if (!role) return false;
  const r = role.toLowerCase();
  const ownerSet = new Set(["owner", "admin", "ceo", "cto", "coo", "cmo"]);
  return ownerSet.has(r);
}

function isManager(role?: string) {
  if (!role) return false;
  const r = role.toLowerCase();
  return r.includes("manager") || r.includes("lead");
}

const RoleBasedDashboard: React.FC = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/me", { method: "GET" });
        if (!res.ok) {
          throw new Error(`Failed to load user: ${res.status}`);
        }
        const data = (await res.json()) as Me;
        setMe(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !me) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          {error || "You are not authenticated."}
        </div>
      </div>
    );
  }

  const role = me.role || "";

  if (isOwnerOrAdmin(role)) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Budget Overview (Owner/Admin)</h2>
          <p className="text-gray-600 text-sm mb-4">
            This area is visible only to owners/admins. Hook your budget module here.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-purple-50 border border-purple-100">
              <div className="text-sm text-gray-600">Total Company Budget</div>
              <div className="text-2xl font-bold text-purple-700">₹ —</div>
            </div>
            <div className="p-4 rounded-md bg-green-50 border border-green-100">
              <div className="text-sm text-gray-600">Allocated</div>
              <div className="text-2xl font-bold text-green-700">₹ —</div>
            </div>
            <div className="p-4 rounded-md bg-blue-50 border border-blue-100">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="text-2xl font-bold text-blue-700">₹ —</div>
            </div>
          </div>
        </div>
        <ProjectList />
      </div>
    );
  }

  if (isManager(role)) {
    return <ProjectList />;
  }

  // Team member default
  return <TaskManager />;
};

export default RoleBasedDashboard;
