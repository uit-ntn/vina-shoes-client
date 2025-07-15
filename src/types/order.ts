export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  userId: string; // ObjectId dạng string (liên kết tới user)
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; // Add more statuses as needed
  total: number;
  paymentMethod: "credit_card" | "cod" | "paypal" | "bank_transfer"; // Add more payment methods as needed
  createdAt: Date;
  updatedAt: Date;
}
