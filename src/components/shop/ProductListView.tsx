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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-blue-300 p-3 flex flex-col sm:flex-row gap-4 max-h-48 transition-all">
      {/* Product Image */}
      <div className="relative w-full sm:w-36 md:w-48 sm:h-36 md:h-40 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
        <Link href={`/shop/${product.slug || product.id}`} className="block h-full">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover"
          />
        </Link>
        

        {/* Favorite button */}
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow duration-300"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <AiFillHeart className="text-red-500 transition-colors duration-300" size={16} />
          ) : (
            <AiOutlineHeart className="text-gray-600 hover:text-red-500 transition-colors duration-300" size={16} />
          )}
        </button>
      </div>
      
      {/* Product details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1">
          {/* Category */}
          <div className="mb-1">
            <span className="text-xs text-blue-600 font-medium capitalize">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            <Link href={`/shop/${product.slug || product.id}`} className="hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </Link>
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
          
          {/* Description - shortened */}
          <p className="text-xs text-gray-600 mb-1 line-clamp-1">
            {product.description || 'Premium quality footwear crafted with attention to detail.'}
          </p>
          
          {/* Color options - compact */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-700">Colors:</span>
              <div className="flex gap-0.5">
                {product.colors.map(color => (
                  <div 
                    key={color}
                    className="w-4 h-4 rounded-full border border-white ring-1 ring-gray-200 hover:ring-blue-400 transition-all duration-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Price and actions */}
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-gray-100">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex-1 flex justify-end gap-2">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                isFavorite 
                  ? 'bg-red-50 text-red-600 border-red-200' 
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {isFavorite ? <AiFillHeart size={14} /> : <AiOutlineHeart size={14} />}
            </button>
            <button
              onClick={() => onAddToCart(product.id)}
              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-md shadow-sm hover:shadow flex items-center gap-1 font-medium transition-shadow"
            >
              <AiOutlineShoppingCart size={14} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;