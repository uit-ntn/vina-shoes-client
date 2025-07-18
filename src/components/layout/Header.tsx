'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { useRouter, usePathname } from 'next/navigation';

// Define suggestion type outside the component
type Suggestion = { type: 'product' | 'brand' | 'category' | 'style', text: string };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState<Suggestion[]>([]);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { searchProducts } = useProducts();
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
  
  // We already have Suggestion type defined at the top of the file
  
  // Update search suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      // Get search results for suggestions
      const results = searchProducts(searchQuery);
      
      // Create suggestions objects with type and text to categorize suggestions
      const suggestionsMap = new Map<string, Suggestion>();
      
      // Prioritize product names but limit them
      const productNames = results
        .slice(0, 3)
        .map(p => p.name)
        .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Add product names as top suggestions
      productNames.forEach(name => {
        suggestionsMap.set(name, { type: 'product', text: name });
      });
      
      // Get unique brands
      const brands = new Set<string>();
      results.forEach(p => {
        if (p.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
          brands.add(p.brand);
        }
      });
      
      // Add brands (up to 2)
      Array.from(brands).slice(0, 2).forEach(brand => {
        suggestionsMap.set(brand, { type: 'brand', text: brand });
      });
      
      // Get categories and style tags
      const categories = new Set<string>();
      const styleTags = new Set<string>();
      
      results.forEach(product => {
        // Categories
        if (product.categories) {
          product.categories.forEach(cat => {
            if (cat.toLowerCase().includes(searchQuery.toLowerCase())) {
              categories.add(cat);
            }
          });
        }
        
        // Style tags
        if (product.styleTags) {
          product.styleTags.forEach(tag => {
            if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
              styleTags.add(tag);
            }
          });
        }
      });
      
      // Add categories and style tags (limited)
      Array.from(categories).slice(0, 2).forEach(cat => {
        suggestionsMap.set(cat, { type: 'category', text: cat });
      });
      
      Array.from(styleTags).slice(0, 2).forEach(tag => {
        suggestionsMap.set(tag, { type: 'style', text: tag });
      });
      
      // Take suggestions (up to 6)
      setQuickSearchResults(Array.from(suggestionsMap.values()).slice(0, 6));
    } else {
      setQuickSearchResults([]);
    }
  }, [searchQuery, searchProducts]);

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
          <span className="mr-2">🚚</span> Miễn phí vận chuyển cho đơn hàng trên 2.000.000₫ | <Link href="/shop/sale" className="underline ml-1 hover:text-yellow-300 transition">Mua ngay</Link>
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
                      <div className="relative flex-grow">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Tìm kiếm sản phẩm..."
                          className="w-full px-3 py-2 border border-blue-900 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-600 placeholder:font-medium text-black"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setSearchOpen(false);
                            }
                          }}
                        />
                        {searchQuery && (
                          <button 
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                      >
                        <AiOutlineSearch size={20} />
                      </button>
                    </form>
                    {/* Live search results */}
                    {searchQuery.length >= 2 && quickSearchResults.length > 0 && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Gợi ý tìm kiếm:</p>
                        <div className="max-h-48 overflow-y-auto">
                          {quickSearchResults.map((suggestion, index) => (
                            <button
                              key={`${suggestion.text}-${index}`}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-md flex items-center text-black"
                              onClick={() => {
                                setSearchQuery(suggestion.text);
                                router.push(`/search?q=${encodeURIComponent(suggestion.text)}`);
                                setSearchOpen(false);
                              }}
                            >
                              {suggestion.type === 'product' && (
                                <svg className="mr-2 text-blue-500 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
                                </svg>
                              )}
                              {suggestion.type === 'brand' && (
                                <svg className="mr-2 text-green-500 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1z" />
                                  <path fillRule="evenodd" d="M5.618 5.04c-.386.198-.824-.149-.746-.592l.83-4.73L3.513 1.85a.75.75 0 01-.593-.88c.108-.479.523-.827 1.01-.827h8.14c.487 0 .902.348 1.01.827a.75.75 0 01-.593.88l-2.19-1.131.83 4.73c.078.443-.36.79-.746.592L8 4.204 5.618 5.04z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                </svg>
                              )}
                              {suggestion.type === 'category' && (
                                <svg className="mr-2 text-purple-500 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                              )}
                              {suggestion.type === 'style' && (
                                <svg className="mr-2 text-orange-500 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span>{suggestion.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2 px-1">
                      Gõ tên sản phẩm, thương hiệu hoặc danh mục để tìm kiếm
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs font-semibold mr-2 text-gray-700">Tìm nhanh:</span>
                        
                        {/* Show dynamic suggestions based on current search or default suggestions */}
                        {searchQuery.length < 2 && [
                          { text: "Nike", type: "brand" }, 
                          { text: "Adidas", type: "brand" }, 
                          { text: "Giày thể thao", type: "category" }, 
                          { text: "Dép", type: "category" }, 
                          { text: "Sale", type: "style" }
                        ].map((item) => (
                          <button
                            key={item.text}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-black hover:text-blue-700 rounded-full transition-colors"
                            onClick={() => {
                              setSearchQuery(item.text);
                              router.push(`/search?q=${encodeURIComponent(item.text)}`);
                              setSearchOpen(false);
                            }}
                          >
                            {item.text}
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
