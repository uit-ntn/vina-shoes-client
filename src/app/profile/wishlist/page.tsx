'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Product } from '@/types/product';

// Interface for mock data that has a different structure than our Product type
interface MockProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  images: string[];
  rating: number;
  reviewCount: number;
  sizes?: number[];
}

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<MockProduct[]>([]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // In a real app, this would call an API
        // For now, we'll use mock data
        const mockWishlistData = [
          {
            id: "1",
            name: "Giày Nike Air Max 97",
            price: 2990000,
            discount: 10,
            images: ['/images/placeholder-shoe.jpg'],
            rating: 4.5,
            reviewCount: 120
          },
          {
            id: "2",
            name: "Giày Adidas Ultraboost 21",
            price: 3200000,
            discount: 0,
            images: ['/images/placeholder-shoe.jpg'],
            rating: 5,
            reviewCount: 85
          },
          {
            id: "3",
            name: "Giày Vans Old Skool",
            price: 1750000,
            discount: 15,
            images: ['/images/placeholder-shoe.jpg'],
            rating: 4,
            reviewCount: 210
          }
        ];

        setWishlist(mockWishlistData);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // In a real app, this would call an API
      setWishlist(wishlist.filter(item => item.id !== productId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };

  // Handle adding item to cart
  const handleAddToCart = async (productId: string) => {
    try {
      // Find the product in the wishlist
      const mockProduct = wishlist.find(p => p.id === productId);
      if (mockProduct) {
        // Convert mock product to real Product format
        const product = {
          _id: mockProduct.id,
          name: mockProduct.name,
          slug: mockProduct.name.toLowerCase().replace(/ /g, '-'),
          description: '',
          price: mockProduct.price,
          oldPrice: mockProduct.discount > 0 ? mockProduct.price : undefined,
          images: mockProduct.images,
          category: [],
          brand: '',
          sizes: mockProduct.sizes || [39],
          inStock: true,
          rating: mockProduct.rating,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ageGroup: 'men' as 'men' | 'women' | 'kids',
          categories: [],
          isNewArrival: false,
          styleTags: [],
          tags: []
        };
        
        // Using the first size available or default to 39
        const size = mockProduct.sizes && mockProduct.sizes.length > 0 ? mockProduct.sizes[0] : 39;
        await addToCart(product, 1, size);
        toast.success('Đã thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Danh sách yêu thích</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h4 className="mt-3 text-lg font-medium text-gray-800">Chưa có sản phẩm yêu thích</h4>
          <p className="mt-1 text-gray-600">Khám phá và thêm sản phẩm vào danh sách yêu thích.</p>
          <Link href="/shop">
            <div className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Khám phá sản phẩm
            </div>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden group">
              {/* Product image */}
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={product.images?.[0] || '/images/placeholder-shoe.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Quick actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 bg-white text-blue-600 text-sm font-medium py-1 rounded-l hover:bg-blue-50 transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="ml-1 bg-white text-red-600 px-3 py-1 rounded-r hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Product details */}
              <div className="p-4">
                <h4 className="font-medium text-gray-800 line-clamp-2 h-12">{product.name}</h4>
                
                <div className="mt-2 flex items-center">
                  {product.discount > 0 ? (
                    <>
                      <span className="font-bold text-blue-600">
                        {formatPrice(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                  )}
                </div>
                
                {/* Rating */}
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${
                        i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                      }`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-600">
                    ({product.reviewCount || 0} đánh giá)
                  </span>
                </div>
                
                {/* View product link */}
                <Link href={`/shop/${product.id}`}>
                  <div className="mt-3 block text-center px-4 py-2 bg-gray-100 text-blue-600 text-sm font-medium rounded hover:bg-gray-200 transition-colors">
                    Xem chi tiết
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
