import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const footerLinks = {
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
    ],
    support: [
      { href: '/faq', label: 'FAQ' },
      { href: '/shipping', label: 'Shipping Info' },
      { href: '/returns', label: 'Returns' },
      { href: '/size-guide', label: 'Size Guide' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/refund', label: 'Refund Policy' },
    ],
  };

  const paymentMethods = [
    { src: '/payment-visa.svg', alt: 'Visa' },
    { src: '/payment-mastercard.svg', alt: 'Mastercard' },
    { src: '/payment-amex.svg', alt: 'American Express' },
    { src: '/payment-paypal.svg', alt: 'PayPal' },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold flex items-center">
                <span className="text-[#1a3766]">Vina</span>
                <span className="text-[#d9292a]">Shoes</span>
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              Your trusted destination for quality footwear. Find your perfect pair with us.
            </p>
            <div className="flex items-center gap-4">
              {paymentMethods.map((method) => (
                <div key={method.alt} className="relative w-12 h-8">
                  <Image
                    src={method.src}
                    alt={method.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Vina Shoes. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex items-center space-x-4">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-gray-600 hover:text-blue-600 text-sm transition">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
