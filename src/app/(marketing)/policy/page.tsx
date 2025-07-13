import React from 'react';
import Link from 'next/link';
import { FiShield, FiFileText, FiTruck, FiRefreshCw } from 'react-icons/fi';

export default function PolicyIndexPage() {
  const policyPages = [
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      href: '/policy/privacy',
      icon: <FiShield className="h-10 w-10 text-blue-600" />,
    },
    {
      title: 'Terms of Service',
      description: 'Understand the terms and conditions that govern your use of our services.',
      href: '/policy/terms',
      icon: <FiFileText className="h-10 w-10 text-blue-600" />,
    },
    {
      title: 'Shipping Policy',
      description: 'Information about shipping methods, timeframes, and costs.',
      href: '/policy/shipping',
      icon: <FiTruck className="h-10 w-10 text-blue-600" />,
    },
    {
      title: 'Returns & Exchanges',
      description: 'Our policy on returns, exchanges, and refunds.',
      href: '/policy/returns',
      icon: <FiRefreshCw className="h-10 w-10 text-blue-600" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Vina Shoes Policies</h1>
        <p className="text-gray-800 max-w-2xl mx-auto">
          At Vina Shoes, we believe in transparency and fairness. Below you'll find all the policies
          that govern your experience with our store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {policyPages.map((policy) => (
          <Link 
            href={policy.href} 
            key={policy.href}
            className="block bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="mb-4">{policy.icon}</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {policy.title}
              </h2>
              <p className="text-gray-800">{policy.description}</p>
              <div className="mt-4 text-blue-600 font-medium group-hover:underline">Read More →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Have Questions About Our Policies?</h2>
        <p className="mb-4">
          If you have any questions or need clarification about our policies, we're here to help.
          Our customer service team is available to assist you.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-5 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            View FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
