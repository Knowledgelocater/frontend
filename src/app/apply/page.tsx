'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar';
import { useCompany } from '@/context/CompanyContext';
import { useRouter } from 'next/navigation';

interface Tender {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
}

export default function ApplyForTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [proposalText, setProposalText] = useState('');
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { companyId, loading } = useCompany();
  const router = useRouter();

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await axios.get('/tenders');
        setTenders(res.data);
      } catch (err) {
        alert('Failed to load tenders');
      }
    };
    fetchTenders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenderId || !proposalText || !companyId) return;

    try {
      await axios.post('/applications', {
        tender_id: selectedTenderId,
        company_id: companyId,
        proposal_text: proposalText,
        submitted_at: new Date().toISOString(),
      });
      setProposalText('');
      setSelectedTenderId(null);
      setSuccessMessage('✅ Proposal submitted successfully!');
    } catch (err) {
      alert('Failed to submit proposal');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!companyId) return <p className="text-center text-red-600 mt-10">❌ Company ID not found</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📝 Apply for Tenders</h1>

        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedTenderId || ''}
            onChange={(e) => setSelectedTenderId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a Tender</option>
            {tenders.map((tender) => (
              <option key={tender.id} value={tender.id}>
                {tender.title} (₹{tender.budget})
              </option>
            ))}
          </select>

          <textarea
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Write your proposal text here..."
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Submit Proposal
          </button>
        </form>
      </div>
    </>
  );
}
