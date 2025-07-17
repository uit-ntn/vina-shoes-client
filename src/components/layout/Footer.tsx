'use client';

import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/Image';
import { AiOutlineInstagram, AiOutlineFacebook, AiOutlineTwitter, AiOutlineYoutube } from 'react-icons/ai';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold flex items-center">
                <span className="text-white mr-0.5">Vina</span>
                <span className="text-red-500 relative">
                  Shoes
                  <span className="absolute -top-1.5 -right-4 text-xs bg-red-500 text-white px-1 py-0.5 rounded-md transform rotate-12">VN</span>
                </span>
              </div>
            </div>
            <p className="text-blue-200 mb-4">
              Premium footwear for every style and occasion. Quality you can feel with every step.
            </p>
            <div className="flex space-x-3">
              <Link href="https://instagram.com" className="p-2 bg-gray-800 rounded-full text-white hover:bg-blue-600 transition duration-300">
                <AiOutlineInstagram size={20} />
              </Link>
              <Link href="https://facebook.com" className="p-2 bg-gray-800 rounded-full text-white hover:bg-blue-600 transition duration-300">
                <AiOutlineFacebook size={20} />
              </Link>
              <Link href="https://twitter.com" className="p-2 bg-gray-800 rounded-full text-white hover:bg-blue-600 transition duration-300">
                <AiOutlineTwitter size={20} />
              </Link>
              <Link href="https://youtube.com" className="p-2 bg-gray-800 rounded-full text-white hover:bg-blue-600 transition duration-300">
                <AiOutlineYoutube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Shop
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop/men" className="text-blue-200 hover:text-white transition duration-300">Men&apos;s Collection</Link>
              </li>
              <li>
                <Link href="/shop/women" className="text-blue-200 hover:text-white transition duration-300">Women&apos;s Collection</Link>
              </li>
              <li>
                <Link href="/shop/new-arrivals" className="text-blue-200 hover:text-white transition duration-300">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop/sale" className="text-blue-200 hover:text-white transition duration-300">Sale</Link>
              </li>
              <li>
                <Link href="/shop/brands" className="text-blue-200 hover:text-white transition duration-300">Brands</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-blue-200 hover:text-white transition duration-300">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-200 hover:text-white transition duration-300">Contact</Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-200 hover:text-white transition duration-300">Blog</Link>
              </li>
              <li>
                <Link href="/careers" className="text-blue-200 hover:text-white transition duration-300">Careers</Link>
              </li>
              <li>
                <Link href="/store-locator" className="text-blue-200 hover:text-white transition duration-300">Store Locator</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Help
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-blue-200 hover:text-white transition duration-300">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-blue-200 hover:text-white transition duration-300">Shipping</Link>
              </li>
              <li>
                <Link href="/returns" className="text-blue-200 hover:text-white transition duration-300">Returns</Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-blue-200 hover:text-white transition duration-300">Size Guide</Link>
              </li>
              <li>
                <Link href="/track-order" className="text-blue-200 hover:text-white transition duration-300">Track Order</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0">
              &copy; 2025 VinaShoes. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-blue-200 hover:text-white text-sm transition duration-300">Privacy Policy</Link>
              <Link href="/terms" className="text-blue-200 hover:text-white text-sm transition duration-300">Terms of Service</Link>
              <Link href="/returns" className="text-blue-200 hover:text-white text-sm transition duration-300">Returns Policy</Link>
              <Link href="/accessibility" className="text-blue-200 hover:text-white text-sm transition duration-300">Accessibility</Link>
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
              This website is professionally designed and developed by Nhom 7 students of the UIT. Our mission is to deliver a seamless and premium footwear shopping experience, combining modern technology, user-centric design, and a commitment to quality.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
