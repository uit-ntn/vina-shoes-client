'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const policyLinks = [
    { name: 'Privacy Policy', href: '/policy/privacy' },
    { name: 'Terms of Service', href: '/policy/terms' },
    { name: 'Shipping Policy', href: '/policy/shipping' },
    { name: 'Returns & Exchanges', href: '/policy/returns' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Policy Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Policy Pages</h2>
            <nav className="flex flex-col space-y-2">
              {policyLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-3 py-2 rounded-md ${
                    pathname === link.href 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-800 hover:bg-blue-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
