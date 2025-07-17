'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Calculate total items in cart
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Reset mobile menu and user menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close user menu and search when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userMenuOpen && !target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
      if (searchOpen && !target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, searchOpen]);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };
  
  // Focus search input when search is opened
  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  
  // Add keyboard shortcut for search (Ctrl+K or /)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with '/' key when not in an input or textarea
      if (
        e.key === '/' && 
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // Open search with Ctrl+K
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center text-sm py-2 font-medium tracking-wide">
        <span className="inline-flex items-center">
          <span className="mr-2">🚚</span> Free shipping on all orders over $100 | <Link href="/shop/sale" className="underline ml-1 hover:text-yellow-300 transition">Shop Now</Link>
        </span>
      </div>

      {/* Header/Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50 transition-shadow duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-blue-900 hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center mx-auto md:mx-0">
              <div className="flex items-center">
                <div className="text-3xl font-bold flex items-center">
                  <span className="text-[#1a3766] mr-0.5">Vina</span>
                  <span className="text-[#d9292a] relative">
                    Shoes
                    <span className="absolute -top-1.5 -right-4 text-xs bg-red-500 text-white px-1 py-0.5 rounded-md transform rotate-12">VN</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/shop" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                Shop
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/shop/men" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                Men
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/shop/women" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                Women
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/shop/sale" className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md font-medium transition duration-300">
                Sale
              </Link>
              <Link href="/faq" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                FAQ
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/blog" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                Blog
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                About
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
              <Link href="/contact" className="px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition duration-300 relative group">
                Contact
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-700 group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-3">
              <div className="relative search-container">
                <button 
                  className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition duration-300"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <AiOutlineSearch size={22} />
                </button>
                
                {/* Search Overlay */}
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-3 w-80 sm:w-96 z-50 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Tìm kiếm</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded-md mr-1">Esc</span>
                        <span>để đóng</span>
                      </div>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setSearchOpen(false);
                          }
                        }}
                      />
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                      >
                        <AiOutlineSearch size={20} />
                      </button>
                    </form>
                    <div className="text-xs text-gray-500 mt-2 px-1">
                      Gõ tên sản phẩm, thương hiệu hoặc danh mục để tìm kiếm
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs font-medium mr-2">Tìm nhanh:</span>
                      {["Nike", "Adidas", "Giày thể thao", "Dép", "Sale"].map((term) => (
                        <button
                          key={term}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
                          onClick={() => {
                            setSearchQuery(term);
                            router.push(`/search?q=${encodeURIComponent(term)}`);
                            setSearchOpen(false);
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/favorites" className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-red-500 transition duration-300 relative group">
                <AiOutlineHeart size={22} />
                <span className="absolute -top-1 -right-1 bg-blue-100 text-blue-900 text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
              </Link>
              <Link href="/cart" className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition duration-300 relative">
                <AiOutlineShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center transform scale-100 hover:scale-110 transition">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="ml-1 flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                  >
                    <AiOutlineUser size={18} className="mr-1" />
                    <span className="text-sm font-medium truncate max-w-[120px]">{user.name}</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <AiOutlineUser size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <AiOutlineLogout size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="ml-1 flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300">
                  <AiOutlineUser size={18} className="mr-1" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
            <div className="py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-1 px-2">
                <Link href="/shop" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  Shop
                </Link>
                <Link href="/shop/men" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  Men
                </Link>
                <Link href="/shop/women" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  Women
                </Link>
                <Link href="/shop/sale" className="px-4 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 font-medium">
                  Sale
                </Link>
                <Link href="/faq" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  FAQ
                </Link>
                <Link href="/blog" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  Blog
                </Link>
                <Link href="/about" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  About
                </Link>
                <Link href="/contact" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
