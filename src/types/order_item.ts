export interface OrderItem {
  _id: string; // Mongo ObjectId dạng string
  orderId: string; // Id của đơn hàng (ObjectId dạng string)
  productId: string; // Id sản phẩm (ObjectId dạng string)
  size: number; // Size giày
  quantity: number; // Số lượng sản phẩm trong order
  price: number; // Giá tại thời điểm đặt hàng (tổng từng item = price * quantity)
}
