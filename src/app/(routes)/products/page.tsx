import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

const products = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    price: 150,
    image: '/images/products/nike-air-max-270.jpg',
  },
  {
    id: 2, 
    name: 'Adidas Ultra Boost',
    price: 180,
    image: '/images/products/adidas-ultra-boost.jpg',
  },
  // Add more products...
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
