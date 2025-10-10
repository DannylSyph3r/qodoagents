import { Product } from './Product';
import { Payment } from './Payment';
import { computeSalesTax } from '../utils/stringHelpers';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  payment?: Payment;
}

export class OrderModel {
  constructor(private order: Order) {}

  calculateSubtotal(): number {
    return this.order.items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
  }

  isCompleted(): boolean {
    return this.order.status === OrderStatus.DELIVERED;
  }

  private getEstimatedDeliveryDate(): Date {
    const deliveryDate = new Date(this.order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate;
  }

  canBeCancelled(): boolean {
    return this.order.status === OrderStatus.PENDING || 
           this.order.status === OrderStatus.CONFIRMED;
  }
}