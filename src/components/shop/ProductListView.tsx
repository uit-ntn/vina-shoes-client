'use client';

import React from 'react';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Product } from '@/types/product';
import Image from '@/components/ui/Image';

interface ProductListItemProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart
}) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 p-4 flex flex-col sm:flex-row gap-6">
      {/* Product Image */}
      <div className="relative w-full sm:w-48 md:w-64 aspect-square sm:aspect-auto sm:h-48 md:h-64 bg-gray-100 rounded-lg overflow-hidden group">
        <Link href={`/shop/${product.slug || product.id}`} className="block h-full">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-105 transition duration-500"
          />
        </Link>
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.price < product.originalPrice && (
            <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
          
          {product.isNew && (
            <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              NEW
            </div>
          )}
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <AiFillHeart className="text-red-500 transition-colors duration-300" size={20} />
          ) : (
            <AiOutlineHeart className="text-gray-600 hover:text-red-500 transition-colors duration-300" size={20} />
          )}
        </button>
      </div>
      
      {/* Product details */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {/* Category */}
          <div className="mb-2">
            <span className="text-sm text-blue-600 font-medium capitalize">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <Link href={`/shop/${product.slug || product.id}`} className="hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </Link>
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {product.description || 'Premium quality footwear crafted with attention to detail and comfort in mind.'}
          </p>
          
          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">Available Colors:</span>
              <div className="flex gap-1">
                {product.colors.map(color => (
                  <div 
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-400 transition-all duration-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Price and actions */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.price < product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex-1 flex justify-end gap-3">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`px-4 py-2 rounded-lg border ${
                isFavorite 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors duration-300 flex items-center gap-2`}
            >
              {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
              <span className="hidden sm:inline">
                {isFavorite ? 'Saved' : 'Save'}
              </span>
            </button>
            <button
              onClick={() => onAddToCart(product.id)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
            >
              <AiOutlineShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;