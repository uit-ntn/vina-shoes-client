import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import Image from "@/components/ui/Image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hero Banner"
            fill
            priority
            className="object-cover brightness-75"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Step Into{" "}
              <span className="text-yellow-400">Excellence</span>
            </h1>
            <p className="text-xl mb-8">
              Elevate your style with our premium collection of footwear for every
              occasion
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300"
              >
                Shop Now
              </Link>
              <Link
                href="/shop/new-arrivals"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-300"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/shop/men"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Men's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  Men
                </h3>
              </div>
            </Link>

            <Link
              href="/shop/women"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Women's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  Women
                </h3>
              </div>
            </Link>

            <Link
              href="/shop/sale"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sale"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  Sale
                </h3>
              </div>
            </Link>

            <Link
              href="/blog"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Blog"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  Blog
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Collections</h2>
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View all{" "}
              <AiOutlineArrowRight />
            </Link>
          </div>

          {/* Collection 1: Running Shoes */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-blue-600 font-semibold mb-2 block">
                    Performance
                  </span>
                  <h3 className="text-3xl font-bold mb-4">Running Collection</h3>
                  <p className="text-gray-600 mb-6">
                    Engineered for performance and comfort. Our running shoes
                    combine lightweight design, superior cushioning and responsive
                    materials to enhance your running experience.
                  </p>
                  <Link
                    href="/shop/running"
                    className="inline-flex items-center text-blue-600 font-semibold hover:underline"
                  >
                    Explore Collection{" "}
                    <AiOutlineArrowRight className="ml-2" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Running Shoe 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Running Shoe 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Running Shoe 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Running Shoe 4"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collection 2: Casual Sneakers */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Casual Sneaker 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Casual Sneaker 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Casual Sneaker 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Casual Sneaker 4"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="text-orange-600 font-semibold mb-2 block">
                    Lifestyle
                  </span>
                    <h3 className="text-3xl font-bold mb-4 text-orange-700">Casual Sneakers</h3>
                  <p className="text-gray-600 mb-6">
                    Where style meets comfort. Our casual sneakers are designed for
                    everyday wear, featuring contemporary designs and premium materials
                    that blend with any outfit.
                  </p>
                  <Link
                    href="/shop/casual"
                    className="inline-flex items-center text-orange-600 font-semibold hover:underline"
                  >
                    Explore Collection{" "}
                    <AiOutlineArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Collection 3: Formal Shoes - Fix the broken image */}
          <div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-slate-700 font-semibold mb-2 block">
                    Professional
                  </span>
                  <h3 className="text-3xl font-bold mb-4">Formal Collection</h3>
                  <p className="text-gray-600 mb-6">
                    Elevate your professional wardrobe with our range of expertly
                    crafted formal shoes. Made with premium leather and attention to
                    detail for lasting comfort and elegance.
                  </p>
                  <Link
                    href="/shop/formal"
                    className="inline-flex items-center text-slate-700 font-semibold hover:underline"
                  >
                    Explore Collection{" "}
                    <AiOutlineArrowRight className="ml-2" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1546367791-e7447b431084?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Formal Shoe 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1546367791-e7447b431084?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Formal Shoe 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1582897085656-c636d006a246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Formal Shoe 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Formal Shoe 4"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold">From Our Blog</h2>
        <Link
          href="/blog"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          View all articles <AiOutlineArrowRight />
        </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          href="/blog/how-to-choose-running-shoes"
          className="group h-full"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 flex flex-col h-full">
            <div className="relative h-48">
          <Image
            src="https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="How to Choose Running Shoes"
            fill
            className="object-cover"
          />
            </div>
            <div className="p-6 flex flex-col flex-1">
          <span className="text-blue-600 text-sm font-medium">Guide</span>
          <h3 className="font-bold text-xl mt-2 group-hover:text-blue-600 text-blue-700 transition duration-300">
            How to Choose the Perfect Running Shoes
          </h3>
          <p className="text-gray-600 mt-2 flex-1">
            Find the right balance of comfort, support, and performance for
            your running style.
          </p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">June 12, 2024</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">5 min read</span>
          </div>
            </div>
          </div>
        </Link>

        <Link
          href="/blog/sneaker-trends-2024"
          className="group h-full"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 flex flex-col h-full">
            <div className="relative h-48">
          <Image
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Sneaker Trends 2024"
            fill
            className="object-cover"
          />
            </div>
            <div className="p-6 flex flex-col flex-1">
          <span className="text-orange-600 text-sm font-medium">Fashion</span>
          <h3 className="font-bold text-xl mt-2 group-hover:text-orange-600 text-orange-700 transition duration-300">
            Top Sneaker Trends to Watch in 2024
          </h3>
          <p className="text-gray-600 mt-2 flex-1">
            Stay ahead of the curve with the latest trends in sneaker fashion
            this year.
          </p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">May 28, 2024</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">4 min read</span>
          </div>
            </div>
          </div>
        </Link>

        <Link
          href="/blog/caring-for-leather-shoes"
          className="group h-full"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 flex flex-col h-full">
            <div className="relative h-48">
          <Image
            src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Caring for Leather Shoes"
            fill
            className="object-cover"
          />
            </div>
            <div className="p-6 flex flex-col flex-1">
          <span className="text-slate-700 text-sm font-medium">Care</span>
          <h3 className="font-bold text-xl mt-2 group-hover:text-slate-700 text-slate-700 transition duration-300">
            The Ultimate Guide to Caring for Leather Shoes
          </h3>
          <p className="text-gray-600 mt-2 flex-1">
            Learn how to maintain and extend the life of your premium leather
            footwear.
          </p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">April 15, 2024</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">7 min read</span>
          </div>
            </div>
          </div>
        </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
