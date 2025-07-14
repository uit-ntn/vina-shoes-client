'use client';

import React from 'react';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Product } from '@/types/product';
import Image from '@/components/ui/Image';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFavorite, 
  onToggleFavorite,
  onAddToCart
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 shadow-sm transition-colors">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-50">
          <Link href={`/shop/${product.slug || product.id}`}>
            <div className="relative w-full h-full">
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <AiFillHeart className="text-red-500" size={20} />
          ) : (
            <AiOutlineHeart className="text-gray-600" size={20} />
          )}
        </button>
                
        {/* Add to cart button */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-800/90 to-blue-700/75 backdrop-blur-sm py-2 px-3 border-t border-blue-700/30">
          <button 
            className="w-full bg-white hover:bg-blue-50 text-blue-700 py-1.5 px-3 rounded-md font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product.id);
            }}
          >
            <AiOutlineShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium capitalize">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          <Link href={`/shop/${product.slug || product.id}`} className="hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </Link>
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.price < product.originalPrice && product.originalPrice > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Color options */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex gap-1">
            {product.colors.map(color => (
              <div 
                key={color}
                className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-400 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;