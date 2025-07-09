import React from 'react';

const orders = [
  {
    id: 1,
    date: '2025-07-05',
    status: 'Delivered',
    total: 160,
    items: [
      {
        id: 1,
        name: 'Nike Air Max 270',
        price: 150,
        quantity: 1,
      },
    ],
  },
  // Add more orders...
];

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-gray-600">{order.date}</p>
              </div>
              <div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
