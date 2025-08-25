'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState('');
  const { forgotPassword, resetPassword, loading: isLoading, error: authError } = useAuth();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await forgotPassword(email);
      setStep('verify');
    } catch (err) {
      setError((err as Error).message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    try {
      await resetPassword(email, otp, newPassword);
      // resetPassword đã bao gồm thông báo thành công và chuyển hướng trong AuthContext
      // Note: we're using the OTP as the token parameter now
    } catch (err) {
      setError((err as Error).message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
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
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 'request' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'request' 
                ? 'Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu' 
                : `Nhập mã OTP đã được gửi đến ${email} và mật khẩu mới của bạn`}
            </p>
          </div>
          
          {(error || authError) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error || authError}</p>
                </div>
              </div>
            </div>
          )}
          
          {step === 'request' ? (
            <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineMail className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter OTP code"
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineLock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="New password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineLock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm password"
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
                    Reset Password
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Back to email entry
                  </button>
                </div>
              </form>
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
