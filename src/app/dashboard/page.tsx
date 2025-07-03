'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

interface Company {
  name: string;
  industry: string;
  description: string;
  logo_url?: string;
}

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch company');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!company) return;
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/companies', company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Company profile updated!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!company) {
    return <div className="p-6 text-center text-red-600">No company data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Company Dashboard
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Company Name</label>
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Industry</label>
            <input
              type="text"
              name="industry"
              value={company.industry}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Logo URL</label>
            <input
              type="text"
              name="logo_url"
              value={company.logo_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
            />
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt="Logo Preview"
                className="mt-3 h-20 object-contain border p-2 rounded bg-white"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={company.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
// This code defines a simple dashboard page for managing company profile information.