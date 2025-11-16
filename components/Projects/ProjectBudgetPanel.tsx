"use client";

import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Me = {
  permissions?: {
    canViewBudget?: boolean;
    canManageBudget?: boolean;
  }
};

type AllocationResp = {
  projectId: number;
  allocation: { id: number; project_id: number; allocated_amount: number; notes: string | null } | null;
  totals: { allocated: number; spent: number; remaining: number };
};

type Expense = {
  id: number;
  projectId: number | null;
  category: string;
  amount: number;
  description: string | null;
  incurredOn: string;
  createdByName: string | null;
};

export default function ProjectBudgetPanel({ projectId }: { projectId: number }) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AllocationResp | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [allocEditing, setAllocEditing] = useState(false);
  const [allocAmount, setAllocAmount] = useState<string>('');
  const [allocNotes, setAllocNotes] = useState<string>('');

  const [exCategory, setExCategory] = useState('Hosting');
  const [exAmount, setExAmount] = useState('');
  const [exDate, setExDate] = useState('');
  const [exDesc, setExDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const canView = !!me?.permissions?.canViewBudget;
  const canManage = !!me?.permissions?.canManageBudget;

  const trendData = useMemo(() => {
    // Aggregate expenses by date for the line chart
    const map = new Map<string, number>();
    for (const e of expenses) {
      const d = new Date(e.incurredOn).toISOString().slice(0,10);
      map.set(d, (map.get(d) || 0) + Number(e.amount));
    }
    return Array.from(map.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a,b) => a.date.localeCompare(b.date));
  }, [expenses]);

  const load = async () => {
    const [meRes, allocRes, expRes] = await Promise.all([
      fetch('/api/me', { cache: 'no-store' }),
      fetch(`/api/projects/${projectId}/budget`, { cache: 'no-store' }),
      fetch(`/api/expenses?projectId=${projectId}`, { cache: 'no-store' })
    ]);
    if (meRes.ok) setMe(await meRes.json());
    if (allocRes.ok) {
      const d = await allocRes.json();
      setData(d);
      setAllocAmount(String(d?.allocation?.allocated_amount ?? 0));
      setAllocNotes(d?.allocation?.notes ?? '');
    }
    if (expRes.ok) setExpenses(await expRes.json());
    setLoading(false);
  };

  const handleExportCsv = () => {
    if (!expenses || expenses.length === 0) return;
    const headers = ['Date','Category','Amount','Description','By'];
    const rows = expenses.map(e => [
      new Date(e.incurredOn).toISOString().slice(0,10),
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
    a.download = `project_${projectId}_expenses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => { load(); }, [projectId]);

  const handleSaveAllocation = async () => {
    if (!canManage) return;
    setSaving(true);
    try {
      const payload = {
        allocated_amount: Number(allocAmount || 0),
        notes: allocNotes || null,
      };
      const res = await fetch(`/api/projects/${projectId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setAllocEditing(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpense = async () => {
    if (!canManage) return;
    if (!exAmount || !exDate) return;
    setSaving(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          category: exCategory,
          amount: Number(exAmount),
          description: exDesc || null,
          incurredOn: exDate,
        })
      });
      if (res.ok) {
        setExAmount(''); setExDate(''); setExDesc(''); setExCategory('Hosting');
        await load();
      }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="mt-6 bg-white rounded-lg shadow p-4">Loading budget...</div>;
  if (!canView) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Project Budget</h2>
        {canManage && !allocEditing && (
          <button onClick={() => setAllocEditing(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit Allocation</button>
        )}
      </div>

      {/* Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Allocated</div>
          <div className="text-2xl font-semibold">{(data?.totals.allocated ?? 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Spent</div>
          <div className="text-2xl font-semibold text-rose-600">{(data?.totals.spent ?? 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Remaining</div>
          <div className={`text-2xl font-semibold ${((data?.totals.remaining ?? 0) < 0) ? 'text-rose-600' : 'text-emerald-600'}`}>{(data?.totals.remaining ?? 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Edit allocation */}
      {canManage && allocEditing && (
        <div className="mb-4 p-3 border rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="number" step="0.01" value={allocAmount} onChange={e=>setAllocAmount(e.target.value)} className="border rounded px-3 py-2" placeholder="Allocated Amount" />
            <input type="text" value={allocNotes} onChange={e=>setAllocNotes(e.target.value)} className="border rounded px-3 py-2" placeholder="Notes (optional)" />
            <div className="flex gap-2">
              <button disabled={saving} onClick={handleSaveAllocation} className="px-3 py-2 bg-indigo-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={()=>setAllocEditing(false)} className="px-3 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add expense */}
      {canManage && (
        <div className="mb-4 p-3 border rounded">
          <div className="text-sm font-medium mb-2">Add Expense</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input list="expense-categories" type="text" value={exCategory} onChange={e=>setExCategory(e.target.value)} className="border rounded px-3 py-2" placeholder="Category" />
            <input type="number" step="0.01" value={exAmount} onChange={e=>setExAmount(e.target.value)} className="border rounded px-3 py-2" placeholder="Amount" />
            <input type="date" value={exDate} onChange={e=>setExDate(e.target.value)} className="border rounded px-3 py-2" />
            <input type="text" value={exDesc} onChange={e=>setExDesc(e.target.value)} className="border rounded px-3 py-2" placeholder="Description (optional)" />
            <button disabled={saving} onClick={handleAddExpense} className={`px-3 py-2 rounded bg-indigo-600 text-white ${saving ? 'opacity-70' : ''}`}>{saving ? 'Saving...' : 'Add'}</button>
          </div>
          <datalist id="expense-categories">
            <option value="Hosting" />
            <option value="Marketing" />
            <option value="Salaries" />
            <option value="Tools" />
            <option value="Travel" />
            <option value="Misc" />
          </datalist>
        </div>
      )}

      {/* Expenses list */}
      <div>
        {/* Expense Trend */}
        {trendData.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Expense Trend</div>
            <div className="w-full h-64 bg-white/50">
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v)=>`${Number(v).toLocaleString()}`} />
                  <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()}`} labelFormatter={(l)=>`Date: ${l}`} />
                  <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Recent Expenses</div>
          {expenses.length > 0 && (
            <button onClick={handleExportCsv} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border">Export CSV</button>
          )}
        </div>
        {expenses.length === 0 ? (
          <div className="text-gray-500">No expenses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">By</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td className="py-2 pr-4 whitespace-nowrap">{new Date(e.incurredOn).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">{e.category}</td>
                    <td className="py-2 pr-4">{Number(e.amount).toLocaleString()}</td>
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
  );
}
