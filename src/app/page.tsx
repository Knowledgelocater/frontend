// ✅ File: src/app/page.tsx
'use client';

import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* <Navbar /> */}

      <main className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
          Welcome to <span className="text-blue-600">KIBOU System</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-10">
          Empowering companies with a seamless way to manage tenders and proposals.
        </p>

        <div className="flex justify-center space-x-6">
          <Link
            href="/auth/register"
            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded text-lg shadow"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 rounded text-lg shadow"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}