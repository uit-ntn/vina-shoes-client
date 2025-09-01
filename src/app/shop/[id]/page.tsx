'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import { productService } from '@/services/product.service';
import { AiOutlineHeart, AiFillHeart, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BiShareAlt, BiZoomIn, BiCheck, BiPackage } from 'react-icons/bi';
import { FiTruck, FiShield, FiRotateCcw, FiClock, FiAlertCircle } from 'react-icons/fi';
import { BsArrowLeft, BsArrowRight, BsImages, BsQuestionCircle } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  console.log('Current params:', params);

  // Handle image zoom effect
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const _x = (e.clientX - left) / width;
    const _y = (e.clientY - top) / height;
  };

  // Save recently viewed products to localStorage
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const exists = viewed.find((item: Product) => item._id === product._id);
      
      if (!exists) {
        const newViewed = [product, ...viewed].slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
      }
      
      // Get updated recently viewed products excluding current one
      const filteredViewed = viewed.filter((item: Product) => item._id !== product._id);
      setRecentlyViewed(filteredViewed.slice(0, 3));
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) {
        console.log('No ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to fetch product with ID:', params.id);
        
        const data = await productService.getProductById(params.id as string);
        console.log('Product data received:', data);
        
        if (!data) {
          throw new Error('Product not found');
        }
        
        setProduct(data);
        
        // Fetch similar products with error handling
        try {
          console.log('Fetching similar products...');
          const similar = await productService.getSimilarProducts(params.id as string, 5);
          console.log('Similar products found:', similar.length);
          setSimilarProducts(similar);
        } catch (similarError) {
          console.error('Error fetching similar products:', similarError);
          // Fallback to empty array - we'll show a message in the UI
          setSimilarProducts([]);
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-800 font-medium animate-pulse">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-blue-800 mb-6">{error || "Không thể tìm thấy thông tin sản phẩm. Vui lòng thử lại sau."}</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-4">
      {/* Breadcrumbs */}
      <div className="mb-3">
        <nav className="flex text-xs">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800">Trang chủ</button>
          <span className="mx-1 text-blue-400">/</span>
          <button onClick={() => router.push('/shop')} className="text-blue-600 hover:text-blue-800">Cửa hàng</button>
          <span className="mx-1 text-blue-400">/</span>
          <button onClick={() => router.push(`/shop?ageGroup=${product.ageGroup}`)} className="text-blue-600 hover:text-blue-800">
            {product.ageGroup === 'men' ? 'Giày Nam' : 
             product.ageGroup === 'women' ? 'Giày Nữ' : 'Giày Trẻ Em'}
          </button>
          {product.categories.length > 0 && (
            <>
              <span className="mx-1 text-blue-400">/</span>
              <button onClick={() => router.push(`/shop?category=${product.categories[0]}`)} className="text-blue-600 hover:text-blue-800">
                {product.categories[0].charAt(0).toUpperCase() + product.categories[0].slice(1)}
              </button>
            </>
          )}
          <span className="mx-1 text-blue-400">/</span>
          <span className="text-blue-800 font-medium truncate max-w-[120px]">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
        {/* Product Images */}
        <div className="space-y-4">
          <div 
            ref={imageRef}
            className="relative w-full rounded-xl overflow-hidden bg-blue-50 shadow-sm group aspect-square cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent z-10"></div>
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 95vw, 45vw"
              className="transition-transform duration-500 group-hover:scale-110"
              style={{ objectFit: 'contain' }}
              priority
            />
            {/* Zoom icon */}
            <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md z-20 opacity-70 hover:opacity-100 transition">
              <BiZoomIn className="w-5 h-5 text-blue-600" />
            </div>
            {product.inStock && product.oldPrice && product.oldPrice > product.price && (
              <div className="absolute top-4 left-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% Giảm
              </div>
            )}
          </div>
          {/* Image navigation and thumbnails */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
              className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full text-blue-800 transition-colors"
              aria-label="Ảnh trước"
              disabled={product.images.length <= 1}
            >
              <BsArrowLeft />
            </button>
            
            {product.images.length > 1 ? (
              <div className="flex-1 px-4">
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                        activeImageIndex === index 
                          ? 'border-2 border-blue-500 shadow-sm scale-105' 
                          : 'border border-blue-100 hover:border-blue-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 20vw, 8vw"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center text-sm text-blue-600 px-4">
                <span className="flex items-center justify-center gap-1">
                  <BsImages className="opacity-70" /> Chỉ có 1 hình ảnh
                </span>
              </div>
            )}
            
            <button 
              onClick={() => setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
              className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full text-blue-800 transition-colors"
              aria-label="Ảnh sau"
              disabled={product.images.length <= 1}
            >
              <BsArrowRight />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {/* Badge Section */}
            <div className="mb-3 flex flex-wrap gap-2">
              {/* Brand Badge */}
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.brand}
              </span>
              
              {/* Stock Status */}
              {product.inStock ? (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Còn hàng
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Hết hàng
                </span>
              )}
              
              {/* Age Group Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.ageGroup === 'men' ? 'bg-blue-100 text-blue-800' : 
                product.ageGroup === 'women' ? 'bg-pink-100 text-pink-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {product.ageGroup === 'men' ? 'Nam' : 
                 product.ageGroup === 'women' ? 'Nữ' : 'Trẻ Em'}
              </span>
              
              {/* New Arrival Badge */}
              {product.isNewArrival && (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Mới về
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-blue-900 mb-1">{product.name}</h1>
                <div className="flex items-center">
                  <Link 
                    href={`/shop?brand=${product.brand}`}
                    className="text-md text-blue-600 font-medium hover:underline"
                  >
                    Thương hiệu: {product.brand}
                  </Link>
                  
                  {product.inStock && (
                    <span className="inline-flex items-center ml-3 text-green-600 text-sm">
                      <BiCheck size={16} className="mr-0.5" /> Còn hàng
                    </span>
                  )}
                  
                  <span className="ml-3 text-sm text-blue-500 flex items-center">
                    <FiClock className="mr-1" size={14} />
                    {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                {/* Style Tags */}
                {product.styleTags && product.styleTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.styleTags.map((tag, index) => (
                      <Link 
                        href={`/shop?styleTag=${tag}`}
                        key={index} 
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Categories */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.categories.map((category, index) => (
                      <Link 
                        href={`/shop?category=${category}`}
                        key={index} 
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isWishlist ? 'bg-red-50 shadow-sm' : 'hover:bg-blue-50'
                  }`}
                  aria-label={isWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  {isWishlist ? (
                    <AiFillHeart className="w-5 h-5 text-red-500" />
                  ) : (
                    <AiOutlineHeart className="w-5 h-5 text-blue-400 hover:text-red-500" />
                  )}
                </button>
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-blue-50"
                    aria-label="Chia sẻ sản phẩm"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <BiShareAlt className="w-5 h-5 text-blue-400" />
                  </button>
                  {showShareOptions && (
                    <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-md p-2 z-30 w-48">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Đã sao chép liên kết!");
                            setShowShareOptions(false);
                          }}
                          className="flex items-center p-2 hover:bg-blue-50 rounded-md text-sm"
                        >
                          <span className="flex-1 text-left">Sao chép liên kết</span>
                        </button>
                        <button 
                          onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                          }}
                          className="flex items-center p-2 hover:bg-blue-50 rounded-md text-sm"
                        >
                          <span className="flex-1 text-left">Chia sẻ lên Facebook</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-2 flex items-center bg-blue-50 p-2 rounded-lg">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < Math.floor(product.rating) ? (
                      <AiFillStar className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AiOutlineStar className="w-4 h-4 text-yellow-500" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-xs text-blue-700 ml-2 font-medium">({product.rating}/5)</span>
              <span className="ml-auto text-blue-600 text-xs">120 đánh giá</span>
            </div>

            {/* Price */}
            <div className="mt-3 p-3 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-end">
                <span className="text-2xl font-bold text-blue-700">{formatPrice(product.price)}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="ml-2 text-sm text-blue-400 line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              <p className="text-blue-600 text-xs mt-0.5">Đã bao gồm thuế VAT</p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-blue-900">Chọn kích cỡ</h3>
              <button 
                className="text-blue-600 text-sm flex items-center hover:underline"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
              >
                <BsQuestionCircle className="mr-1" size={14} />
                Bảng kích cỡ
              </button>
            </div>
            
            {showSizeGuide && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md text-sm">
                <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn chọn size</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="p-2 text-left">Kích cỡ (US)</th>
                        <th className="p-2 text-left">EU</th>
                        <th className="p-2 text-left">Chiều dài chân (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100">
                        <td className="p-2">7</td>
                        <td className="p-2">38</td>
                        <td className="p-2">24.5</td>
                      </tr>
                      <tr className="border-b border-blue-100">
                        <td className="p-2">8</td>
                        <td className="p-2">39</td>
                        <td className="p-2">25.0</td>
                      </tr>
                      <tr className="border-b border-blue-100">
                        <td className="p-2">9</td>
                        <td className="p-2">40</td>
                        <td className="p-2">25.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-6 gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-center rounded-md font-medium transition-all duration-200 aspect-square flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white shadow-sm transform scale-105'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!product.inStock}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && product.inStock && (
              <p className="text-xs text-blue-600 mt-2 flex items-center">
                <FiAlertCircle className="mr-1" size={14} />
                Vui lòng chọn kích cỡ
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm">
            <h3 className="text-md font-medium text-blue-900 mb-3">Số lượng</h3>
            <div className="flex items-center">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1 || !product.inStock}
                className={`w-10 h-10 flex items-center justify-center rounded-l-md border border-gray-300 ${
                  quantity <= 1 || !product.inStock ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <AiOutlineMinus />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-14 h-10 text-center border-t border-b border-gray-300 focus:outline-none"
                disabled={!product.inStock}
              />
              <button 
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                disabled={quantity >= 10 || !product.inStock}
                className={`w-10 h-10 flex items-center justify-center rounded-r-md border border-gray-300 ${
                  quantity >= 10 || !product.inStock ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>

          {/* Add to Cart & Buy Now Buttons */}
          <div className="mt-4">
            {product.inStock ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async () => {
                    if (!user) {
                      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
                      return;
                    }
                    
                    if (!selectedSize) {
                      toast.error('Vui lòng chọn kích cỡ');
                      return;
                    }
                    
                    if (selectedSize && product) {
                      try {
                        await addToCart(product, quantity, selectedSize);
                        toast.success('Đã thêm vào giỏ hàng!');
                      } catch (error) {
                        console.error('Error adding to cart:', error);
                        toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
                      }
                    }
                  }}
                  disabled={!product.inStock}
                  className={`py-3 flex items-center justify-center text-white font-bold rounded-md transition-all duration-300 ${
                    !selectedSize
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <AiOutlineShoppingCart className="mr-2" size={20} />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      router.push(`/login?redirectTo=${encodeURIComponent('/checkout')}`);
                      return;
                    }
                    
                    if (!selectedSize) {
                      toast.error('Vui lòng chọn kích cỡ');
                      return;
                    }
                    
                    if (selectedSize && product) {
                      try {
                        addToCart(product, quantity, selectedSize);
                        router.push('/checkout');
                      } catch (error) {
                        console.error('Error buying now:', error);
                        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
                      }
                    }
                  }}
                  disabled={!product.inStock}
                  className={`py-3 flex items-center justify-center font-bold rounded-md transition-all duration-300 ${
                    !selectedSize
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <BiPackage className="mr-2" size={20} />
                  Mua ngay
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-gray-400 text-white font-bold rounded-md cursor-not-allowed"
              >
                Hết hàng
              </button>
            )}
          </div>
          
          {/* Shipping & Payment Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
              <FiTruck className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Miễn phí vận chuyển</p>
                <p className="text-xs text-gray-500">Cho đơn hàng từ 500.000đ trở lên</p>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
              <FiRotateCcw className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Đổi trả dễ dàng</p>
                <p className="text-xs text-gray-500">Trong vòng 30 ngày sau khi nhận hàng</p>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
              <FiShield className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Bảo hành 12 tháng</p>
                <p className="text-xs text-gray-500">Đối với lỗi từ nhà sản xuất</p>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-2">Phương thức thanh toán</p>
            <div className="flex space-x-3">
              <Image src="/payment-visa.svg" alt="Visa" width={32} height={32} className="h-8" />
              <Image src="/payment-mastercard.svg" alt="MasterCard" width={32} height={32} className="h-8" />
              <Image src="/payment-paypal.svg" alt="PayPal" width={32} height={32} className="h-8" />
              <Image src="/payment-amex.svg" alt="American Express" width={32} height={32} className="h-8" />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white p-3 border border-blue-100 rounded-lg mt-3">
            <h3 className="text-md font-semibold text-blue-900 mb-2">Thông tin chi tiết</h3>
            <div className="space-y-1">
              <div className="flex py-1 border-b border-blue-50">
                <span className="w-1/3 text-blue-700 text-sm">Thương hiệu</span>
                <span className="w-2/3 font-medium text-blue-900 text-sm">{product.brand}</span>
              </div>
              <div className="flex py-1 border-b border-blue-50">
                <span className="w-1/3 text-blue-700 text-sm">Danh mục</span>
                <span className="w-2/3 font-medium text-blue-900 text-sm">
                  {product.ageGroup === 'men' ? 'Giày Nam' : 
                   product.ageGroup === 'women' ? 'Giày Nữ' : 
                   product.ageGroup === 'kids' ? 'Giày Trẻ Em' : product.categories?.join(', ')}
                </span>
              </div>
              <div className="flex py-1 border-b border-blue-50">
                <span className="w-1/3 text-blue-700 text-sm">Tình trạng</span>
                <span className={`w-2/3 font-medium text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
              {product.styleTags && product.styleTags.length > 0 && (
                <div className="flex py-1 border-b border-blue-50">
                  <span className="w-1/3 text-blue-700 text-sm">Phong cách</span>
                  <div className="w-2/3 flex flex-wrap gap-1">
                    {product.styleTags.map((tag, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.tags && product.tags.length > 0 && (
                <div className="flex py-1 border-b border-blue-50">
                  <span className="w-1/3 text-blue-700 text-sm">Tags</span>
                  <div className="w-2/3 flex flex-wrap gap-1">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.isNewArrival && (
                <div className="flex py-1 border-b border-blue-50">
                  <span className="w-1/3 text-blue-700 text-sm">Trạng thái</span>
                  <span className="w-2/3 font-medium text-green-600 text-sm">Sản phẩm mới về</span>
                </div>
              )}
              
              <div className="flex py-1">
                <span className="w-1/3 text-blue-700 text-sm">Cập nhật</span>
                <span className="w-2/3 font-medium text-blue-900 text-sm">
                  {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="border-b border-blue-100">
          <div className="flex flex-wrap -mb-px">
            <button 
              onClick={() => setActiveTab('description')} 
              className={`inline-block py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'description' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300'
              }`}
            >
              Mô tả chi tiết
            </button>
            <button 
              onClick={() => setActiveTab('specs')} 
              className={`inline-block py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'specs' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`inline-block py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'reviews' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300'
              }`}
            >
              Đánh giá (25)
            </button>
          </div>
        </div>

        <div className="py-4">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                {product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
              </p>
              {product.description && product.description.length > 100 && (
                <>
                  <h4 className="font-medium text-blue-900">Tính năng nổi bật:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                    <li className="text-blue-800">Thiết kế hiện đại, phong cách thời trang</li>
                    <li className="text-blue-800">Chất liệu cao cấp, bền bỉ theo thời gian</li>
                    <li className="text-blue-800">Đế giày êm ái, giảm chấn hiệu quả</li>
                    <li className="text-blue-800">Phù hợp với nhiều phong cách thời trang khác nhau</li>
                  </ul>

                  <h4 className="font-medium text-blue-900">Chất liệu:</h4>
                  <p className="text-sm text-blue-800">
                    Sản phẩm được làm từ chất liệu cao cấp, bền bỉ với thời gian sử dụng. Đế giày thiết kế đặc biệt 
                    giúp tăng độ bám và độ thoải mái khi di chuyển.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="sm:w-1/2 relative h-60 rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0] || '/images/placeholder-shoe.jpg'}
                        alt="Chi tiết sản phẩm"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="sm:w-1/2 space-y-3">
                      <h4 className="font-medium text-blue-900">Hướng dẫn sử dụng:</h4>
                      <ul className="list-decimal list-inside text-sm space-y-1 pl-2 text-blue-800">
                        <li>Tránh ngâm nước lâu và tiếp xúc với hóa chất mạnh</li>
                        <li>Vệ sinh giày thường xuyên bằng khăn mềm</li>
                        <li>Để giày ở nơi khô ráo, thoáng mát</li>
                        <li>Nên để giày nghỉ 1-2 ngày sau mỗi lần sử dụng</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-blue-100">
                  <tbody className="divide-y divide-blue-100 text-sm">
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Thương hiệu</td>
                      <td className="py-2 px-4">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Danh mục</td>
                      <td className="py-2 px-4">{product.categories?.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Nhóm tuổi</td>
                      <td className="py-2 px-4">
                        {product.ageGroup === 'men' ? 'Nam' : 
                         product.ageGroup === 'women' ? 'Nữ' : 'Trẻ Em'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Chất liệu đế</td>
                      <td className="py-2 px-4">Cao su tổng hợp</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Chất liệu thân</td>
                      <td className="py-2 px-4">Da tổng hợp, vải lưới thoáng khí</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Kích thước có sẵn</td>
                      <td className="py-2 px-4">{product.sizes?.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Phong cách</td>
                      <td className="py-2 px-4">{product.styleTags?.join(', ') || 'Không có thông tin'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Xuất xứ</td>
                      <td className="py-2 px-4">Việt Nam</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 bg-blue-50 font-medium text-blue-700 w-1/3">Bảo hành</td>
                      <td className="py-2 px-4">12 tháng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-800">Đánh giá từ khách hàng</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <AiFillStar key={index} className={`w-5 h-5 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-blue-600 ml-2">4.2/5 (25 đánh giá)</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Viết đánh giá
                </button>
              </div>
              
              {showReviewForm && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Đánh giá của bạn</h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Đánh giá sao</label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setReviewRating(index + 1)}
                          className="focus:outline-none"
                        >
                          {index < reviewRating ? (
                            <AiFillStar className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <AiOutlineStar className="w-6 h-6 text-yellow-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Nhận xét của bạn</label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        toast.success("Cảm ơn bạn đã đánh giá!");
                        setShowReviewForm(false);
                        setReviewComment("");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                </div>
              )}
              
              {/* Sample Reviews */}
              <div className="divide-y divide-blue-100">
                <div className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Nguyễn Văn A</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                          <AiFillStar key={index} className={`w-4 h-4 ${index < 5 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-blue-600">01/05/2023</span>
                  </div>
                  <p className="mt-2 text-sm text-blue-800">
                    Sản phẩm rất đẹp và chất lượng. Đóng gói cẩn thận, giao hàng nhanh. Giày đi rất êm chân,
                    thoải mái cả ngày không bị đau. Màu sắc đúng như hình, rất hài lòng!
                  </p>
                </div>
                
                <div className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Trần Thị B</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                          <AiFillStar key={index} className={`w-4 h-4 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-blue-600">15/04/2023</span>
                  </div>
                  <p className="mt-2 text-sm text-blue-800">
                    Giày đẹp như hình, đi êm chân. Tôi đã mua size 39 nhưng hơi rộng một chút. 
                    Giao hàng nhanh và đóng gói cẩn thận. Sẽ ủng hộ shop nhiều lần nữa.
                  </p>
                </div>
                
                <div className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Lê Văn C</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                          <AiFillStar key={index} className={`w-4 h-4 ${index < 3 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-blue-600">28/03/2023</span>
                  </div>
                  <p className="mt-2 text-sm text-blue-800">
                    Giày đẹp nhưng kích thước hơi khác so với mô tả. 
                    Tôi thường mang size 40 nhưng phải đổi xuống 39 mới vừa. 
                    Chất lượng ổn với tầm giá này.
                  </p>
                </div>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow">
                  <button className="py-2 px-4 rounded-l-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50">
                    Trước
                  </button>
                  <button className="py-2 px-4 border-t border-b border-blue-300 bg-blue-50 text-sm font-medium text-blue-600">
                    1
                  </button>
                  <button className="py-2 px-4 border-t border-b border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50">
                    2
                  </button>
                  <button className="py-2 px-4 border-t border-b border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50">
                    3
                  </button>
                  <button className="py-2 px-4 rounded-r-md border border-blue-300 bg-white text-sm font-medium text-blue-500 hover:bg-blue-50">
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Sản phẩm đã xem gần đây</h2>
        {recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {recentlyViewed.map((viewedProduct) => (
              <div 
                key={viewedProduct._id} 
                onClick={() => router.push(`/shop/${viewedProduct._id}`)}
                className="bg-white p-2 rounded-md shadow-sm border border-blue-50 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="relative h-28 rounded-md overflow-hidden bg-blue-50 mb-2">
                  <Image
                    src={viewedProduct.images[0]}
                    alt={viewedProduct.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 18vw"
                    className="object-contain"
                  />
                </div>
                <h3 className="text-blue-800 text-xs font-medium line-clamp-1 mb-1">{viewedProduct.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 text-xs font-semibold">{formatPrice(viewedProduct.price)}</span>
                  {viewedProduct.oldPrice && viewedProduct.oldPrice > viewedProduct.price && (
                    <span className="text-blue-400 text-xs line-through">{formatPrice(viewedProduct.oldPrice)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="bg-blue-50 p-3 rounded-md text-center text-blue-600">Chưa có sản phẩm nào được xem gần đây</p>
        )}
      </div>

      {/* Similar products section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <div 
                key={similarProduct._id} 
                onClick={() => router.push(`/shop/${similarProduct._id}`)}
                className="bg-white p-2 rounded-md shadow-sm border border-blue-50 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="relative h-28 rounded-md overflow-hidden bg-blue-50 mb-2">
                  <Image
                    src={similarProduct.images[0]}
                    alt={similarProduct.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 18vw"
                    className="object-contain"
                  />
                  {similarProduct.oldPrice && similarProduct.oldPrice > similarProduct.price && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                      {Math.round(((similarProduct.oldPrice - similarProduct.price) / similarProduct.oldPrice) * 100)}% Giảm
                    </div>
                  )}
                </div>
                <h3 className="text-blue-800 text-xs font-medium line-clamp-1 mb-1">{similarProduct.name}</h3>
                {similarProduct.styleTags && similarProduct.styleTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {similarProduct.styleTags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 text-[10px] px-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 text-xs font-semibold">{formatPrice(similarProduct.price)}</span>
                  {similarProduct.oldPrice && similarProduct.oldPrice > similarProduct.price && (
                    <span className="text-blue-400 text-xs line-through">{formatPrice(similarProduct.oldPrice)}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 bg-blue-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-blue-800 font-medium mb-1">Không tìm thấy sản phẩm tương tự</p>
              <p className="text-blue-600 text-sm">Đang cập nhật thêm sản phẩm tương tự. Vui lòng quay lại sau!</p>
              <button 
                onClick={() => router.push('/shop')} 
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
