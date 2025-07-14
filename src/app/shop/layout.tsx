'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineInstagram, AiOutlineFacebook, AiOutlineTwitter, AiOutlineYoutube } from 'react-icons/ai';
import Image from '@/components/ui/Image';
import { ShopFilterProvider } from '@/context/ShopFilterContext';
import { CartProvider, useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

function ShopLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
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
              <button className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition duration-300">
                <AiOutlineSearch size={22} />
              </button>
              <Link href="/favorites" className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-red-500 transition duration-300 relative group">
                <AiOutlineHeart size={22} />
                <span className="absolute -top-1 -right-1 bg-blue-100 text-blue-900 text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
              </Link>
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition duration-300 relative"
              >
                <AiOutlineShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center transform scale-100 hover:scale-110 transition">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link href="/login" className="ml-1 flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300">
                <AiOutlineUser size={18} className="mr-1" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
            <div className="py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-1 px-2">
                <Link href="/shop" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">Shop</Link>
                <Link href="/shop/men" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">Men</Link>
                <Link href="/shop/women" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">Women</Link>
                <Link href="/shop/sale" className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-md">Sale</Link>
                <Link href="/faq" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">FAQ</Link>
                <Link href="/blog" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">Blog</Link>
                <Link href="/about" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">About</Link>
                <Link href="/contact" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md">Contact</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold flex items-center">
                  <span className="text-white mr-0.5">Vina</span>
                  <span className="text-red-400 relative">
                    Shoes
                    <span className="absolute -top-1 -right-4 text-xs bg-red-500 text-white px-1 py-0.5 rounded-md transform rotate-12">VN</span>
                  </span>
                </div>
              </div>
              <p className="text-blue-200 mb-4">
                Premium footwear for every style and occasion. Quality you can feel with every step.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-blue-200 hover:text-white transition"><AiOutlineFacebook size={24} /></a>
                <a href="#" className="text-blue-200 hover:text-white transition"><AiOutlineTwitter size={24} /></a>
                <a href="#" className="text-blue-200 hover:text-white transition"><AiOutlineInstagram size={24} /></a>
                <a href="#" className="text-blue-200 hover:text-white transition"><AiOutlineYoutube size={24} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 relative inline-block">
                Shop
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-blue-500"></span>
              </h4>
              <ul className="space-y-2.5">
                <li><Link href="/shop" className="text-blue-200 hover:text-white transition">All Products</Link></li>
                <li><Link href="/shop/men" className="text-blue-200 hover:text-white transition">Men</Link></li>
                <li><Link href="/shop/women" className="text-blue-200 hover:text-white transition">Women</Link></li>
                <li><Link href="/shop/sale" className="text-blue-200 hover:text-white transition">Sale</Link></li>
                <li><Link href="/shop/new" className="text-blue-200 hover:text-white transition">New Arrivals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 relative inline-block">
                Company
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-blue-500"></span>
              </h4>
              <ul className="space-y-2.5">
                <li><Link href="/about" className="text-blue-200 hover:text-white transition">About Us</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="text-blue-200 hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="text-blue-200 hover:text-white transition">Careers</Link></li>
                <li><Link href="/stores" className="text-blue-200 hover:text-white transition">Store Locator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 relative inline-block">
                Help
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-blue-500"></span>
              </h4>
              <ul className="space-y-2.5">
                <li><Link href="/policy" className="text-blue-200 hover:text-white transition">Customer Service</Link></li>
                <li><Link href="/policy/returns" className="text-blue-200 hover:text-white transition">Returns & Exchanges</Link></li>
                <li><Link href="/policy/shipping" className="text-blue-200 hover:text-white transition">Shipping Information</Link></li>
                <li><Link href="/faq" className="text-blue-200 hover:text-white transition">FAQ</Link></li>
                <li><Link href="/policy/privacy" className="text-blue-200 hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-200 text-sm mb-4 md:mb-0">
                &copy; 2024 Vina Shoes. All rights reserved.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mb-4 md:mb-0">
                <Link href="/policy/terms" className="text-blue-200 text-sm hover:text-white transition">
                  Terms & Conditions
                </Link>
                <Link href="/policy/privacy" className="text-blue-200 text-sm hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/sitemap" className="text-blue-200 text-sm hover:text-white transition">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-blue-200 text-sm hover:text-white transition">
                  Accessibility
                </Link>
              </div>
              
              <div className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg">
                <Image 
                  src="/payment-visa.svg" 
                  alt="Visa" 
                  width={45} 
                  height={28} 
                  className="hover:opacity-80 transition"
                />
                <Image 
                  src="/payment-mastercard.svg" 
                  alt="Mastercard" 
                  width={45} 
                  height={28}
                  className="hover:opacity-80 transition" 
                />
                <Image 
                  src="/payment-paypal.svg" 
                  alt="PayPal" 
                  width={45} 
                  height={28}
                  className="hover:opacity-80 transition" 
                />
                <Image 
                  src="/payment-amex.svg" 
                  alt="American Express" 
                  width={45} 
                  height={28}
                  className="hover:opacity-80 transition" 
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </div>
  );
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ShopFilterProvider>
        <ShopLayoutContent>{children}</ShopLayoutContent>
      </ShopFilterProvider>
    </CartProvider>
  );
}
