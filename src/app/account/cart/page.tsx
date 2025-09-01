'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { withAuth } from '@/components/auth/withAuth';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

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
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Loading Your Cart</h2>
            <p className="text-blue-700">Just a moment while we retrieve your items...</p>
            
            {/* Loading skeleton */}
            <div className="w-full max-w-md mt-8">
              <div className="h-4 bg-blue-100 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-blue-100 rounded animate-pulse w-3/4 mb-8"></div>
              
              <div className="h-24 bg-blue-50 rounded animate-pulse mb-4"></div>
              <div className="h-24 bg-blue-50 rounded animate-pulse"></div>
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
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Your Cart is Empty</h2>
          <p className="text-blue-700 mb-8 max-w-md mx-auto">Looks like you haven&apos;t added any items to your cart yet. Find something you love and add it to your cart.</p>
          
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
              <h3 className="text-sm font-medium text-blue-900">Add Products</h3>
              <p className="text-xs text-blue-700 mt-1">Browse our collection</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-blue-900">Fill Your Cart</h3>
              <p className="text-xs text-blue-700 mt-1">Add items you love</p>
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

      <div className="space-y-4">
        <div className="hidden md:flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-2 font-medium text-blue-800">
          <span className="w-24">Product</span>
          <span className="flex-1 ml-4">Description</span>
          <span className="w-24 text-center">Quantity</span>
          <span className="w-24 text-right">Total</span>
        </div>
      
        {cart?.items.filter(item => item.isActive).map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
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

            <div className="flex items-center space-x-1 md:space-x-2 border border-blue-200 rounded-lg p-1 w-full md:w-auto">
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
                className="p-2 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={item.quantity <= 1 || isLoading}
              >
                <AiOutlineMinus size={18} className="text-blue-700" />
              </button>
              <span className="w-8 text-center font-medium text-blue-900">{item.quantity}</span>
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
                className="p-2 rounded-md hover:bg-blue-50 transition-colors"
                disabled={isLoading}
              >
                <AiOutlinePlus size={18} className="text-blue-700" />
              </button>
            </div>

            <div className="text-right w-full md:w-24 flex justify-between md:block">
              <span className="text-sm text-blue-700 md:hidden">Total:</span>
              <p className="font-semibold text-blue-800 text-lg">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional sections */}
      <div className="mt-12">
        {/* Link back to main cart */}
        <div className="text-center mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">View full cart with checkout options</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Wrap CartPage with withAuth HOC and export
const ProtectedCartPage = withAuth(CartPage);
export default ProtectedCartPage;
