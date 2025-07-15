'use client';

import { ProductProvider } from '@/context/ProductContext';
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineInstagram, AiOutlineFacebook, AiOutlineTwitter, AiOutlineYoutube } from 'react-icons/ai';
import Image from '@/components/ui/Image';
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProductProvider>
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
                <Link href="/cart" className="p-2 rounded-full text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition duration-300 relative">
                  <AiOutlineShoppingCart size={22} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center transform scale-100 hover:scale-110 transition">
                    2
                  </span>
                </Link>
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
                  <Link href="/shop" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                    Shop
                  </Link>
                  <Link href="/shop/men" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                    Men
                  </Link>
                  <Link href="/shop/women" className="px-4 py-3 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700 font-medium">
                    Women
                  </Link>
                  <Link href="/shop/sale" className="px-4 py-3 rounded-md bg-red-50 text-red-700 font-medium">
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

                  {/* Policy Links */}
                  <div className="pt-2 pb-1 border-t border-gray-200 mt-2">
                    <p className="px-4 py-2 text-sm font-semibold text-gray-500">Policies</p>
                    <Link href="/policy" className="px-4 py-2 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700">
                      All Policies
                    </Link>
                    <Link href="/policy/privacy" className="px-4 py-2 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                    <Link href="/policy/terms" className="px-4 py-2 rounded-md hover:bg-blue-50 text-blue-900 hover:text-blue-700">
                      Terms of Service
                    </Link>
                  </div>

                  <div className="pt-2 pb-1 border-t border-gray-200 mt-2">
                    <Link href="/login" className="px-4 py-3 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center">
                      <AiOutlineUser size={18} className="mr-2" />
                      Login / Register
                    </Link>
                  </div>
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
                  <div className="text-2xl font-bold">
                    <span className="text-blue-400">Vina</span>
                    <span className="text-red-400">Shoes</span>
                  </div>
                </div>
                <p className="text-blue-200 mb-4">
                  Premium footwear for every style and occasion. Quality you can feel with every step.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="bg-blue-900 hover:bg-blue-600 text-white hover:text-white p-2.5 rounded-full transition duration-300">
                    <AiOutlineFacebook size={20} />
                  </a>
                  <a href="#" className="bg-blue-900 hover:bg-pink-600 text-white hover:text-white p-2.5 rounded-full transition duration-300">
                    <AiOutlineInstagram size={20} />
                  </a>
                  <a href="#" className="bg-blue-900 hover:bg-blue-400 text-white hover:text-white p-2.5 rounded-full transition duration-300">
                    <AiOutlineTwitter size={20} />
                  </a>
                  <a href="#" className="bg-blue-900 hover:bg-red-600 text-white hover:text-white p-2.5 rounded-full transition duration-300">
                    <AiOutlineYoutube size={20} />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 relative inline-block">
                  Shop
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"></span>
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/shop/men" className="text-blue-200 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Men's Shoes
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/women" className="text-blue-200 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Women's Shoes
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/running" className="text-blue-200 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Running
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/casual" className="text-blue-200 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Casual
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/sale" className="text-red-400 hover:text-red-300 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Sale
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 relative inline-block">
                  Company
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"></span>
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/stores" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Store Locator
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 relative inline-block">
                  Help
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"></span>
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/policy/shipping" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Shipping & Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy/returns" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy/privacy" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy/terms" className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></span>
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-blue-200 text-sm mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} <span className="text-white">Vina Shoes</span>. All rights reserved.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 mb-4 md:mb-0">
                  <Link href="/policy/terms" className="text-blue-200 hover:text-white text-sm transition">Terms</Link>
                  <Link href="/policy/privacy" className="text-blue-200 hover:text-white text-sm transition">Privacy</Link>
                  <Link href="/policy/cookies" className="text-blue-200 hover:text-white text-sm transition">Cookies</Link>
                  <Link href="/sitemap" className="text-blue-200 hover:text-white text-sm transition">Sitemap</Link>
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

              <div className="mt-6 text-center text-sm font-semibold text-white py-4 px-6 rounded-lg shadow-lg">
                <p>
                  This website is professionally designed and developed by <span className="text-yellow-300">Nguyen Thanh Nhan</span> and <span className="text-yellow-300">Dang Thanh Ngan</span>, students of the <span className="text-blue-200">University of Information Technology (UIT)</span>. Our mission is to deliver a seamless and premium footwear shopping experience, combining modern technology, user-centric design, and a commitment to quality.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      );
      {children}
    </ProductProvider>
  );
}
