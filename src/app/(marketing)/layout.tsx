import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineInstagram, AiOutlineFacebook, AiOutlineTwitter, AiOutlineYoutube } from 'react-icons/ai';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Announcement Bar */}
      <div className="bg-black text-white text-center text-sm py-2">
        Free shipping on all orders over $100 | Shop Now
      </div>
      
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Fixed positioning issue */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-[#1a3766]">Vina</span>
                  <span className="text-[#d9292a]">Shoes</span>
                </div>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/shop" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                Shop
              </Link>
              <Link href="/shop/men" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                Men
              </Link>
              <Link href="/shop/women" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                Women
              </Link>
              <Link href="/shop/sale" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                Sale
              </Link>
              <Link href="/blog" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                Blog
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">
                About
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-blue-600 transition duration-300">
                <AiOutlineSearch size={24} />
              </button>
              <Link href="/favorites" className="text-gray-700 hover:text-blue-600 transition duration-300">
                <AiOutlineHeart size={24} />
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition duration-300 relative">
                <AiOutlineShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-blue-600 transition duration-300">
                <AiOutlineUser size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Vina Shoes</h3>
              <p className="text-gray-400 mb-4">
                Premium footwear for every style and occasion. Quality you can feel with every step.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <AiOutlineFacebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <AiOutlineInstagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <AiOutlineTwitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <AiOutlineYoutube size={24} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop/men" className="text-gray-400 hover:text-white transition duration-300">
                    Men's Shoes
                  </Link>
                </li>
                <li>
                  <Link href="/shop/women" className="text-gray-400 hover:text-white transition duration-300">
                    Women's Shoes
                  </Link>
                </li>
                <li>
                  <Link href="/shop/running" className="text-gray-400 hover:text-white transition duration-300">
                    Running
                  </Link>
                </li>
                <li>
                  <Link href="/shop/casual" className="text-gray-400 hover:text-white transition duration-300">
                    Casual
                  </Link>
                </li>
                <li>
                  <Link href="/shop/sale" className="text-gray-400 hover:text-white transition duration-300">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition duration-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/stores" className="text-gray-400 hover:text-white transition duration-300">
                    Store Locator
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Help</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/policy/shipping" className="text-gray-400 hover:text-white transition duration-300">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/policy/returns" className="text-gray-400 hover:text-white transition duration-300">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition duration-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/policy/privacy" className="text-gray-400 hover:text-white transition duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policy/terms" className="text-gray-400 hover:text-white transition duration-300">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Vina Shoes. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              {/* Updated to use fixed width/height with local SVGs */}
              <Image 
                src="/payment-visa.svg" 
                alt="Visa" 
                width={40} 
                height={25} 
              />
              <Image 
                src="/payment-mastercard.svg" 
                alt="Mastercard" 
                width={40} 
                height={25} 
              />
              <Image 
                src="/payment-paypal.svg" 
                alt="PayPal" 
                width={40} 
                height={25} 
              />
              <Image 
                src="/payment-amex.svg" 
                alt="American Express" 
                width={40} 
                height={25} 
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}