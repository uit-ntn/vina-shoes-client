'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { wishlistService, CheckWishlistResponse } from '@/services/wishlist.service';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({ 
  productId, 
  className = '', 
  showText = false 
}: WishlistButtonProps) {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !productId) return;
      
      try {
        const response: CheckWishlistResponse = await wishlistService.checkInWishlist(productId);
        setIsInWishlist(response.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId, user]);

  // Toggle wishlist status
  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId);
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await wishlistService.addToWishlist(productId);
        toast.success('Đã thêm vào danh sách yêu thích');
      }
      
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center justify-center transition-colors ${
        isInWishlist 
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-600 hover:text-red-600'
      } ${className}`}
      aria-label={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      {isLoading ? (
        <span className="animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </span>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill={isInWishlist ? "currentColor" : "none"}
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          
          {showText && (
            <span className="ml-2 text-sm">
              {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
            </span>
          )}
        </>
      )}
    </button>
  );
}
