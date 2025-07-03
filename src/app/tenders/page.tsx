'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
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

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [form, setForm] = useState<Partial<Tender>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchCompanyId();
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📄 Tenders Management</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or budget..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border border-gray-300 rounded shadow-sm"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-lg shadow">
        <input
          placeholder="Title"
          value={form.title || ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          placeholder="Budget"
          type="number"
          value={form.budget || ''}
          onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) })}
          className="p-2 border rounded"
          required
        />
        <input
          placeholder="Deadline"
          type="date"
          value={form.deadline?.split('T')[0] || ''}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-2 border rounded col-span-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded col-span-full hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Tender' : 'Add Tender'}
        </button>
      </form>

      {/* Tender List */}
      {loading ? (
        <p>Loading tenders...</p>
      ) : (
        <div className="grid gap-4">
          {tenders.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold text-blue-700">{t.title}</h2>
              <p className="text-sm text-gray-600">{t.description}</p>
              <p className="text-sm text-gray-800 mt-2">
                💰 Budget: ₹{t.budget} | ⏰ Deadline: {new Date(t.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(t.created_at || '').toLocaleDateString()}
              </p>
              <div className="absolute top-3 right-4 space-x-4 text-sm">
                <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10 flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
// This code defines a TendersPage component that allows users to manage tenders, including creating, editing, deleting, and searching for tenders. It uses React hooks for state management and Axios for API requests.