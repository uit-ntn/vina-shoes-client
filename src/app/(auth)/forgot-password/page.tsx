'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from '@/components/ui/Image';
import { AiOutlineMail } from 'react-icons/ai';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Here you would handle your forgot password logic
      // For now, just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center justify-center">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-[#1a3766] mr-0.5">Vina</span>
              <span className="text-[#d9292a]">Shoes</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
              </p>
              <div className="mt-6">
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Return to login
                </Link>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Send Reset Link
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-4 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Vina Shoes. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
