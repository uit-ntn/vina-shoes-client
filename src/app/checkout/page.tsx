'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your checkout logic here
    console.log('Shipping info:', shippingInfo);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Sample Order Item */}
            <div className="flex items-center space-x-4 border-b pb-4">
              <div className="relative w-20 h-20">
                <Image
                  src="/images/placeholder-shoe.jpg"
                  alt="Product"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Sample Product</h3>
                <p className="text-gray-600">Size: 42</p>
                <p className="text-gray-600">Quantity: 1</p>
              </div>
              <p className="font-semibold">$99.99</p>
            </div>

            {/* Order Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$99.99</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>$109.99</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
                <Image
                  src="/payment-visa.svg"
                  alt="Visa"
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
                <Image
                  src="/payment-mastercard.svg"
                  alt="Mastercard"
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
                <Image
                  src="/payment-paypal.svg"
                  alt="PayPal"
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
                <Image
                  src="/payment-amex.svg"
                  alt="American Express"
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Shipping Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={shippingInfo.notes}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Additional information about your order"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
