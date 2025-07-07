'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

interface Company {
  id?: number;
  name: string;
  industry: string;
  description: string;
  logo_url?: string;
}

export default function CompanyPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Company>({
    name: '',
    industry: '',
    description: '',
    logo_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCompany = async () => {
    try {
      const res = await axios.get('/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
      setForm(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setCompany(null); // No company exists yet
      } else {
        setError('Failed to fetch company');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      // POST if company doesn't exist, PUT if it does
      const method = company ? axios.put : axios.post;
      const url = company ? '/companies' : '/companies';

      await method(url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`✅ Company ${company ? 'updated' : 'created'} successfully`);
      fetchCompany();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!company?.id) return;
    if (!confirm('Are you sure you want to delete your company?')) return;

    try {
      await axios.delete(`/companies/${company.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('❌ Company deleted');
      setCompany(null);
      setForm({ name: '', industry: '', description: '', logo_url: '' });
    } catch {
      alert('Failed to delete company');
    }
  };

  useEffect(() => {
    if (!token) router.push('/auth/login');
    else fetchCompany();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-xl w-full space-y-4">
        <h1 className="text-2xl font-bold text-blue-700 text-center">
          {company ? 'Edit Company' : 'Add Company'}
        </h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <input
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border text-gray-700 p-2 rounded"
            />
            <input
              name="industry"
              placeholder="Industry"
              value={form.industry}
              onChange={handleChange}
              required
              className="w-full border text-gray-700 p-2 rounded"
            />
            <input
              name="logo_url"
              placeholder="Logo URL (optional)"
              value={form.logo_url || ''}
              onChange={handleChange}
              className="w-full border text-gray-700 p-2 rounded"
            />
            {form.logo_url && (
              <img
                src={form.logo_url}
                alt="Logo"
                className="h-20 object-contain text-gray-700 mx-auto border p-2 rounded bg-white"
              />
            )}
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border text-gray-700 p-2 rounded"
            />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : company ? 'Update' : 'Add'}
              </button>

              {company && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 border border-red-500 px-4 py-2 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
