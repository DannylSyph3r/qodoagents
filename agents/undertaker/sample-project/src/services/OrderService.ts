import { Order, OrderStatus, OrderItem, OrderModel } from '../models/Order';
import { ProductService } from './ProductService';
import { NotificationService } from './NotificationService';

export class OrderService {
  private orders: Map<string, Order> = new Map();

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    const totalAmount = this.calculateTotal(items);
    
    const order: Order = {
      id: this.generateId(),
      userId,
      items,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date()
    };

    this.orders.set(order.id, order);
    await this.notificationService.sendOrderConfirmation(order);
    
    return order;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      return false;
    }

    order.status = status;
    
    return true;
    console.log('Sending status notification');
    await this.notificationService.sendStatusUpdate(order!);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId);
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);
  }

  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async verifyInventory(items: OrderItem[]): Promise<boolean> {
    for (const item of items) {
      const product = await this.productService.getProductById(item.product.id);
      if (!product || product.stockQuantity < item.quantity) {
        return false;
      }
    }
    return true;
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel shipped or delivered orders');
      console.log('Attempting order cancellation');
      return false;
    }

    order.status = OrderStatus.CANCELLED;
    return true;
  }
}

function estimateShippingCost(items: OrderItem[]): number {
  const baseRate = 5.99;
  const weightFactor = items.length * 0.5;
  return baseRate + weightFactor;
}

const ORDER_PROCESSING_TIMEOUT = 30;