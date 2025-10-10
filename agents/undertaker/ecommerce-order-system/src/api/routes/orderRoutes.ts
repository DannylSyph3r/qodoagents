import { OrderService } from '../../services/OrderService';
import { PaymentService } from '../../services/PaymentService';
import { OrderStatus } from '../../models/Order';
import { formatCurrency } from '../../utils/formatters';

export class OrderRoutes {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  async createOrder(userId: string, orderData: any): Promise<any> {
    const order = await this.orderService.createOrder(userId, orderData.items);
    return { data: order, status: 201 };
  }

  async getOrder(orderId: string): Promise<any> {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      return { error: 'Order not found', status: 404 };
    }
    return { data: order, status: 200 };
  }

  async getUserOrders(userId: string): Promise<any> {
    const orders = await this.orderService.getUserOrders(userId);
    return { data: orders, status: 200 };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<any> {
    const updated = await this.orderService.updateOrderStatus(orderId, status);
    if (!updated) {
      return { error: 'Order not found', status: 404 };
    }
    return { data: { orderId, status }, status: 200 };
  }

  async cancelOrder(orderId: string): Promise<any> {
    try {
      const cancelled = await this.orderService.cancelOrder(orderId);
      if (!cancelled) {
        return { error: 'Order not found', status: 404 };
      }
      return { data: { orderId, status: 'cancelled' }, status: 200 };
    } catch (error) {
      return { error: (error as Error).message, status: 400 };
    }
  }
}

function verifyOrderItems(orderData: any): boolean {
  return orderData && orderData.items && Array.isArray(orderData.items);
}

const MAX_ITEMS_PER_ORDER = 50;