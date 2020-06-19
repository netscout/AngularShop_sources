export interface Order {
  id: number;
  userId: number;
  userName: string;
  toName: string;
  address1: string;
  address2: string;
  phone: string;
  orderStatusId: number;
  orderItems: OrderItem[];
  totalPrice: number;
  createdDate: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  qty: number;
  price: number;
}
