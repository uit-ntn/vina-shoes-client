import React from 'react';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from 'react-icons/ai';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // In a real app, fetch product data based on params.id
  const product = {
    id: 1,
    name: 'Nike Air Max 270',
    price: 150,
    description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.',
    image: '/images/products/nike-air-max-270.jpg',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <button className="p-2 border rounded">
              <AiOutlineMinus />
            </button>
            <span className="text-xl">1</span>
            <button className="p-2 border rounded">
              <AiOutlinePlus />
            </button>
          </div>
          
          <button className="flex items-center justify-center w-full bg-black text-white py-3 px-6 rounded-lg hover:opacity-90">
            <AiOutlineShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
