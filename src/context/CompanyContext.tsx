'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/utils/axios';

interface CompanyContextProps {
  companyId: number | null;
  loading: boolean;
}

const CompanyContext = createContext<CompanyContextProps>({
  companyId: null,
  loading: true,
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const res = await axios.get('/companies', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Grab the first company created by this user
        if (res.data.length > 0) {
          setCompanyId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch company ID');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, []);

  return (
    <CompanyContext.Provider value={{ companyId, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};
