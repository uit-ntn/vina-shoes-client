'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';
import { AiOutlineSearch } from 'react-icons/ai';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'relevance' | 'price_asc' | 'price_desc' | 'newest'>('relevance');
  const { searchProducts, loading: productsLoading, error: productsError } = useProducts();
  const [error, setError] = useState<string | null>(productsError);

  // Function to sort search results
  const sortSearchResults = (results: Product[]) => {
    let sortedResults = [...results];
    
    switch (sortOrder) {
      case 'price_asc':
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'relevance':
      default:
        // Results are already sorted by relevance from the search function
        break;
    }
    
    return sortedResults;
  };

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    if (!productsLoading) {
      try {
        setLoading(true);
        // Use the searchProducts function from context
        const results = searchProducts(query);
        // Apply sorting to the search results
        const sortedResults = sortSearchResults(results);
        setSearchResults(sortedResults);
        setError(null);
      } catch (err) {
        setError('Đã có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [query, productsLoading, searchProducts, sortOrder]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">Kết quả tìm kiếm</h1>
        <div className="flex items-center text-blue-600">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <AiOutlineSearch className="text-blue-700" size={20} />
          </div>
          {query ? (
            <p className="text-lg">
              Kết quả tìm kiếm cho <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">"{query}"</span>
            </p>
          ) : (
            <p className="text-lg">Vui lòng nhập từ khóa để tìm kiếm</p>
          )}
        </div>
      </div>

      {productsLoading || loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium">Đang tìm kiếm sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="mb-6 bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
              <AiOutlineSearch className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Không tìm thấy sản phẩm nào</h3>
            <p className="text-blue-600 mb-8 text-lg">
              Không tìm thấy sản phẩm nào phù hợp với từ khóa <span className="font-bold bg-blue-50 px-2 py-1 rounded-md">"{query}"</span>
            </p>
            <div className="bg-blue-50 rounded-lg p-6 inline-block">
              <p className="font-medium text-blue-800 text-lg mb-3">Bạn có thể thử:</p>
              <ul className="text-base space-y-3 text-blue-700 text-left">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Kiểm tra lỗi chính tả
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sử dụng các từ khóa khác
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sử dụng từ khóa ngắn hơn
                </li>
              </ul>
            </div>
          </div>
          
          {/* Popular Search Terms */}
          <div className="mb-8">
            <p className="font-medium text-blue-800 text-lg mb-4">Tìm kiếm phổ biến:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Nike", "Adidas", "Giày thể thao", "Sandals", "Giày nam", "Giày nữ", "Dép", "Sneakers"].map(term => (
                <Link 
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 rounded-md text-sm transition-colors shadow-sm border border-blue-100 hover:border-blue-300"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
          
          <Link 
            href="/shop" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Xem tất cả sản phẩm
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm p-4">
            <p className="text-blue-800 font-medium">
              Tìm thấy <span className="font-bold text-blue-900">{searchResults.length}</span> sản phẩm
            </p>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2 text-sm">Sắp xếp theo:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'relevance' | 'price_asc' | 'price_desc' | 'newest')}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Liên quan nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination - Add if needed in the future */}
          {searchResults.length > 12 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700">
                  Trước
                </button>
                <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700">2</button>
                <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700">3</button>
                <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700">
                  Sau
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
