// ✅ File: src/app/companies/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  logo_url?: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/companies/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: search },
      });
      setCompanies(res.data);
    } catch {
      alert('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchCompanies();
  }, [search]);

  const handleViewDetails = (companyId: number) => {
    router.push(`/companies/${companyId}`);
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">🏢 All Companies</h1>

        <input
          type="text"
          placeholder="Search companies by name or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-2 border border-gray-300 rounded shadow-sm"
        />

        {loading ? (
          <p>Loading...</p>
        ) : companies.length === 0 ? (
          <p className="text-gray-600">No companies found.</p>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div key={company.id} className="bg-white p-4 rounded shadow flex gap-4 items-start justify-between">
                <div className="flex gap-4">
                  {company.logo_url && (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-16 h-16 object-contain rounded border"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-blue-700">{company.name}</h2>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                    <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(company.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
