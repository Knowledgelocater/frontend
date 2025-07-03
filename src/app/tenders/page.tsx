'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

interface Tender {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  company_id?: number;
  created_at?: string;
}

export default function TenderPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [form, setForm] = useState<Partial<Tender>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState<number | null>(null);
  const [appliedTenderIds, setAppliedTenderIds] = useState<number[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCompanyId = async () => {
    try {
      const res = await axios.get('/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCompanyId(res.data.id);
    } catch {
      alert('Failed to fetch company. Please login again.');
      router.push('/auth/login');
    }
  };

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tenders', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });
      const filtered = res.data.filter((t: Tender) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.budget.toString().includes(search)
      );
      setTenders(filtered);
    } catch {
      alert('Failed to load tenders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedTenders = async () => {
    try {
      const res = await axios.get('/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedIds = res.data.map((t: Tender) => t.id);
      setAppliedTenderIds(appliedIds);
    } catch {
      console.warn('Could not fetch applied tenders');
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchCompanyId();
    fetchAppliedTenders();
  }, []);

  useEffect(() => {
    if (userCompanyId) {
      fetchTenders();
    }
  }, [userCompanyId, page, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCompanyId) return alert('Company not loaded');
    const tenderData = { ...form, company_id: userCompanyId };

    try {
      if (editingId !== null) {
        await axios.put(`/tenders/${editingId}`, tenderData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/tenders', tenderData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({});
      setEditingId(null);
      fetchTenders();
    } catch {
      alert('Error saving tender');
    }
  };

  const handleEdit = (t: Tender) => {
    setForm(t);
    setEditingId(t.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this tender?')) {
      await axios.delete(`/tenders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTenders();
    }
  };

  const handleApply = async (tenderId: number) => {
    try {
      await axios.post(`/applications/${tenderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Applied successfully!');
      setAppliedTenderIds([...appliedTenderIds, tenderId]);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">📄 Tenders Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or budget..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        {/* Tender Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 text-gray-800 gap-4 mb-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <input
            placeholder="Title"
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-2 border border-gray-300 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
          <input
            placeholder="Budget"
            type="number"
            value={form.budget || ''}
            onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) })}
            className="p-2 border border-gray-300 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
          <input
            placeholder="Deadline"
            type="date"
            value={form.deadline?.split('T')[0] || ''}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="p-2 border border-gray-300 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border border-gray-300 text-gray-800 rounded-md col-span-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
            rows={4}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded col-span-full transition"
          >
            {editingId ? 'Update Tender' : 'Add Tender'}
          </button>
        </form>

        {/* Tender Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tenders...</p>
        ) : (
          <div className="grid gap-6">
            {tenders.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-lg shadow border relative">
                <h2 className="text-xl font-bold text-blue-700">{t.title}</h2>
                <p className="text-gray-600 mt-1">{t.description}</p>
                <p className="text-gray-800 mt-2">
                  💰 ₹{t.budget} &nbsp;&nbsp; ⏰ {new Date(t.deadline).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Created: {new Date(t.created_at || '').toLocaleDateString()}
                </p>

                {/* Controls */}
                <div className="absolute top-3 right-4 flex gap-4 text-sm">
                  <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
                </div>

                {/* Apply */}
                {!appliedTenderIds.includes(t.id) ? (
                  <button
                    onClick={() => handleApply(t.id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                  >
                    Apply
                  </button>
                ) : (
                  <p className="mt-4 text-green-600 text-sm font-semibold hover:bg-green-100">✅ Applied</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10 flex justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="bg-gray-200 px-4 py-2 text-black cursor-pointer rounded hover:bg-gray-300"
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-200 px-4 py-2 text-black cursor-pointer rounded hover:bg-gray-300"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
