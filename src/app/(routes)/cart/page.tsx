import React from 'react';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

const cartItems = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    price: 150,
    quantity: 1,
    image: '/images/products/nike-air-max-270.jpg',
  },
  // Add more cart items...
];

export default function CartPage() {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b py-4 space-x-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <button className="p-1 border rounded">
                    <AiOutlineMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button className="p-1 border rounded">
                    <AiOutlinePlus />
                  </button>
                  <button className="p-1 text-red-500">
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>$10</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total + 10}</span>
            </div>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:opacity-90">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
