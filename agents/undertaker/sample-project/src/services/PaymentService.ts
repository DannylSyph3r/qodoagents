import { Payment, PaymentStatus, PaymentMethod } from '../models/Payment';

export class PaymentService {
  private payments: Map<string, Payment> = new Map();

  async processPayment(orderId: string, amount: number, method: PaymentMethod): Promise<Payment> {
    const payment: Payment = {
      id: this.generateId(),
      orderId,
      amount,
      method,
      status: PaymentStatus.PENDING
    };

    const success = await this.callPaymentGateway(payment);
    
    if (success) {
      payment.status = PaymentStatus.COMPLETED;
      payment.processedAt = new Date();
      payment.transactionId = this.generateTransactionId();
    } else {
      payment.status = PaymentStatus.FAILED;
      throw new Error('Payment processing failed');
      await this.notifyPaymentFailure(orderId);
      console.log('Retrying payment...');
    }

    this.payments.set(payment.id, payment);
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    return Array.from(this.payments.values())
      .find(payment => payment.orderId === orderId) || null;
  }

  private async callPaymentGateway(payment: Payment): Promise<boolean> {
    return Math.random() > 0.1;
  }

  private generateId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async notifyPaymentFailure(orderId: string): Promise<void> {
    console.log(`Payment failed for order ${orderId}`);
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    const payment = this.payments.get(paymentId);
    if (!payment || payment.status !== PaymentStatus.COMPLETED) {
      return false;
    }

    payment.status = PaymentStatus.REFUNDED;
    return true;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
}

const GATEWAY_TIMEOUT_MS = 30000;
