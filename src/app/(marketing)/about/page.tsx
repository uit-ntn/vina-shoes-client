import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiAward, FiUsers, FiHeart } from 'react-icons/fi';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface Process {
  step: number;
  title: string;
  description: string;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Nguyễn Thanh Nhân',
      role: 'Web Developer',
      bio: 'A skilled web developer from UIT with expertise in React, Next.js, and TypeScript. Passionate about creating intuitive user experiences and implementing modern web architectures. Proficient in building responsive, performant e-commerce solutions.',
    },
    {
      name: 'Hà Khả Nguyên',
      role: 'Data Engineer',
      bio: 'An experienced data engineer from UIT specializing in data pipeline architecture, analytics, and database optimization. Expert in building scalable data solutions and implementing data-driven insights for e-commerce platforms.',
    },
  ];

  const processes: Process[] = [
    {
      step: 1,
      title: "Design",
      description: "Our designers blend global trends with Vietnamese aesthetics to create unique, stylish footwear."
    },
    {
      step: 2,
      title: "Crafting",
      description: "Skilled artisans handcraft each pair using premium materials and traditional techniques."
    },
    {
      step: 3,
      title: "Quality Control",
      description: "Each pair undergoes rigorous testing to ensure comfort, durability, and perfect finish."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">About Vina Shoes</h1>
        <p className="text-xl text-gray-800 max-w-3xl mx-auto">
          A modern e-commerce platform created by UIT students, combining web technology and AI innovation.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="flex flex-col md:flex-row gap-10 items-center mb-20">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6 text-blue-900">Our Story</h2>
          <p className="text-gray-800 mb-4">
            Founded by two passionate students from the University of Information Technology (UIT), Vina Shoes 
            began as a final year project with a vision to revolutionize the online footwear shopping experience 
            in Vietnam through modern web technologies and artificial intelligence.
          </p>
          <p className="text-gray-800 mb-4">
            Our team consists of Nguyễn Thanh Nhân, a web developer specializing in modern frontend technologies, 
            and Hà Khả Nguyên, a data engineer focused on data architecture and analytics. Together, we combine our 
            expertise in web development and data engineering to create a robust e-commerce platform.
          </p>
          <p className="text-gray-800">
            As UIT students, we believe in the power of technology to transform traditional industries. 
            Vina Shoes represents our commitment to innovation, combining cutting-edge web technologies 
            with data-driven insights to deliver a superior online shopping experience.
          </p>
        </div>
        <div className="md:w-1/2 relative h-80 md:h-[500px] w-full">
          <div className="absolute w-full h-full bg-blue-100 rounded-lg transform rotate-3" />
          <div className="absolute w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg transform -rotate-3 overflow-hidden">
            <div className="w-full h-full opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full max-w-sm h-auto bg-white p-4 shadow-xl rounded-lg">
              <Image
                src="/logo.png"
                alt="Vina Shoes Founding Team"
                width={400}
                height={300}
                className="w-full h-auto rounded"
                priority
              />
              <div className="bg-white p-3 -mt-10 ml-4 absolute rounded shadow-lg">
                <p className="font-bold">Est. 2015</p>
                <p className="text-sm text-gray-600">Ho Chi Minh City</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-16 mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center text-blue-900">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiCheckCircle className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Quality</h3>
            <p className="text-gray-800">
              We use premium materials and rigorous quality control to ensure every pair meets our high standards.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiAward className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Craftsmanship</h3>
            <p className="text-gray-800">
              Our skilled artisans blend traditional techniques with modern innovation for superior footwear.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiHeart className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
            <p className="text-gray-800">
              We&apos;re committed to ethical production, reducing waste, and minimizing our environmental impact.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiUsers className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-gray-800">
              We support local communities through fair employment practices and social responsibility programs.
            </p>
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center text-blue-900">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processes.map((process) => (
            <div key={process.step} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-blue-600">{process.step}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{process.title}</h3>
              <p className="text-gray-700">{process.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center text-blue-900">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                ) : (
                  <FiUsers className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium text-center mb-3">{member.role}</p>
              <p className="text-gray-800 text-center">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-6 text-blue-900">Experience Vina Shoes Quality</h2>
        <p className="text-gray-800 max-w-2xl mx-auto mb-8">
          We invite you to explore our collections and experience the perfect blend of 
          Vietnamese craftsmanship, contemporary design, and sustainable practices.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/shop" 
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Shop Our Collections
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-white border border-blue-200 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
