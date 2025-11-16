"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

type KPI = {
  totalProjects: number;
  totalBudget: number;
  spent: number;
  remaining: number;
};

type Datum = { name: string; value: number };

export default function ReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [projectId, setProjectId] = useState('');
  const [granularity, setGranularity] = useState<'day' | 'month'>('month');
  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const [kpis, setKpis] = useState<KPI>({ totalProjects: 0, totalBudget: 0, spent: 0, remaining: 0 });
  const [byProject, setByProject] = useState<Datum[]>([]);
  const [byCategory, setByCategory] = useState<Datum[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState<Datum[]>([]);
  const [completedByUser, setCompletedByUser] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingByProject, setLoadingByProject] = useState(false);
  const [loadingByCategory, setLoadingByCategory] = useState(false);
  const [loadingTasksByStatus, setLoadingTasksByStatus] = useState(false);
  const [loadingCompletedByUser, setLoadingCompletedByUser] = useState(false);
  const [loadingTeamProd, setLoadingTeamProd] = useState(false);

  // Budget vs Expense & Project Health
  const [loadingBudgetVsExpense, setLoadingBudgetVsExpense] = useState(false);
  const [budgetVsExpense, setBudgetVsExpense] = useState<Array<{ name: string; allocated: number; spent: number }>>([]);
  const [loadingProjectHealth, setLoadingProjectHealth] = useState(false);
  const [projectHealth, setProjectHealth] = useState<Array<{ projectId: number; name: string; allocated: number; spent: number; overdueTasks: number; utilization: number; health: 'green'|'yellow'|'red' }>>([]);

  // Team productivity dataset rows (date, team, value) and pivot
  const [teamProdRows, setTeamProdRows] = useState<Array<{ date: string; team: string; value: number }>>([]);
  const teamProd = useMemo(() => {
    const byDate: Record<string, Record<string, number>> = {};
    const teamsSet = new Set<string>();
    for (const r of teamProdRows) {
      teamsSet.add(r.team);
      byDate[r.date] = byDate[r.date] || {};
      byDate[r.date][r.team] = (byDate[r.date][r.team] || 0) + Number(r.value || 0);
    }
    const teams = Array.from(teamsSet.values()).sort();
    const data = Object.entries(byDate)
      .map(([date, m]) => ({ date, ...teams.reduce((acc, t) => ({ ...acc, [t]: m[t] || 0 }), {}) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { data, teams } as { data: Array<any>; teams: string[] };
  }, [teamProdRows]);

  // Time Spent per Team (from timesheets)
  const [loadingTimeSpent, setLoadingTimeSpent] = useState(false);
  const [timeSpentRows, setTimeSpentRows] = useState<Array<{ date: string; team: string; hours: number }>>([]);
  const timeSpent = useMemo(() => {
    const byDate: Record<string, Record<string, number>> = {};
    const teamsSet = new Set<string>();
    for (const r of timeSpentRows) {
      teamsSet.add(r.team);
      byDate[r.date] = byDate[r.date] || {};
      byDate[r.date][r.team] = (byDate[r.date][r.team] || 0) + Number(r.hours || 0);
    }
    const teams = Array.from(teamsSet.values()).sort();
    const data = Object.entries(byDate)
      .map(([date, m]) => ({ date, ...teams.reduce((acc, t) => ({ ...acc, [t]: m[t] || 0 }), {}) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { data, teams } as { data: Array<any>; teams: string[] };
  }, [timeSpentRows]);

  const COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#a855f7"];

  const loadProjects = async () => {
    const res = await fetch('/api/projects', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setProjects((data?.projects || []).map((p: any) => ({ id: p.id, name: p.name })));
    }
  };

  const loadData = async () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (projectId) params.set('projectId', projectId);

    setLoadingByProject(true); setLoadingByCategory(true); setLoadingTasksByStatus(true); setLoadingCompletedByUser(true); setLoadingTeamProd(true); setLoadingBudgetVsExpense(true); setLoadingProjectHealth(true); setLoadingTimeSpent(true);
    const [s, p, c, tbs, cbu, tp, bve, ph, tsp] = await Promise.all([
      fetch(`/api/reports/summary${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' }),
      fetch(`/api/reports/spend-by-project${(from||to) ? `?${new URLSearchParams({ ...(from?{from}:{}) , ...(to?{to}:{}) }).toString()}` : ''}`, { cache: 'no-store' }),
      fetch(`/api/reports/spend-by-category${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' }),
      fetch(`/api/reports/tasks-by-status${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' }),
      fetch(`/api/reports/completed-by-user${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' }),
      (() => { const p2 = new URLSearchParams(params); p2.set('granularity', granularity); return fetch(`/api/reports/team-productivity?${p2.toString()}`, { cache: 'no-store' }); })(),
      fetch(`/api/reports/budget-vs-expense${(from||to) ? `?${new URLSearchParams({ ...(from?{from}:{}) , ...(to?{to}:{}) }).toString()}` : ''}`, { cache: 'no-store' }),
      fetch(`/api/reports/project-health${(from||to) ? `?${new URLSearchParams({ ...(from?{from}:{}) , ...(to?{to}:{}) }).toString()}` : ''}`, { cache: 'no-store' }),
      (() => { const p2 = new URLSearchParams(params); p2.set('granularity', granularity); return fetch(`/api/reports/time-spent-per-team?${p2.toString()}`, { cache: 'no-store' }); })(),
    ]);
    if (s.ok) {
      const js = await s.json();
      setKpis(js.kpis);
    }
    if (p.ok) setByProject(await p.json());
    if (c.ok) setByCategory(await c.json());
    if (tbs.ok) setTasksByStatus(await tbs.json());
    if (cbu.ok) setCompletedByUser(await cbu.json());
    if (tp.ok) setTeamProdRows(await tp.json());
    if (bve.ok) setBudgetVsExpense(await bve.json());
    if (ph.ok) setProjectHealth(await ph.json());
    if (tsp.ok) setTimeSpentRows(await tsp.json());

    setLoadingByProject(false); setLoadingByCategory(false); setLoadingTasksByStatus(false); setLoadingCompletedByUser(false); setLoadingTeamProd(false); setLoadingBudgetVsExpense(false); setLoadingProjectHealth(false); setLoadingTimeSpent(false);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadProjects(), loadData()]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => { loadData(); }, [from, to, projectId, granularity]);

  const exportCsv = (filename: string, rows: Array<{ [k: string]: any }>) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const body = rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g,'""')}` + `"`).join(',')).join('\r\n');
    const csv = headers.join(',') + '\r\n' + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="p-8">Loading...</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <div className="relative">
            <button onClick={()=>setExportOpen(v=>!v)} className="px-3 py-2 text-sm border rounded flex items-center gap-2">
              <span>Export CSV</span>
              <span className="text-gray-500">▾</span>
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
                <div className="py-1 text-sm">
                  {byProject.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('spend_by_project.csv', byProject); setExportOpen(false);}}>Spend by Project</button>
                  )}
                  {byCategory.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('spend_by_category.csv', byCategory); setExportOpen(false);}}>Spend by Category</button>
                  )}
                  {tasksByStatus.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('tasks_by_status.csv', tasksByStatus); setExportOpen(false);}}>Tasks by Status</button>
                  )}
                  {completedByUser.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('completed_by_assignee.csv', completedByUser); setExportOpen(false);}}>Completed by Assignee</button>
                  )}
                  {budgetVsExpense.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('budget_vs_expense.csv', budgetVsExpense); setExportOpen(false);}}>Budget vs Expense</button>
                  )}
                  {projectHealth.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('project_health.csv', projectHealth); setExportOpen(false);}}>Project Health</button>
                  )}
                  {timeSpentRows.length > 0 && (
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>{exportCsv('time_spent_per_team.csv', timeSpentRows); setExportOpen(false);}}>Time Spent per Team</button>
                  )}
                  {byProject.length===0 && byCategory.length===0 && tasksByStatus.length===0 && completedByUser.length===0 && budgetVsExpense.length===0 && projectHealth.length===0 && timeSpentRows.length===0 && (
                    <div className="px-3 py-2 text-gray-500">No datasets to export</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Team Productivity */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Team Productivity (Tasks over time)</h2>
          </div>
          {loadingTeamProd ? (
            <div className="text-gray-500">Loading...</div>
          ) : teamProd.data.length === 0 ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={teamProd.data} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v: number)=>`${Number(v).toLocaleString()}`} />
                  <Tooltip formatter={(v: number) => `${Number(v).toLocaleString()}`} />
                  {teamProd.teams.map((t: string, i: number) => (
                    <Bar key={t} dataKey={t} stackId="a" fill={["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#a855f7"][i % 6]} />
                  ))}
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Project</label>
              <select value={projectId} onChange={e=>setProjectId(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Granularity</label>
              <select value={granularity} onChange={(e)=>setGranularity(e.target.value as 'day' | 'month')} className="border rounded px-3 py-2 w-full">
                <option value="day">Day</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Projects</div>
            <div className="text-2xl font-semibold">{kpis.totalProjects.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Budget</div>
            <div className="text-2xl font-semibold">{kpis.totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Spent</div>
            <div className="text-2xl font-semibold text-rose-600">{kpis.spent.toLocaleString()}</div>
          </div>
          <div className={`bg-white rounded-lg shadow p-4`}>
            <div className="text-sm text-gray-500">Remaining</div>
            <div className={`text-2xl font-semibold ${kpis.remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{kpis.remaining.toLocaleString()}</div>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Task Completion Rate</div>
            <div className="text-2xl font-semibold">
              {kpis && (kpis as any).totalTasks > 0 ? `${(((kpis as any).completedTasks / (kpis as any).totalTasks) * 100).toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>

        {/* Spend by Project */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Spend by Project</h2>
          </div>
          {loadingByProject ? (
            <div className="text-gray-500">Loading...</div>
          ) : byProject.length === 0 ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={byProject} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} height={60} textAnchor="end" />
                  <YAxis tickFormatter={(v: number)=>`${Number(v).toLocaleString()}`} />
                  <Tooltip formatter={(v: number) => `${Number(v).toLocaleString()}`} />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Spend by Category */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Spend by Category</h2>
          </div>
          {loadingByCategory ? (
            <div className="text-gray-500">Loading...</div>
          ) : byCategory.length === 0 ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    {byCategory.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${Number(v).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}