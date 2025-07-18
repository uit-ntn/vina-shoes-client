'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { productService } from '@/services/product.service';
import { AiOutlineHeart, AiFillHeart, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BiShareAlt } from 'react-icons/bi';
import { FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
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
  const { addToCart } = useCart();
  const { user } = useAuth();

  console.log('Current params:', params);

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
        
        // Fetch similar products
        const similar = await productService.getSimilarProducts(params.id as string, 4);
        console.log('Similar products:', similar);
        setSimilarProducts(similar);
        
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-lg shadow-sm">
        {/* Product Images */}
        <div className="space-y-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-blue-50 shadow-sm group" style={{ height: '350px' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent z-10"></div>
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 95vw, 45vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              style={{ maxHeight: '350px', objectFit: 'contain' }}
              priority
            />
            {product.inStock && product.oldPrice && product.oldPrice > product.price && (
              <div className="absolute top-4 left-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% Giảm
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-16 rounded-md overflow-hidden transition-all duration-200 ${
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
                    style={{ maxHeight: '100%' }}
                  />
                </button>
              ))}
            </div>
          )}
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
                <p className="text-md text-blue-600 font-medium">Thương hiệu: {product.brand}</p>
                
                {/* Style Tags */}
                {product.styleTags && product.styleTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.styleTags.map((tag, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Categories */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.categories.map((category, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`p-1.5 rounded-full transition-all duration-300 ${
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
                <button 
                  className="p-1.5 rounded-full hover:bg-blue-50"
                  aria-label="Chia sẻ sản phẩm"
                >
                  <BiShareAlt className="w-5 h-5 text-blue-400" />
                </button>
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
          <div className="bg-white p-3 border border-blue-100 rounded-lg">
            <h3 className="text-md font-medium text-blue-900 mb-2">Chọn kích cỡ</h3>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-center rounded-md font-medium transition-all duration-200 ${
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
              <p className="text-xs text-blue-600 mt-1">Vui lòng chọn kích cỡ</p>
            )}
          </div>

          {/* Quantity */}
          <div className="bg-white p-3 border border-blue-100 rounded-lg">
            <h3 className="text-md font-medium text-blue-900 mb-2">Số lượng</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                aria-label="Giảm số lượng"
                disabled={!product.inStock}
              >
                <AiOutlineMinus size={16} />
              </button>
              <span className="text-md font-medium w-14 text-center text-blue-900 bg-blue-50 py-1.5 px-3 rounded-md">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                aria-label="Tăng số lượng"
                disabled={!product.inStock}
              >
                <AiOutlinePlus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={async () => {
              console.log('Add to cart clicked');
              console.log('User:', user);
              console.log('Selected size:', selectedSize);
              
              if (!user) {
                console.log('Redirecting to login');
                router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
                return;
              }
              
              if (!selectedSize) {
                console.log('No size selected');
                toast.error('Vui lòng chọn kích cỡ');
                return;
              }
              
              if (selectedSize && product) {
                try {
                  console.log('Adding to cart:', { product, quantity, size: selectedSize });
                  await addToCart(product, quantity, selectedSize);
                  toast.success('Đã thêm vào giỏ hàng!');
                  // Don't redirect to cart immediately to give user feedback
                  // router.push('/cart');
                } catch (error) {
                  console.error('Error adding to cart:', error);
                  toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
                }
              }
            }}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-md text-base font-medium transition-all duration-300 ${
              !product.inStock
                ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                : !selectedSize 
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            <AiOutlineShoppingCart size={20} />
            <span className="ml-1">{product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}</span>
          </button>
          
          {/* Product guarantees */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="flex flex-col items-center bg-blue-50 p-2 rounded-md text-center">
              <FiTruck className="text-blue-600 w-4 h-4 mb-1" />
              <span className="text-xs text-blue-800 font-medium">Giao hàng miễn phí</span>
            </div>
            <div className="flex flex-col items-center bg-blue-50 p-2 rounded-md text-center">
              <FiShield className="text-blue-600 w-4 h-4 mb-1" />
              <span className="text-xs text-blue-800 font-medium">Bảo hành 12 tháng</span>
            </div>
            <div className="flex flex-col items-center bg-blue-50 p-2 rounded-md text-center">
              <FiRotateCcw className="text-blue-600 w-4 h-4 mb-1" />
              <span className="text-xs text-blue-800 font-medium">Đổi trả trong 30 ngày</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-3 border border-blue-100 rounded-lg mt-4">
            <h3 className="text-md font-semibold text-blue-900 mb-2 pb-1 border-b border-blue-100">Mô tả sản phẩm</h3>
            <div className="text-blue-800 leading-relaxed text-sm">
              {product.description}
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
            <div className="col-span-full text-center py-4 bg-blue-50 rounded-md">
              <p className="text-blue-800 text-sm">Không tìm thấy sản phẩm tương tự.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
