'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { withAuth } from '@/components/auth/withAuth';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { CartItem } from '@/types/cartItem';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  // Load cart data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [cart]);

  // Show loading state while checking authentication or loading cart
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center flex-col">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-r-2 border-l-2 border-blue-300 animate-spin animate-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Cart</h2>
            <p className="text-gray-500">Just a moment while we retrieve your items...</p>
            
            {/* Loading skeleton */}
            <div className="w-full max-w-md mt-8">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-8"></div>
              
              <div className="h-24 bg-gray-100 rounded animate-pulse mb-4"></div>
              <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no cart or no active items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Find something you love and add it to your cart.</p>
          
          <Link
            href="/shop"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Start Shopping
          </Link>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Add Products</h3>
              <p className="text-xs text-gray-500 mt-1">Browse our collection</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Fill Your Cart</h3>
              <p className="text-xs text-gray-500 mt-1">Add items you love</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Checkout</h3>
              <p className="text-xs text-gray-500 mt-1">Quick and secure payment</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Enjoy</h3>
              <p className="text-xs text-gray-500 mt-1">Receive your new items</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        <Link
          href="/shop"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden md:flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2 font-medium text-gray-700">
            <span className="w-24">Product</span>
            <span className="flex-1 ml-4">Description</span>
            <span className="w-24 text-center">Quantity</span>
            <span className="w-24 text-right">Total</span>
          </div>
        
          {cart?.items.filter(item => item.isActive).map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative w-24 h-24 md:w-24 md:h-24 flex-shrink-0">
                <div className="absolute top-0 right-0 z-10">
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        await removeFromCart(item.productId);
                        toast.success('Item removed from cart');
                      } catch (error) {
                        console.error('Failed to remove item:', error);
                        toast.error('Failed to remove item');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
                    disabled={isLoading}
                    aria-label="Remove item"
                  >
                    <AiOutlineDelete size={16} className="text-red-500" />
                  </button>
                </div>
                <Image
                  src={item.image || '/images/placeholder-shoe.jpg'}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-shoe.jpg';
                  }}
                />
              </div>

              <div className="flex-1 md:ml-4">
                <Link href={`/shop/${item.productId}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">{item.name}</h3>
                </Link>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-xs text-blue-800">
                    Size: {item.size}
                  </span>
                  {/* Color tag could be added in the future when available in CartItem type */}
                </div>
                <p className="text-blue-600 font-medium mt-2">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2 border border-gray-200 rounded-lg p-1 w-full md:w-auto">
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await updateQuantity(item.productId, item.quantity - 1);
                    } catch (error) {
                      console.error('Failed to update quantity:', error);
                      toast.error('Failed to update quantity');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={item.quantity <= 1 || isLoading}
                >
                  <AiOutlineMinus size={18} />
                </button>
                <span className="w-8 text-center font-medium text-black">{item.quantity}</span>
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await updateQuantity(item.productId, item.quantity + 1);
                    } catch (error) {
                      console.error('Failed to update quantity:', error);
                      toast.error('Failed to update quantity');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  <AiOutlinePlus size={18} />
                </button>
              </div>

              <div className="text-right w-full md:w-24 flex justify-between md:block">
                <span className="text-sm text-gray-500 md:hidden">Total:</span>
                <p className="font-semibold text-black text-lg">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({cart?.items.length} items)</span>
                <span className="font-medium">${cart?.totalAmount.toLocaleString() || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              {cart?.totalAmount >= 200 ? (
                <div className="bg-green-50 p-3 rounded-md text-sm">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-green-800">
                      You've qualified for <span className="font-medium">free shipping</span>!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-3 rounded-md text-sm">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-blue-800">
                      Add ${(200 - (cart?.totalAmount || 0)).toFixed(2)} more to qualify for <span className="font-medium">free shipping</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Promo code input */}
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-r-md hover:bg-gray-300 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-700">${cart?.totalAmount.toLocaleString() || '0'}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1 text-right">Tax included</p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">We Accept</h3>
              <div className="flex items-center space-x-3">
                <img src="/payment-visa.svg" alt="Visa" className="h-8" />
                <img src="/payment-mastercard.svg" alt="Mastercard" className="h-8" />
                <img src="/payment-amex.svg" alt="American Express" className="h-8" />
                <img src="/payment-paypal.svg" alt="PayPal" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional sections */}
      <div className="mt-12">
        {/* Recently viewed / You might also like section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* This would normally be populated with actual product recommendations */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="mt-3 h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shopping assistance */}
        <div className="bg-blue-50 rounded-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Chat with Us</h4>
                <p className="text-sm text-blue-700 mt-1">Our customer service team is here to help.</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">Start Chat</button>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Email Us</h4>
                <p className="text-sm text-blue-700 mt-1">Send us an email and we'll get back to you.</p>
                <Link href="/contact" className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">Contact Form</Link>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Shipping & Returns</h4>
                <p className="text-sm text-blue-700 mt-1">Learn about our shipping and return policies.</p>
                <div className="flex space-x-4 mt-2">
                  <Link href="/policy/shipping" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Shipping</Link>
                  <Link href="/policy/returns" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Returns</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap CartPage with withAuth HOC and export
const ProtectedCartPage = withAuth(CartPage);
export default ProtectedCartPage;
