import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last Updated: July 13, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          At Vina Shoes, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you visit our website and use our services.
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
          please do not access the site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Personal Data</h3>
        <p>
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Register on our website</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Participate in promotions or surveys</li>
          <li>Contact our customer service</li>
        </ul>
        
        <p>
          The personal information we collect may include your name, email address, postal address, 
          phone number, and payment information. We do not store complete credit card information on our servers.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">Automatically Collected Information</h3>
        <p>
          When you visit our website, we automatically collect certain information about your device, 
          including information about your web browser, IP address, time zone, and some of the cookies 
          that are installed on your device. Additionally, as you browse the site, we collect information 
          about the individual web pages that you view, what websites or search terms referred you to the site,
          and information about how you interact with the site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your orders, products, and services</li>
          <li>Send you marketing communications (if you've opted in)</li>
          <li>Improve our website, products, and services</li>
          <li>Prevent fraud and enhance security</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our site and hold certain 
          information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          Cookies are sent to your browser from a website and stored on your device.
        </p>
        
        <p className="mt-4">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
          However, if you do not accept cookies, you may not be able to use some portions of our site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside 
          parties except as described below:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Service providers who assist us in operating our website, conducting our business, or servicing you</li>
          <li>Trusted third parties who agree to keep this information confidential</li>
          <li>When we believe release is appropriate to comply with the law or protect our rights</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
        <p>
          We will retain your personal information only for as long as necessary to fulfill the purposes 
          for which we collected it, including to satisfy any legal, accounting, or reporting requirements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, such as:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Right to access the personal information we hold about you</li>
          <li>Right to rectification of inaccurate personal information</li>
          <li>Right to erasure of your personal information</li>
          <li>Right to restrict or object to processing of your personal information</li>
          <li>Right to data portability</li>
        </ul>
        
        <p className="mt-4">
          To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your 
          personal information. However, please note that no method of transmission over the Internet or method 
          of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
          your personal information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
          this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul className="list-none pl-0 mb-4">
          <li>Email: privacy@vinashoes.com</li>
          <li>Phone: +84 123 456 789</li>
          <li>Address: 123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam</li>
        </ul>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link href="/policy/terms" className="text-blue-600 hover:text-blue-800 mr-6">
            Terms of Service
          </Link>
          <Link href="/policy/shipping" className="text-blue-600 hover:text-blue-800 mr-6">
            Shipping Policy
          </Link>
          <Link href="/policy/returns" className="text-blue-600 hover:text-blue-800">
            Return Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
