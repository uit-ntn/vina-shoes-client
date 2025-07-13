import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiUser } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Choosing Running Shoes',
    excerpt: 'Learn how to select the perfect running shoes for your foot type and running style. Discover key features to look for and common mistakes to avoid.',
    slug: 'ultimate-guide-choosing-running-shoes',
    category: 'Running',
    author: 'Sarah Johnson',
    date: 'July 10, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['Running', 'Shoes Guide', 'Fitness']
  },
  {
    id: '2',
    title: 'Sneaker Trends for Summer 2025',
    excerpt: 'Stay ahead of the curve with our comprehensive guide to this summer\'s hottest sneaker trends. From retro comebacks to futuristic designs.',
    slug: 'sneaker-trends-summer-2025',
    category: 'Fashion',
    author: 'Mike Chen',
    date: 'July 8, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['Fashion', 'Trends', 'Summer']
  },
  {
    id: '3',
    title: 'How to Care for Leather Shoes',
    excerpt: 'Extend the life of your leather shoes with our expert care guide. Learn proper cleaning, conditioning, and storage techniques.',
    slug: 'leather-shoe-care-guide',
    category: 'Care Guide',
    author: 'Emily Parker',
    date: 'July 5, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1546766888-6d6f7191e337?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['Leather', 'Shoe Care', 'Maintenance']
  },
  {
    id: '4',
    title: 'The Rise of Sustainable Footwear',
    excerpt: 'Discover how the footwear industry is embracing sustainability. Learn about eco-friendly materials and ethical manufacturing practices.',
    slug: 'sustainable-footwear-rise',
    category: 'Sustainability',
    author: 'Alex Wong',
    date: 'July 3, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['Sustainability', 'Eco-Friendly', 'Future']
  },
  {
    id: '5',
    title: 'Best Shoes for Standing All Day',
    excerpt: 'Find the perfect shoes for long hours on your feet. Comprehensive reviews and recommendations for different professions and needs.',
    slug: 'best-shoes-standing-all-day',
    category: 'Buying Guide',
    author: 'Rachel Martinez',
    date: 'June 30, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['Comfort', 'Work Shoes', 'Reviews']
  },
  {
    id: '6',
    title: 'History of Iconic Sneaker Designs',
    excerpt: 'Take a journey through time exploring the most iconic sneaker designs that have shaped footwear culture and fashion.',
    slug: 'iconic-sneaker-designs-history',
    category: 'History',
    author: 'Tom Bradley',
    date: 'June 28, 2025',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['History', 'Sneakers', 'Design']
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vina Shoes Blog</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover the latest trends, care guides, and insights about footwear
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['All', 'Running', 'Fashion', 'Care Guide', 'Sustainability'].map((category) => (
                <button
                  key={category}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition duration-300"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="relative h-48 sm:h-64">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                  <span className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest articles, trends, and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
