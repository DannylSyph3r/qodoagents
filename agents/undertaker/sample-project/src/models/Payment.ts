export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer'
  }
  
  export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
  }
  
  export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    processedAt?: Date;
  }
  
  export class PaymentModel {
    constructor(private payment: Payment) {}
  
    isSuccessful(): boolean {
      return this.payment.status === PaymentStatus.COMPLETED;
    }
  
    requiresAction(): boolean {
      return this.payment.status === PaymentStatus.PENDING;
    }
  }
  
  function createPaymentReference(): string {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  