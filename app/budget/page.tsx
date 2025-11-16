"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

type Budget = {
  id: number;
  total_amount: number;
  currency: string;
  fiscal_year: string | null;
  created_at: string;
} | null;

type BudgetTotals = {
  total: number;
  spent: number;
  remaining: number;
};

type Expense = {
  id: number;
  projectId: number | null;
  projectName: string | null;
  category: string;
  amount: number;
  description: string | null;
  incurredOn: string;
  createdBy: number | null;
  createdByName: string | null;
  createdAt: string;
};

type Me = {
  permissions?: {
    canViewBudget?: boolean;
    canManageBudget?: boolean;
  }
};

export default function BudgetPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<Budget>(null);
  const [totals, setTotals] = useState<BudgetTotals>({ total: 0, spent: 0, remaining: 0 });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>([]);

  // Filters
  const [month, setMonth] = useState<string>(''); // YYYY-MM (fallback if from/to not used)
  const [from, setFrom] = useState<string>('');   // YYYY-MM-DD
  const [to, setTo] = useState<string>('');       // YYYY-MM-DD
  const [category, setCategory] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');

  // Budget edit form
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [formTotal, setFormTotal] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<string>('INR');
  const [formFY, setFormFY] = useState<string>('');

  // Add expense form
  const [adding, setAdding] = useState(false);
  const [exProjectId, setExProjectId] = useState<string>('');
  const [exCategory, setExCategory] = useState<string>('Hosting');
  const [exAmount, setExAmount] = useState<string>('');
  const [exDesc, setExDesc] = useState<string>('');
  const [exDate, setExDate] = useState<string>('');

  const canView = !!me?.permissions?.canViewBudget;
  const canManage = !!me?.permissions?.canManageBudget;

  const loadMe = async () => {
    const res = await fetch('/api/me', { cache: 'no-store' });
    if (res.ok) setMe(await res.json());
  };

  const handleExportCsv = () => {
    if (!expenses || expenses.length === 0) return;
    const headers = ['Date','Project','Category','Amount','Description','Entered By'];
    const rows = expenses.map(e => [
      new Date(e.incurredOn).toISOString().slice(0,10),
      (e.projectName || '-').replace(/"/g,'""'),
      (e.category || '').replace(/"/g,'""'),
      String(Number(e.amount).toFixed(2)),
      (e.description || '').replace(/"/g,'""'),
      (e.createdByName || '-').replace(/"/g,'""'),
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/\n/g,' ')}` + `"`).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const range = (from || to) ? `${from || 'start'}-to-${to || 'today'}` : (month || 'all-months');
    const suffix = [range, category || 'all-categories', projectId || 'all-projects'].join('_');
    a.download = `expenses_${suffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadBudget = async () => {
    const res = await fetch('/api/budget', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setBudget(data.budget || null);
      setTotals(data.totals);
      // seed form
      setFormTotal(String(data?.budget?.total_amount ?? 0));
      setFormCurrency(data?.budget?.currency ?? 'INR');
      setFormFY(data?.budget?.fiscal_year ?? '');
    }
  };

  const loadExpenses = async () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (!from && !to && month) params.set('month', month);
    if (category) params.set('category', category);
    if (projectId) params.set('projectId', projectId);
    const res = await fetch(`/api/expenses${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' });
    if (res.ok) setExpenses(await res.json());
  };

  const loadProjects = async () => {
    const res = await fetch('/api/projects', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = (data?.projects || []).map((p: any) => ({ id: p.id, name: p.name }));
      setProjects(list);
    }
  };

  useEffect(() => {
    (async () => {
      await loadMe();
      await loadBudget();
      await loadExpenses();
      await loadProjects();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // refetch on filters change
    loadExpenses();
  }, [month, from, to, category, projectId]);

  const handleSaveBudget = async () => {
    if (!canManage) return;
    const payload = {
      total_amount: Number(formTotal || 0),
      currency: formCurrency || 'INR',
      fiscal_year: formFY || null,
    };
    const res = await fetch('/api/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setIsBudgetModalOpen(false);
      loadBudget();
    }
  };

  const handleAddExpense = async () => {
    if (!canManage) return;
    if (!exAmount || !exDate || !exCategory) return;
    setAdding(true);
    try {
      const payload = {
        projectId: exProjectId ? Number(exProjectId) : null,
        category: exCategory,
        amount: Number(exAmount),
        description: exDesc || null,
        incurredOn: exDate,
      };
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // reset
        setExAmount('');
        setExDesc('');
        setExDate('');
        setExProjectId('');
        setExCategory('Hosting');
        await Promise.all([loadExpenses(), loadBudget()]);
      }
    } finally {
      setAdding(false);
    }
  };

  const spendByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      map.set(e.category, (map.get(e.category) || 0) + Number(e.amount));
    }
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]);
  }, [expenses]);

  const spendByProject = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      const key = e.projectName || 'Unassigned';
      map.set(key, (map.get(key) || 0) + Number(e.amount));
    }
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]);
  }, [expenses]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="p-8">Loading...</div>
      </DefaultLayout>
    );
  }

  if (!canView) {
    return (
      <DefaultLayout>
        <div className="p-8 text-red-600">You do not have permission to view the Budget.</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Budget</h1>
          {canManage && (
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              Edit Company Budget
            </button>
          )}
        </div>

        {/* Spend by Project (Bar) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Spend by Project</h2>
          {spendByProject.length === 0 ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer>
                <BarChart data={spendByProject.map(([name, value]) => ({ name, value }))} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} height={60} textAnchor="end" />
                  <YAxis tickFormatter={(v: number)=>`${Number(v).toLocaleString()}`} />
                  <Tooltip formatter={(v: number) => `${Number(v).toLocaleString()} ${budget?.currency ?? 'INR'}`} />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Budget</div>
            <div className="text-2xl font-semibold">{totals.total.toLocaleString()} {budget?.currency ?? 'INR'}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Spent</div>
            <div className="text-2xl font-semibold text-rose-600">{totals.spent.toLocaleString()} {budget?.currency ?? 'INR'}</div>
          </div>
          <div className={`bg-white rounded-lg shadow p-4`}>
            <div className="text-sm text-gray-500">Remaining</div>
            <div className={`text-2xl font-semibold ${totals.remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {totals.remaining.toLocaleString()} {budget?.currency ?? 'INR'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Month</label>
              <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="border rounded px-3 py-2" />
              <div className="text-xs text-gray-500 mt-1">Ignored if From/To is set</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <input list="expense-categories" type="text" value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g. Hosting" className="border rounded px-3 py-2" />
              <datalist id="expense-categories">
                <option value="Hosting" />
                <option value="Marketing" />
                <option value="Salaries" />
                <option value="Tools" />
                <option value="Travel" />
                <option value="Misc" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Project</label>
              <select value={projectId} onChange={e=>setProjectId(e.target.value)} className="border rounded px-3 py-2 min-w-[220px]">
                <option value="">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Spend by Category (Pie) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Spend by Category</h2>
          {spendByCategory.length === 0 ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={spendByCategory.map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {spendByCategory.map((entry, index) => (
                      <Cell key={`cell-cat-${index}`} fill={["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#a855f7"][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} ${budget?.currency ?? 'INR'}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Add Expense */}
        {canManage && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Add Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select value={exProjectId} onChange={e=>setExProjectId(e.target.value)} className="border rounded px-3 py-2">
                <option value="">Unassigned (no project)</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
              <input list="expense-categories" type="text" placeholder="Category" value={exCategory} onChange={e=>setExCategory(e.target.value)} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Amount" value={exAmount} onChange={e=>setExAmount(e.target.value)} className="border rounded px-3 py-2" />
              <input type="date" placeholder="Incurred on" value={exDate} onChange={e=>setExDate(e.target.value)} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Description (optional)" value={exDesc} onChange={e=>setExDesc(e.target.value)} className="border rounded px-3 py-2" />
            </div>
            <div className="mt-3">
              <button disabled={adding} onClick={handleAddExpense} className={`px-4 py-2 rounded bg-indigo-600 text-white ${adding ? 'opacity-70' : ''}`}>
                {adding ? 'Saving...' : 'Add Expense'}
              </button>
            </div>
          </div>
        )}

        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            {expenses.length > 0 && (
              <button onClick={handleExportCsv} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border">Export CSV</button>
            )}
          </div>
          {expenses.length === 0 ? (
            <div className="text-gray-500">No expenses found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Project</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2 pr-4">Entered By</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 pr-4 whitespace-nowrap">{new Date(e.incurredOn).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{e.projectName || '-'}</td>
                      <td className="py-2 pr-4">{e.category}</td>
                      <td className="py-2 pr-4">{Number(e.amount).toLocaleString()} {budget?.currency ?? 'INR'}</td>
                      <td className="py-2 pr-4">{e.description || '-'}</td>
                      <td className="py-2 pr-4">{e.createdByName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Company Budget</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-600">✖</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
                <input type="number" step="0.01" value={formTotal} onChange={e=>setFormTotal(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Currency</label>
                <input type="text" value={formCurrency} onChange={e=>setFormCurrency(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fiscal Year</label>
                <input type="text" placeholder="e.g. 2025-26" value={formFY} onChange={e=>setFormFY(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveBudget} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
