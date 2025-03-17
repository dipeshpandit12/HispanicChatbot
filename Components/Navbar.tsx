'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logout from './Logout';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Auth check failed');
        }

        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [pathname]);

  return (
    <nav className="bg-[#501214] text-white p-4 shadow-lg fixed top-0 w-full z-50 font-[Halis Grotesque]">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Hispanic Chatbot</h1>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:underline">Home</Link>
          <Link href="/pages/about" className="text-white hover:underline">About</Link>
          {isAuthenticated ? (
            <Logout />
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#AC9155] text-white px-4 py-2 rounded-lg hover:bg-[#EBBA45] transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;