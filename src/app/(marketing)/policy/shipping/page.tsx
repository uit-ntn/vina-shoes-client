import React from 'react';
import Link from 'next/link';
import { FiTruck, FiGlobe, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>
        <p className="text-gray-600">Last Updated: July 13, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          At Vina Shoes, we aim to provide you with the best shipping experience possible. This policy 
          outlines our shipping practices, delivery timeframes, and important information about receiving 
          your orders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FiTruck className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Domestic Shipping</h3>
            </div>
            <p className="text-sm mb-2">We ship to all locations within Vietnam</p>
            <p className="text-sm mb-2"><strong>Standard Shipping:</strong> 1-3 business days</p>
            <p className="text-sm mb-2"><strong>Express Shipping:</strong> Next day delivery</p>
            <p className="text-sm"><strong>Free shipping:</strong> Orders over 1,000,000₫</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FiGlobe className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">International Shipping</h3>
            </div>
            <p className="text-sm mb-2">We ship to select countries in Southeast Asia</p>
            <p className="text-sm mb-2"><strong>Standard Shipping:</strong> 7-14 business days</p>
            <p className="text-sm mb-2"><strong>Express Shipping:</strong> 3-5 business days</p>
            <p className="text-sm"><strong>Free shipping:</strong> International orders over $100 USD</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Methods & Timeframes</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 mb-8">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left border-b border-gray-200">Shipping Method</th>
                <th className="py-3 px-4 text-left border-b border-gray-200">Estimated Delivery</th>
                <th className="py-3 px-4 text-left border-b border-gray-200">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border-b border-gray-200">Standard Domestic</td>
                <td className="py-3 px-4 border-b border-gray-200">1-3 business days</td>
                <td className="py-3 px-4 border-b border-gray-200">30,000₫ (Free over 1,000,000₫)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-b border-gray-200">Express Domestic</td>
                <td className="py-3 px-4 border-b border-gray-200">Next business day</td>
                <td className="py-3 px-4 border-b border-gray-200">60,000₫</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-b border-gray-200">Standard International</td>
                <td className="py-3 px-4 border-b border-gray-200">7-14 business days</td>
                <td className="py-3 px-4 border-b border-gray-200">$15 USD (Free over $100 USD)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-b border-gray-200">Express International</td>
                <td className="py-3 px-4 border-b border-gray-200">3-5 business days</td>
                <td className="py-3 px-4 border-b border-gray-200">$25 USD</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Please Note:</strong> Delivery timeframes are estimates and may vary based on 
                location, customs processing for international orders, and other external factors.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Order Processing</h2>
        
        <div className="flex items-center mb-4">
          <FiClock className="text-xl text-blue-600 mr-3" />
          <p>Orders are typically processed within 24 hours of being placed, excluding weekends and holidays.</p>
        </div>
        
        <p>
          After your order has been processed, you will receive a shipping confirmation email with tracking 
          information. You can also track your order by logging into your Vina Shoes account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Restrictions</h2>
        
        <p>
          We currently ship to Vietnam and the following Southeast Asian countries:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Thailand</li>
          <li>Malaysia</li>
          <li>Singapore</li>
          <li>Indonesia</li>
          <li>Philippines</li>
          <li>Cambodia</li>
          <li>Laos</li>
        </ul>
        
        <p>
          If your country is not listed above, please contact our customer service team to inquire about 
          shipping options.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Customs, Duties, and Taxes</h2>
        
        <p>
          International orders may be subject to customs duties and taxes imposed by the destination country. 
          These fees are the responsibility of the customer and are not included in the order total.
        </p>
        
        <p>
          We are not responsible for delays caused by customs processing, import duties, or other factors 
          beyond our control.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Lost or Damaged Packages</h2>
        
        <p>
          If your package is lost or damaged during transit:
        </p>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">Contact our customer service team within 7 days of the expected delivery date.</li>
          <li className="mb-2">Provide your order number and any tracking information.</li>
          <li className="mb-2">We will investigate the status with our shipping partners.</li>
          <li className="mb-2">If the package is confirmed lost or damaged, we will send a replacement or issue a refund.</li>
        </ol>
        
        <div className="bg-green-50 rounded-lg p-6 my-6">
          <h3 className="font-semibold mb-3">Delivery Insurance</h3>
          <p className="mb-2">
            All orders are shipped with basic insurance coverage. For high-value orders, we recommend 
            purchasing additional shipping insurance during checkout for complete coverage.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Address Changes</h2>
        
        <p>
          If you need to change your shipping address after placing an order:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Contact our customer service team as soon as possible.</li>
          <li>Address changes can only be accommodated if the order has not yet been processed for shipping.</li>
          <li>For orders already in transit, we cannot modify the delivery address.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Our Shipping Department</h2>
        
        <p>
          If you have any questions or concerns about shipping, please contact us:
        </p>
        <ul className="list-none pl-0 mb-4">
          <li>Email: shipping@vinashoes.com</li>
          <li>Phone: +84 123 456 789</li>
          <li>Hours: Monday-Friday, 9AM-5PM (Vietnam Time)</li>
        </ul>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link href="/policy/privacy" className="text-blue-600 hover:text-blue-800 mr-6">
            Privacy Policy
          </Link>
          <Link href="/policy/terms" className="text-blue-600 hover:text-blue-800 mr-6">
            Terms of Service
          </Link>
          <Link href="/policy/returns" className="text-blue-600 hover:text-blue-800">
            Returns & Exchanges Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
