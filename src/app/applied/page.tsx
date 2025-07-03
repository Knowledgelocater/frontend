'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

interface Tender {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  created_at?: string;
}

export default function AppliedTendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchAppliedTenders = async () => {
      try {
        const res = await axios.get('/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenders(res.data);
      } catch {
        alert('Failed to load applied tenders');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedTenders();
  }, []);

  return (
    <>
      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">📋 Applied Tenders</h1>

        {loading ? (
          <p>Loading...</p>
        ) : tenders.length === 0 ? (
          <p className="text-gray-600">You haven’t applied to any tenders yet.</p>
        ) : (
          <div className="grid gap-4">
            {tenders.map((tender) => (
              <div key={tender.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold text-blue-700">{tender.title}</h2>
                <p className="text-sm text-gray-600">{tender.description}</p>
                <p className="text-sm text-gray-800 mt-2">
                  💰 Budget: ₹{tender.budget} | ⏰ Deadline: {new Date(tender.deadline).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied On: {new Date(tender.created_at || '').toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
