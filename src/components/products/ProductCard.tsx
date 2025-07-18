import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist = false }: ProductCardProps) => {
  const fallbackImageUrl = '/images/product-placeholder.jpg';

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;

    if (!user) {
      // Save current URL to redirect back after login
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    if (!selectedSize) {
      setShowSizeSelector(true);
      return;
    }

    try {
      await addToCart(product, 1, selectedSize);
      setShowSizeSelector(false);
      setSelectedSize(null);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  const showDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = showDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transition duration-300 hover:translate-y-[-5px] h-[420px] flex flex-col"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1">
        {!product.inStock && (
          <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
            Out of Stock
          </span>
        )}
        {showDiscount && (
          <span className="bg-orange-500 text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
            {discountPercentage}% OFF
          </span>
        )}
        {product.rating >= 4.5 && (
          <span className="bg-green-500 text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
            Top Rated
          </span>
        )}
      </div>

      {/* Size Selector Popup */}
      {showSizeSelector && (
        <div className="absolute inset-0 bg-white/98 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 animate-fadeIn">
          <h4 className="text-xl font-semibold mb-4 text-blue-900">Select Size</h4>
          <div className="grid grid-cols-3 gap-3 mb-5 w-full">
            {product.sizes?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 rounded-md font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setShowSizeSelector(false)}
            className="mt-3 text-blue-700 hover:text-blue-900 font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist?.(product)}
        aria-label={isInWishlist ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isInWishlist 
            ? 'bg-red-50 shadow-md' 
            : 'bg-white/70 backdrop-blur-sm hover:bg-white'
        }`}
      >
        {isInWishlist ? (
          <AiFillHeart className="w-5 h-5 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
        )}
      </button>

      {/* Product Image */}
      <Link href={`/shop/${product._id}`} className="block relative h-48 overflow-hidden bg-blue-50">
        <Image
          src={!imageError ? product.images[0] || '/images/placeholder-shoe.jpg' : '/images/placeholder-shoe.jpg'}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
          onError={() => setImageError(true)}
        />
        
        {product.images.length > 1 && isHovering && !imageError && (
          <Image
            src={product.images[1] || '/images/placeholder-shoe.jpg'}
            alt={`${product.name} - alternate view`}
            fill
            className="object-cover absolute inset-0 opacity-0 animate-fadeIn hover:opacity-100"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Quick View Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <span className="bg-white px-4 py-2 rounded-full text-blue-900 font-medium transform transition-transform duration-300 hover:scale-105">
            Quick View
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/shop/${product.brand}`} className="text-xs uppercase tracking-wider text-blue-700 hover:underline">
            {product.brand}
          </Link>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            product.ageGroup === 'men' ? 'bg-blue-100 text-blue-700' : 
            product.ageGroup === 'women' ? 'bg-pink-100 text-pink-700' : 
            'bg-yellow-100 text-yellow-700'
          }`}>
            {product.ageGroup === 'men' ? 'Nam' : 
             product.ageGroup === 'women' ? 'Nữ' : 'Trẻ em'}
          </span>
        </div>
        
        <Link href={`/shop/${product._id}`} className="block group">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200 overflow-hidden text-ellipsis line-clamp-2 h-[56px]">
            {product.name}
          </h3>
        </Link>

        {/* Style Tags Section */}
        {product.styleTags && product.styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.styleTags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* New Arrival Badge */}
        {product.isNewArrival && (
          <div className="mt-2">
            <span className="inline-block text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              New Arrival
            </span>
          </div>
        )}
        
        {/* Price Section */}
        <div className="flex items-end mt-3 mb-3">
          <span className="text-xl font-bold text-blue-900">{formatPrice(product.price)}</span>
          
          {showDiscount && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {formatPrice(product.oldPrice || 0)}
            </span>
          )}
          
          <div className="ml-auto flex items-center">
            <span className="flex items-center text-amber-500">
              {'★'.repeat(Math.floor(product.rating))}
              <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
            </span>
          </div>
        </div>
        
        {/* Size Chips */}
        <div className="flex flex-wrap gap-1 mb-3 flex-grow">
          {product.sizes?.slice(0, 5).map((size) => (
            <span key={size} className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded-md">
              {size}
            </span>
          ))}
          {product.sizes && product.sizes.length > 5 && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded-md">
              +{product.sizes.length - 5}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
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
