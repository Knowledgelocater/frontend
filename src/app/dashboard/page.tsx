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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      alert('✅ Company profile updated!');
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
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        No company data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          🏢 Company Profile
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">{error}</p>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={company.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="text"
              name="logo_url"
              value={company.logo_url || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
            />
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt="Logo Preview"
                className="mt-3 h-20 object-contain border p-2 rounded-md bg-white shadow-sm"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={company.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
