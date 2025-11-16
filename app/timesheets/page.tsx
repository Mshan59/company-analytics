"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useEffect, useMemo, useState } from 'react';

type Timesheet = {
  id: number;
  userId: number;
  userName?: string;
  projectId?: number|null;
  projectName?: string|null;
  teamId?: number|null;
  teamName?: string|null;
  workDate: string; // YYYY-MM-DD
  hours: number;
  notes?: string|null;
  createdAt?: string;
};

export default function TimesheetsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [teamId, setTeamId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Timesheet[]>([]);

  const [teams, setTeams] = useState<Array<{ id:number; name:string }>>([]);
  const [projects, setProjects] = useState<Array<{ id:number; name:string }>>([]);
  const [users, setUsers] = useState<Array<{ id:number; name:string }>>([]);

  const [editItem, setEditItem] = useState<Partial<Timesheet>|null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (from) qs.set('from', from); if (to) qs.set('to', to);
    if (teamId) qs.set('teamId', teamId);
    if (projectId) qs.set('projectId', projectId);
    if (userId) qs.set('userId', userId);
    const res = await fetch(`/api/timesheets${qs.toString() ? `?${qs.toString()}` : ''}`, { cache: 'no-store' });
    if (res.ok) {
      const js = await res.json();
      setItems(js.timesheets || []);
    }
    setLoading(false);
  };

  const loadRefs = async () => {
    try {
      const [t, p, u] = await Promise.all([
        fetch('/api/teams', { cache: 'no-store' }),
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/users', { cache: 'no-store' }).catch(() => null),
      ]);
      if (t?.ok) {
        const j = await t.json();
        const arr = Array.isArray(j) ? j : (j?.teams || []);
        setTeams(arr.map((x:any)=>({ id:x.id, name:x.name })));
      }
      if (p?.ok) {
        const j = await p.json();
        setProjects((j?.projects || []).map((x:any)=>({ id:x.id, name:x.name })));
      }
      if (u?.ok) {
        const j = await u.json();
        const arr = Array.isArray(j) ? j : (j?.users || []);
        setUsers(arr.map((x:any)=>({ id:x.id, name:x.name || x.email })));
      }
    } catch {}
  };

  useEffect(() => { (async ()=>{ await Promise.all([loadRefs(), loadData()]); })(); }, []);
  useEffect(() => { loadData(); }, [from, to, teamId, projectId, userId]);

  const resetForm = () => setEditItem(null);

  const onSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const payload = {
      userId: Number(editItem.userId),
      projectId: editItem.projectId === undefined || editItem.projectId === null || editItem.projectId === -1 ? null : Number(editItem.projectId),
      teamId: editItem.teamId === undefined || editItem.teamId === null || editItem.teamId === -1 ? null : Number(editItem.teamId),
      workDate: editItem.workDate,
      hours: Number(editItem.hours),
      notes: editItem.notes ?? null,
    };
    let ok = false;
    if (editItem.id) {
      const res = await fetch(`/api/timesheets/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      ok = res.ok;
    } else {
      const res = await fetch('/api/timesheets', { method: 'POST', body: JSON.stringify(payload) });
      ok = res.ok;
    }
    setSaving(false);
    if (ok) { resetForm(); loadData(); }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Delete this time entry?')) return;
    const res = await fetch(`/api/timesheets/${id}`, { method: 'DELETE' });
    if (res.ok) loadData();
  };

  const exportCsv = () => {
    if (!items.length) return;
    const headers = ['workDate','teamName','projectName','userName','hours','notes'];
    const body = items.map(r => headers.map(h => `"${String((r as any)[h] ?? '').replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const csv = headers.join(',') + '\r\n' + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'timesheets.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <DefaultLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
          <div className="flex gap-3">
            <button onClick={()=>setEditItem({ workDate: new Date().toISOString().slice(0,10), hours: 1 })} className="px-3 py-2 text-sm border rounded">Add Entry</button>
            {items.length>0 && <button onClick={exportCsv} className="px-3 py-2 text-sm border rounded">Export CSV</button>}
          </div>
        </div>

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
              <label className="block text-sm text-gray-600 mb-1">Team</label>
              <select value={teamId} onChange={e=>setTeamId(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">All</option>
                {teams.map(t=> <option key={t.id} value={String(t.id)}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Project</label>
              <select value={projectId} onChange={e=>setProjectId(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">All</option>
                {projects.map(p=> <option key={p.id} value={String(p.id)}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">User</label>
              <select value={userId} onChange={e=>setUserId(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">All</option>
                {users.map(u=> <option key={u.id} value={String(u.id)}>{u.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-gray-500">No entries</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Team</th>
                    <th className="px-3 py-2">Project</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Hours</th>
                    <th className="px-3 py-2">Notes</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(r => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{r.workDate}</td>
                      <td className="px-3 py-2">{r.teamName ?? '-'}</td>
                      <td className="px-3 py-2">{r.projectName ?? '-'}</td>
                      <td className="px-3 py-2">{r.userName ?? r.userId}</td>
                      <td className="px-3 py-2">{r.hours}</td>
                      <td className="px-3 py-2">{r.notes ?? '-'}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button onClick={()=>setEditItem(r)} className="px-2 py-1 text-xs border rounded">Edit</button>
                        <button onClick={()=>onDelete(r.id)} className="px-2 py-1 text-xs border rounded text-rose-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editItem && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{editItem.id ? 'Edit Entry' : 'Add Entry'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input type="date" value={editItem.workDate || ''} onChange={e=>setEditItem({ ...editItem, workDate: e.target.value })} className="border rounded px-3 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hours</label>
                  <input type="number" step="0.25" value={editItem.hours ?? 0} onChange={e=>setEditItem({ ...editItem, hours: Number(e.target.value) })} className="border rounded px-3 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Team</label>
                  <select value={String(editItem.teamId ?? '')} onChange={e=>setEditItem({ ...editItem, teamId: e.target.value ? Number(e.target.value) : null })} className="border rounded px-3 py-2 w-full">
                    <option value="">None</option>
                    {teams.map(t=> <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Project</label>
                  <select value={String(editItem.projectId ?? '')} onChange={e=>setEditItem({ ...editItem, projectId: e.target.value ? Number(e.target.value) : null })} className="border rounded px-3 py-2 w-full">
                    <option value="">None</option>
                    {projects.map(p=> <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">User</label>
                  <select value={String(editItem.userId ?? '')} onChange={e=>setEditItem({ ...editItem, userId: Number(e.target.value) })} className="border rounded px-3 py-2 w-full">
                    <option value="">Select</option>
                    {users.map(u=> <option key={u.id} value={String(u.id)}>{u.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Notes</label>
                  <input type="text" value={editItem.notes ?? ''} onChange={e=>setEditItem({ ...editItem, notes: e.target.value })} className="border rounded px-3 py-2 w-full" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={resetForm} className="px-3 py-2 text-sm border rounded">Cancel</button>
                <button disabled={saving} onClick={onSave} className="px-3 py-2 text-sm border rounded bg-emerald-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
