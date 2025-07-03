'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar';

interface Proposal {
  id: number;
  tender_id: number;
  company_id: number;
  proposal_text: string;
  submitted_at: string;
}

interface Tender {
  id: number;
  title: string;
}

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProposal(res.data);

        const tenderRes = await axios.get(`/tenders/${res.data.tender_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTender(tenderRes.data);
      } catch (err) {
        alert('Failed to load proposal');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProposal();
  }, [id]);

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-3xl mx-auto p-6">
        {loading ? (
          <p>Loading...</p>
        ) : !proposal ? (
          <p className="text-red-500">Proposal not found.</p>
        ) : (
          <div className="bg-white p-6 shadow rounded">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              📄 Proposal #{proposal.id}
            </h1>
            {tender && <p className="text-gray-600 mb-2">📑 Tender: {tender.title}</p>}
            <p className="text-gray-700 whitespace-pre-line">{proposal.proposal_text}</p>
            <p className="text-sm text-gray-400 mt-4">
              🕒 Submitted at: {new Date(proposal.submitted_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
