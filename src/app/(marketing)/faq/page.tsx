'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from 'react-icons/ai';

// FAQ Data
const faqCategories = [
	{
		id: 'ordering',
		name: 'Ordering & Payment',
		faqs: [
			{
				id: 'payment-methods',
				question: 'What payment methods do you accept?',
				answer:
					'We accept Visa, Mastercard, American Express, and PayPal. All payments are securely processed, and we do not store your credit card information. For orders within Vietnam, we also offer Cash on Delivery (COD) and bank transfers.',
			},
			{
				id: 'order-confirmation',
				question: 'How do I know if my order was placed successfully?',
				answer:
					'Once your order is successfully placed, you will receive an order confirmation email with your order details. If you do not receive this email within 24 hours, please check your spam folder or contact our customer support team.',
			},
			{
				id: 'edit-order',
				question: "Can I modify or cancel my order after it's placed?",
				answer:
					'Orders can be modified or canceled within 1 hour of placement. After that, our system begins processing your order for shipment. To make changes, please contact our customer support team as soon as possible with your order number.',
			},
			{
				id: 'promo-codes',
				question: 'How do I apply a promo code to my order?',
				answer:
					'You can apply a promo code during checkout. After adding items to your cart, proceed to checkout and you will find a field labeled "Promo Code" or "Discount Code" where you can enter your code. Click "Apply" to see the discount reflected in your order total.',
			},
		],
	},
	{
		id: 'shipping',
		name: 'Shipping & Delivery',
		faqs: [
			{
				id: 'shipping-time',
				question: 'How long will it take to receive my order?',
				answer:
					'Domestic orders (within Vietnam) typically arrive within 2-5 business days. International shipping times vary by destination, usually between 7-14 business days. Expedited shipping options are available at checkout for faster delivery.',
			},
			{
				id: 'tracking',
				question: 'How can I track my order?',
				answer:
					'Once your order ships, you will receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website or directly through the courier\'s website. You can also view your order status by logging into your account on our website.',
			},
			{
				id: 'international-shipping',
				question: 'Do you offer international shipping?',
				answer:
					'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please note that any import duties or taxes levied by the destination country are the responsibility of the customer.',
			},
			{
				id: 'free-shipping',
				question: 'Do you offer free shipping?',
				answer:
					'We offer free standard shipping on domestic orders over $100 and international orders over $200. Promotional free shipping offers may be available periodically throughout the year.',
			},
		],
	},
	{
		id: 'returns',
		name: 'Returns & Exchanges',
		faqs: [
			{
				id: 'return-policy',
				question: 'What is your return policy?',
				answer:
					'We offer a 30-day return policy. Items must be unworn, in their original condition with all tags attached. Discounted items are eligible for returns unless otherwise specified. Custom-made items are non-returnable.',
			},
			{
				id: 'exchange-process',
				question: 'How do I exchange an item for a different size or color?',
				answer:
					'To exchange an item, initiate a return request through your account or contact customer support. Once your return is received and processed, you can place a new order for the desired size or color. If you prefer a direct exchange, please contact our customer support team with your order number and exchange details.',
			},
			{
				id: 'refund-timing',
				question: 'How long does it take to process a refund?',
				answer:
					'Once we receive your returned item, it typically takes 3-5 business days to process. After processing, refunds will be issued to your original payment method. Credit card refunds may take 5-10 additional business days to appear on your statement, depending on your bank\'s policies.',
			},
			{
				id: 'return-shipping',
				question: 'Who pays for return shipping?',
				answer:
					'Customers are responsible for return shipping costs unless the return is due to our error (such as wrong item shipped or defective product). For returns due to our error, please contact customer support for a prepaid return shipping label.',
			},
		],
	},
	{
		id: 'product',
		name: 'Product Information',
		faqs: [
			{
				id: 'sizing',
				question: 'How do I find the right size?',
				answer:
					'We provide a detailed size guide on each product page. For the most accurate fit, we recommend measuring your feet according to our measuring guide and comparing with our size chart. If you\'re between sizes, we generally recommend going up to the next size.',
			},
			{
				id: 'materials',
				question: 'What materials are used in your shoes?',
				answer:
					'We use a variety of materials including genuine leather, synthetic materials, canvas, and rubber. Each product page specifies the materials used. We strive to source ethically made materials and are increasing our range of eco-friendly options.',
			},
			{
				id: 'care-instructions',
				question: 'How should I care for my shoes?',
				answer:
					'Care instructions vary depending on the material of your shoes. Generally, we recommend keeping leather shoes clean and conditioning them regularly, storing shoes away from direct sunlight and heat, and using shoe trees to maintain shape. Specific care instructions are included with your purchase.',
			},
			{
				id: 'warranty',
				question: 'Do your products come with a warranty?',
				answer:
					'Our shoes come with a 6-month warranty against manufacturing defects under normal use. This does not cover wear and tear from regular use or damage caused by improper care. If you believe your product has a manufacturing defect, please contact our customer support team with photos and your order details.',
			},
		],
	},
	{
		id: 'account',
		name: 'Account & Orders',
		faqs: [
			{
				id: 'create-account',
				question: 'Do I need to create an account to place an order?',
				answer:
					'While creating an account is recommended for easier order tracking and faster checkout in the future, we do offer a guest checkout option. With an account, you can also save favorite products, access your order history, and receive personalized recommendations.',
			},
			{
				id: 'order-history',
				question: 'How can I view my order history?',
				answer:
					'You can view your order history by logging into your account and navigating to the "Order History" or "My Orders" section. Here, you can see details of all your past orders, track current orders, and initiate returns if needed.',
			},
			{
				id: 'forgot-password',
				question: 'I forgot my password. How do I reset it?',
				answer:
					'On the login page, click on the "Forgot Password" link. Enter the email address associated with your account, and we\'ll send you a password reset link. If you don\'t receive the email, please check your spam folder or contact customer support.',
			},
			{
				id: 'newsletter',
				question: 'How do I subscribe or unsubscribe from your newsletter?',
				answer:
					'You can subscribe to our newsletter by entering your email in the subscription box in the footer of our website. To unsubscribe, click the "Unsubscribe" link at the bottom of any newsletter email or update your preferences in your account settings.',
			},
		],
	},
];

export default function FAQPage() {
	const [activeCategory, setActiveCategory] = useState('ordering');
	const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);

	// Toggle FAQ expansion
	const toggleFaq = (faqId: string) => {
		setExpandedFaqs((prev) => ({
			...prev,
			[faqId]: !prev[faqId],
		}));
	};

	// Handle search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		const query = searchQuery.toLowerCase();
		const results: any[] = [];

		faqCategories.forEach((category) => {
			category.faqs.forEach((faq) => {
				if (faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)) {
					results.push({
						...faq,
						category: category.name,
					});
				}
			});
		});

		setSearchResults(results);
	};

	// Get current category
	const currentCategory = faqCategories.find((cat) => cat.id === activeCategory);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Frequently Asked Questions
					</h1>
					<p className="text-lg text-gray-700 max-w-3xl mx-auto">
						Find answers to common questions about our products, ordering, shipping, returns, and more.
					</p>
				</div>

				{/* Search Bar */}
				<div className="max-w-2xl mx-auto mb-12">
					<form onSubmit={handleSearch} className="relative">
						<div className="relative">
							<input
								type="text"
								placeholder="Search for answers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
							/>
							<button
								type="submit"
								className="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
							>
								<AiOutlineSearch size={20} />
							</button>
						</div>
					</form>
				</div>

				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="mb-12">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Search Results ({searchResults.length})
						</h2>
						<div className="space-y-4">
							{searchResults.map((faq) => (
								<div
									key={faq.id}
									className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
								>
									<button
										onClick={() => toggleFaq(faq.id)}
										className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
									>
										<div>
											<span className="font-semibold text-gray-900">{faq.question}</span>
											<p className="text-sm text-gray-600 mt-1">Category: {faq.category}</p>
										</div>
										{expandedFaqs[faq.id] ? (
											<AiOutlineMinus className="flex-shrink-0 text-blue-600" />
										) : (
											<AiOutlinePlus className="flex-shrink-0 text-blue-600" />
										)}
									</button>
									{expandedFaqs[faq.id] && (
										<div className="px-6 py-4 bg-gray-50">
											<p className="text-gray-700 leading-relaxed">{faq.answer}</p>
										</div>
									)}
								</div>
							))}
						</div>
						<button
							onClick={() => setSearchResults([])}
							className="mt-4 text-blue-700 hover:text-blue-800 font-medium"
						>
							Clear search results
						</button>
					</div>
				)}

				{/* Categories and FAQs */}
				{searchResults.length === 0 && (
					<>
						{/* Category Tabs */}
						<div className="border-b border-gray-200 mb-8">
							<div className="flex overflow-x-auto pb-2">
								{faqCategories.map((category) => (
									<button
										key={category.id}
										onClick={() => setActiveCategory(category.id)}
										className={`whitespace-nowrap px-5 py-3 font-medium text-base transition-colors ${
											activeCategory === category.id
												? 'border-b-2 border-blue-600 text-blue-700'
												: 'border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
										}`}
									>
										{category.name}
									</button>
								))}
							</div>
						</div>

						{/* FAQ Accordion */}
						{currentCategory && (
							<div>
								<h2 className="text-2xl font-bold mb-6 text-gray-900" id={currentCategory.id}>
									{currentCategory.name}
								</h2>
								<div className="space-y-4">
									{currentCategory.faqs.map((faq) => (
										<div
											key={faq.id}
											className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
											id={faq.id}
										>
											<button
												onClick={() => toggleFaq(faq.id)}
												className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
											>
												<span className="font-semibold text-gray-900">{faq.question}</span>
												{expandedFaqs[faq.id] ? (
													<AiOutlineMinus className="flex-shrink-0 text-blue-600" />
												) : (
													<AiOutlinePlus className="flex-shrink-0 text-blue-600" />
												)}
											</button>
											{expandedFaqs[faq.id] && (
												<div className="px-6 py-4 bg-gray-50">
													<p className="text-gray-700 leading-relaxed">{faq.answer}</p>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}

				{/* Contact Section */}
				<div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
					<div className="text-center">
						<h2 className="text-2xl font-bold mb-2 text-gray-900">Still have questions?</h2>
						<p className="text-gray-700 mb-6">
							Can't find the answer you're looking for? Please contact our customer support team.
						</p>
						<Link
							href="/contact"
							className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
						>
							Contact Us
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
