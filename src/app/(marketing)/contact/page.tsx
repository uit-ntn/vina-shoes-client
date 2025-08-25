'use client';

import React, { useState } from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Here you would handle your contact form submission logic
      // For now, just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-800 max-w-3xl mx-auto">
          We&apos;re here to help and answer any questions you might have. We look forward to hearing from you!
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <AiOutlinePhone className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Phone</h3>
          <p className="text-gray-600">+84 123 456 789</p>
          <p className="text-gray-600">Mon-Fri, 9am-6pm</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <AiOutlineMail className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Email</h3>
          <p className="text-gray-600">support@vinashoes.com</p>
          <p className="text-gray-600">We reply within 24 hours</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <AiOutlineEnvironment className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Location</h3>
          <p className="text-gray-600">123 Nguyen Hue Street</p>
          <p className="text-gray-600">Ho Chi Minh City, Vietnam</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <AiOutlineClockCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Business Hours</h3>
          <p className="text-gray-600">Monday-Friday: 9AM - 6PM</p>
          <p className="text-gray-600">Saturday: 10AM - 4PM</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Send Us a Message</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-sm text-green-700">
                Your message has been sent successfully! We&apos;ll get back to you soon.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Return/Exchange">Return or Exchange</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
        
        {/* Map and Address */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Find Us</h2>
            <p className="text-gray-600 mb-6">
              Visit our store in Ho Chi Minh City, Vietnam. 
              We&apos;re located in the heart of the shopping district.
            </p>
            
            {/* Map Placeholder - In a real application, you would use Google Maps or similar */}
            <div className="bg-gray-200 w-full h-64 rounded-md mb-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <p className="text-gray-600">Map Placeholder</p>
              </div>
            </div>
            
            <div className="flex items-start mt-4">
              <AiOutlineEnvironment className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-600">
                123 Nguyen Hue Street<br />
                District 1<br />
                Ho Chi Minh City, Vietnam
              </p>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4">Customer Support</h3>
            <p className="mb-4">
              Need help with your order or have questions about our products? Our customer support team is here to help!
            </p>
            <div className="flex items-center mb-2">
              <AiOutlinePhone className="mr-2" />
              <span>+84 123 456 789</span>
            </div>
            <div className="flex items-center">
              <AiOutlineMail className="mr-2" />
              <span>support@vinashoes.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2">
            Find quick answers to common questions
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-blue-900">How do I track my order?</h3>
            <p className="text-gray-600 mb-3">Learn how to track your package and get delivery updates.</p>
            <a href="/faq#tracking" className="text-blue-600 font-medium hover:text-blue-800">Learn more →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-blue-900">What is your return policy?</h3>
            <p className="text-gray-600 mb-3">Learn about our 30-day return policy and exchange process.</p>
            <a href="/faq#returns" className="text-blue-600 font-medium hover:text-blue-800">Learn more →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-blue-900">Do you offer international shipping?</h3>
            <p className="text-gray-600 mb-3">Find out about our shipping options and delivery times.</p>
            <a href="/faq#shipping" className="text-blue-600 font-medium hover:text-blue-800">Learn more →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
