'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  // 🔒 Hide navbar on auth pages
  if (pathname.startsWith('/auth')) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Logo */}
          <Link href="/" className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition">
            KIBOU<span className="text-gray-500">Systems</span>
          </Link>

          {/* Page-Specific Navigation */}
          <div className="flex gap-6 items-center">
            {pathname === '/' && !isLoggedIn && (
              <>
                <Link
                  href="/auth/register"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Register
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/tenders"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Tenders
                </Link>
                <Link
                  href="/companies"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Companies
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md shadow-sm transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
