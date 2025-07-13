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

interface Award {
  title: string;
  year: string;
  icon?: React.ReactNode;
}

interface Process {
  step: number;
  title: string;
  description: string;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Minh Nguyen',
      role: 'Founder & Creative Director',
      bio: 'With a background in fashion design and a family legacy in shoemaking, Minh leads our creative vision.',
    },
    {
      name: 'Linh Tran',
      role: 'Head of Production',
      bio: 'A master craftsperson with 15 years of experience, Linh ensures the highest standards in our workshop.',
    },
    {
      name: 'Hai Pham',
      role: 'Sustainability Officer',
      bio: 'With a passion for environmental conservation, Hai drives our sustainability initiatives.',
    },
  ];

  const awards: Award[] = [
    { title: "Vietnam Craft Excellence Award", year: "2018" },
    { title: "Sustainable Manufacturing Certification", year: "2020" },
    { title: "Fair Trade Partner", year: "2021" },
    { title: "Design Innovation Award", year: "2022" },
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
        <h1 className="text-4xl font-bold mb-4">About Vina Shoes</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Proudly Vietnamese, passionately global. Crafting quality footwear since 2015.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="flex flex-col md:flex-row gap-10 items-center mb-20">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2015 in Ho Chi Minh City, Vina Shoes started as a small workshop with a team of 
            five skilled craftspeople and one shared vision: to create beautiful, comfortable footwear 
            that represents the best of Vietnamese craftsmanship while meeting international standards of quality.
          </p>
          <p className="text-gray-700 mb-4">
            Our founder, Minh Nguyen, comes from a family with three generations of shoemaking tradition. 
            After studying fashion design in Paris, he returned to Vietnam with a mission to blend traditional 
            Vietnamese craftsmanship with contemporary design.
          </p>
          <p className="text-gray-700">
            Today, Vina Shoes has grown to a team of over 100 artisans, designers, and professionals, 
            but our commitment to quality and craftsmanship remains unchanged. Each pair of Vina Shoes 
            tells a story of heritage, innovation, and sustainable practices.
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
        <h2 className="text-3xl font-semibold mb-10 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiCheckCircle className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Quality</h3>
            <p className="text-gray-600">
              We use premium materials and rigorous quality control to ensure every pair meets our high standards.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiAward className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Craftsmanship</h3>
            <p className="text-gray-600">
              Our skilled artisans blend traditional techniques with modern innovation for superior footwear.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiHeart className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
            <p className="text-gray-600">
              We&apos;re committed to ethical production, reducing waste, and minimizing our environmental impact.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FiUsers className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-gray-600">
              We support local communities through fair employment practices and social responsibility programs.
            </p>
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processes.map((process) => (
            <div key={process.step} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">{process.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{process.title}</h3>
              <p className="text-gray-600">{process.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200">
                {member.image && (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Awards */}
      <div className="bg-blue-50 rounded-2xl p-8 md:p-16 mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">Certifications & Recognition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-medium">{award.title} {award.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Experience Vina Shoes Quality</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
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
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
