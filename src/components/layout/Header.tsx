import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingCart, FiUser, FiHeart, FiSearch } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();

  const mainNavItems = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-white border-b">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <p>Free shipping for orders over 1.000.000₫</p>
            <div className="flex items-center gap-4">
              <Link href="/track-order" className="hover:text-blue-200">Track Order</Link>
              <Link href="/faq" className="hover:text-blue-200">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold flex items-center">
                <span className="text-[#1a3766]">Vina</span>
                <span className="text-[#d9292a]">Shoes</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:text-blue-600 transition">
                <FiSearch size={20} />
              </button>
              <Link href="/wishlist" className="p-2 hover:text-blue-600 transition">
                <FiHeart size={20} />
              </Link>
              <Link href="/cart" className="p-2 hover:text-blue-600 transition">
                <FiShoppingCart size={20} />
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="p-2 hover:text-blue-600 transition">
                    <FiUser size={20} />
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
