'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { productService } from '@/services/product.service';
import { AiOutlineHeart, AiFillHeart, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BiShareAlt } from 'react-icons/bi';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => router.push('/shop')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-500">{product.brand}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {isWishlist ? (
                    <AiFillHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <AiOutlineHeart className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <BiShareAlt className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < Math.floor(product.rating) ? (
                      <AiFillStar className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <AiOutlineStar className="w-5 h-5 text-yellow-400" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating} / 5)</span>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-bold text-blue-600">${product.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Select Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-center rounded-md ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <AiOutlineMinus size={20} />
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <AiOutlinePlus size={20} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            disabled={!selectedSize || !product.inStock}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-8 rounded-md ${
              !selectedSize || !product.inStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <AiOutlineShoppingCart size={22} />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.categoryId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium">
                {new Date(product.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
