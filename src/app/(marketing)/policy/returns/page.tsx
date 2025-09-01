/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Returns & Exchanges Policy</h1>
        <p className="text-gray-600">Last Updated: July 13, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          At Vina Shoes, we want you to be completely satisfied with your purchase. If for any reason you are not
          satisfied, we offer a straightforward returns and exchanges policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Return Policy Overview</h2>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <ul className="space-y-2">
            <li className="flex items-start">
              <AiOutlineCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
              <span><strong>30-Day Return Period:</strong> Items can be returned within 30 days of delivery.</span>
            </li>
            <li className="flex items-start">
              <AiOutlineCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
              <span><strong>Condition Requirement:</strong> Items must be unworn, unwashed, and in original condition with all tags attached.</span>
            </li>
            <li className="flex items-start">
              <AiOutlineCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
              <span><strong>Original Packaging:</strong> Please return items in their original packaging when possible.</span>
            </li>
            <li className="flex items-start">
              <AiOutlineCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
              <span><strong>Proof of Purchase:</strong> Order number or receipt must be provided for all returns.</span>
            </li>
            <li className="flex items-start">
              <AiOutlineCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
              <span><strong>Return Shipping Cost:</strong> Customers are responsible for return shipping costs unless the return is due to our error.</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Return an Item</h2>
        
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-3">
            <strong>Initiate a Return:</strong> Log into your account and select the order containing the item(s) you wish to return. 
            Select "Return Items" and follow the prompts.
          </li>
          <li className="mb-3">
            <strong>Print Return Label:</strong> Once your return is approved, you'll receive a confirmation email with a return label. 
            Print the label and attach it securely to your package.
          </li>
          <li className="mb-3">
            <strong>Package Your Return:</strong> Place the item(s) in original or similar packaging, including all tags, accessories, 
            and original contents.
          </li>
          <li className="mb-3">
            <strong>Ship Your Return:</strong> Drop off your package at the designated shipping carrier. We recommend obtaining a 
            tracking number for your records.
          </li>
          <li className="mb-3">
            <strong>Refund Processing:</strong> Once we receive and inspect your return, we'll process your refund. This typically 
            takes 5-7 business days from receipt of the returned item(s).
          </li>
        </ol>
        
        <p>
          If you don't have an account or prefer not to use the online returns portal, please contact our customer service team 
          at returns@vinashoes.com or call +84 123 456 789.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Exchange Policy</h2>
        
        <p>
          We currently process exchanges as a return followed by a new order. To exchange an item:
        </p>
        
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">Follow the return process outlined above to return the original item.</li>
          <li className="mb-2">Place a new order for the item you want instead.</li>
        </ol>
        
        <p>
          If you prefer a direct exchange without placing a new order, please contact our customer service team, and we can 
          assist with setting up a direct exchange.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mt-6 mb-6">
          <h3 className="font-semibold mb-3">Expedited Exchanges</h3>
          <p>
            For expedited exchanges, you may place a new order for the desired item immediately, then return the original 
            purchase. This ensures you receive the new item as quickly as possible.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Information</h2>
        
        <p>
          Refunds are processed to the original payment method used for the purchase:
        </p>
        
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Credit/Debit Cards:</strong> Refunds typically appear on your statement within 5-10 business days after 
            processing, depending on your bank's policies.
          </li>
          <li className="mb-2">
            <strong>PayPal:</strong> Refunds are typically processed within 2-3 business days.
          </li>
          <li className="mb-2">
            <strong>Store Credit:</strong> If you prefer, we can issue a store credit for the return amount, which will be 
            available immediately for use.
          </li>
        </ul>
        
        <p>
          Please note that shipping charges are non-refundable unless the return is due to our error (damaged, defective, 
          or incorrect item shipped).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Exclusions and Special Cases</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Non-Returnable Items</h3>
        <p>
          The following items cannot be returned:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Custom-made or personalized shoes</li>
          <li>Items marked as "Final Sale" or "Non-Returnable"</li>
          <li>Items showing signs of wear or use</li>
          <li>Gift cards</li>
        </ul>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Sale Items</h3>
        <p>
          Items purchased during sales or with discount codes follow the same return policy unless specifically marked as 
          "Final Sale" at the time of purchase.
        </p>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Damaged or Defective Items</h3>
        <p>
          If you receive a damaged or defective item, please contact our customer service team within 48 hours of delivery. 
          We will arrange a return or exchange at no cost to you, including return shipping.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">International Returns</h2>
        
        <p>
          For international orders, the same 30-day return policy applies, but please note:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Customer is responsible for return shipping costs</li>
          <li>Customer is responsible for any duties, taxes, or customs fees incurred during the return shipping process</li>
          <li>Processing time may be longer for international returns</li>
        </ul>
        
        <p>
          We recommend using a trackable shipping method for all international returns.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Our Returns Department</h2>
        
        <p>
          If you have any questions or need assistance with returns or exchanges, please contact us:
        </p>
        <ul className="list-none pl-0 mb-4">
          <li>Email: returns@vinashoes.com</li>
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
          <Link href="/policy/shipping" className="text-blue-600 hover:text-blue-800">
            Shipping Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
