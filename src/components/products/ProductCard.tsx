import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist = false }: ProductCardProps) => {
  const fallbackImageUrl = '/images/product-placeholder.jpg';

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        {!product.inStock && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Out of Stock
          </span>
        )}
        {product.rating >= 4.5 && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Top Rated
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist?.(product)}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors duration-200"
      >
        {isInWishlist ? (
          <AiFillHeart className="w-5 h-5 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
        )}
      </button>

      {/* Product Image */}
      <Link href={`/shop/${product._id}`} className="block relative aspect-square">
        <Image
          src={product.images[0] || fallbackImageUrl}
          alt={product.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/shop/${product._id}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        </Link>


        {/* Size and Rating */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Sizes: {product.sizes?.join(', ')}</span>
          <span>★ {product.rating}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <AiOutlineShoppingCart className="w-5 h-5" />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
