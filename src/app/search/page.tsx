'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';
import { AiOutlineSearch } from 'react-icons/ai';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be a call to your API endpoint
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - replace with actual API call in production
        const mockProducts: Product[] = [
          {
            _id: '1',
            name: 'Giày thể thao Nike Air Force 1',
            slug: 'giay-the-thao-nike-air-force-1',
            brand: 'Nike',
            description: 'Giày thể thao Nike Air Force 1 chính hãng',
            price: 2500000,
            oldPrice: 3000000,
            images: ['/images/placeholder-shoe.jpg'],
            inStock: true,
            rating: 4.5,
            sizes: [39, 40, 41, 42, 43],
            categoryId: 'men',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Giày Adidas Ultraboost',
            slug: 'giay-adidas-ultraboost',
            brand: 'Adidas',
            description: 'Giày thể thao Adidas Ultraboost chính hãng',
            price: 3200000,
            oldPrice: 3800000,
            images: ['/images/placeholder-shoe.jpg'],
            inStock: true,
            rating: 4.7,
            sizes: [38, 39, 40, 41, 42],
            categoryId: 'men',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Giày sandal nữ',
            slug: 'giay-sandal-nu',
            brand: 'Vina',
            description: 'Giày sandal nữ thời trang',
            price: 850000,
            images: ['/images/placeholder-shoe.jpg'],
            inStock: true,
            rating: 4.3,
            sizes: [35, 36, 37, 38, 39],
            categoryId: 'women',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ].filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.categoryId.toLowerCase().includes(query.toLowerCase())
        );

        setProducts(mockProducts);
      } catch (err) {
        setError('Đã có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kết quả tìm kiếm</h1>
        <div className="flex items-center text-gray-500">
          <AiOutlineSearch className="mr-2" />
          {query ? (
            <p>
              Kết quả tìm kiếm cho <span className="font-semibold text-blue-700">"{query}"</span>
            </p>
          ) : (
            <p>Vui lòng nhập từ khóa để tìm kiếm</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <AiOutlineSearch className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">Không tìm thấy sản phẩm nào</h3>
          <p className="text-gray-500 mb-8">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}".
          </p>
          <div className="space-y-4">
            <p className="font-medium">Bạn có thể thử:</p>
            <ul className="text-sm space-y-2">
              <li>• Kiểm tra lỗi chính tả</li>
              <li>• Sử dụng các từ khóa khác</li>
              <li>• Sử dụng từ khóa ngắn hơn</li>
            </ul>
          </div>
          <Link 
            href="/shop" 
            className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-sm text-gray-500">Tìm thấy {products.length} sản phẩm</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
