export enum ProductCategory {
    ELECTRONICS = 'electronics',
    CLOTHING = 'clothing',
    BOOKS = 'books',
    HOME = 'home'
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    stockQuantity: number;
    isActive: boolean;
  }
  
  export class ProductModel {
    constructor(private product: Product) {}
  
    isInStock(): boolean {
      return this.product.stockQuantity > 0;
    }
  
    getDiscountedPrice(discountPercent: number): number {
      return this.product.price * (1 - discountPercent / 100);
    }
  
    isAvailable(): boolean {
      return this.product.isActive && this.isInStock();
    }
  }