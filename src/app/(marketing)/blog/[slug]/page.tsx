import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiUser, FiShare2, FiBookmark, FiHeart } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const post: BlogPost = {
  id: '1',
  title: 'The Ultimate Guide to Choosing Running Shoes',
  content: `
    <p>Choosing the right running shoes is crucial for both comfort and performance. Whether you're a seasoned marathon runner or just starting your fitness journey, understanding how to select the perfect pair of running shoes can make all the difference in your running experience.</p>

    <h2>Understanding Your Running Style</h2>
    <p>Before diving into specific shoe recommendations, it's important to understand your running style or "gait." This includes:</p>
    <ul>
      <li>Pronation (how your foot rolls when it strikes the ground)</li>
      <li>Stride length and cadence</li>
      <li>Foot strike pattern (heel, midfoot, or forefoot)</li>
    </ul>

    <h2>Key Features to Consider</h2>
    <p>When selecting running shoes, pay attention to these important features:</p>
    <ul>
      <li>Cushioning level</li>
      <li>Stack height</li>
      <li>Heel-to-toe drop</li>
      <li>Upper material and breathability</li>
      <li>Weight</li>
    </ul>

    <h2>Finding the Right Fit</h2>
    <p>A proper fit is essential for comfortable and injury-free running. Here are some fitting tips:</p>
    <ul>
      <li>Shop for shoes late in the day when feet are slightly swollen</li>
      <li>Wear the same socks you'll use for running</li>
      <li>Allow about a thumb's width of space in the toe box</li>
      <li>Make sure the midfoot and heel are snug but not tight</li>
    </ul>

    <h2>Common Mistakes to Avoid</h2>
    <p>Watch out for these common pitfalls when shopping for running shoes:</p>
    <ul>
      <li>Choosing shoes based solely on appearance</li>
      <li>Ignoring your specific needs and running style</li>
      <li>Not replacing shoes frequently enough</li>
      <li>Assuming your size is the same across all brands</li>
    </ul>
  `,
  slug: 'ultimate-guide-choosing-running-shoes',
  category: 'Running',
  author: 'Sarah Johnson',
  date: 'July 10, 2025',
  readTime: '6 min read',
  image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  tags: ['Running', 'Shoes Guide', 'Fitness']
};

const relatedPosts = [
  {
    id: '2',
    title: 'Top 5 Running Shoes for Marathon Training',
    excerpt: 'Discover the best shoes for long-distance running and marathon preparation.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'Mike Chen',
    date: 'July 5, 2025'
  },
  {
    id: '3',
    title: 'How to Break In New Running Shoes',
    excerpt: 'Learn the proper way to break in your new running shoes to prevent blisters and discomfort.',
    image: 'https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'Emily Parker',
    date: 'July 1, 2025'
  },
  {
    id: '4',
    title: 'Common Running Injuries and How to Prevent Them',
    excerpt: 'Tips and techniques to avoid common running injuries through proper shoe selection and form.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: 'Dr. James Wilson',
    date: 'June 28, 2025'
  }
];

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-blue-900">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center justify-center gap-6 text-white">
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  {post.readTime}
                </div>
                <div className="flex items-center">
                  <FiTag className="mr-2" />
                  {post.tags[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <article className="prose prose-xl max-w-none prose-headings:text-blue-900 prose-headings:font-bold prose-headings:text-3xl prose-p:text-blue-950 prose-p:text-lg prose-li:text-blue-950 prose-li:text-lg prose-ul:text-blue-950 prose-ul:text-lg prose-strong:text-blue-900 prose-strong:font-bold">
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="space-y-8" />
            </article>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-800 hover:bg-blue-100 transition duration-300 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social Share */}
            <div className="mt-12 flex items-center gap-4 py-6 border-t border-b border-blue-100">
              <span className="text-blue-900">Share this article:</span>
              <button className="p-2 hover:bg-blue-50 rounded-full transition duration-300 text-blue-800">
                <FiShare2 size={20} />
              </button>
              <button className="p-2 hover:bg-blue-50 rounded-full transition duration-300 text-blue-800">
                <FiBookmark size={20} />
              </button>
              <button className="p-2 hover:bg-blue-50 rounded-full transition duration-300 text-blue-800">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Author Bio */}
            <div className="mt-12 bg-blue-50 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{post.author}</h3>
                  <p className="text-blue-800">Running Expert & Content Writer</p>
                </div>
              </div>
              <p className="text-blue-900">
                Sarah is a certified running coach and fitness writer with over 10 years of experience.
                She specializes in helping runners of all levels achieve their goals through proper
                form, gear selection, and training techniques.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <h3 className="text-xl font-semibold mb-6 text-blue-900">Related Articles</h3>
              <div className="space-y-6">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    href={`/blog/${post.id}`} 
                    className="group block"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-blue-600 transition duration-300">
                          {post.title}
                        </h4>
                        <p className="text-sm text-blue-800 mt-1">{post.author}</p>
                        <p className="text-sm text-blue-700">{post.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6 text-blue-900">Categories</h3>
                <div className="space-y-2">
                  {['Running', 'Fashion', 'Care Guide', 'Sustainability', 'Reviews'].map((category) => (
                    <Link
                      key={category}
                      href={`/blog/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition duration-300"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
