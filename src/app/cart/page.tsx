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
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading your cart...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If no cart or no active items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart?.items.filter(item => item.isActive).map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="relative w-24 h-24">
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

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-blue-600 font-medium">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
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
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.quantity <= 1 || isLoading}
                >
                  <AiOutlineMinus size={20} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
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
                  className="p-1 rounded-md hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
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
                  className="text-red-500 hover:text-red-700 mt-2"
                  disabled={isLoading}
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart?.totalAmount.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${cart?.totalAmount.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center mt-4 text-blue-600 hover:text-blue-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap CartPage with withAuth HOC and export
const ProtectedCartPage = withAuth(CartPage);
export default ProtectedCartPage;
