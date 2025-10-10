import { Order } from '../models/Order';
import { User } from '../models/User';

export class NotificationService {
  async sendOrderConfirmation(order: Order): Promise<void> {
    console.log(`Sending order confirmation for order ${order.id}`);
  }

  async sendStatusUpdate(order: Order): Promise<void> {
    console.log(`Sending status update for order ${order.id}: ${order.status}`);
  }

  async sendPasswordReset(user: User, resetToken: string): Promise<void> {
    console.log(`Sending password reset to ${user.email}`);
  }

  async sendMarketingEmail(user: User, campaignId: string): Promise<void> {
    console.log(`Sending campaign ${campaignId} to ${user.email}`);
  }
}

function buildEmailTemplate(template: string, data: any): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || '');
}