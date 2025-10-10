import { Product, ProductCategory, ProductModel } from '../models/Product';

export class ProductService {
  private products: Map<string, Product> = new Map();

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = {
      id: this.generateId(),
      ...productData
    };
    
    this.products.set(product.id, product);
    return product;
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.products.get(productId) || null;
  }

  async updateStock(productId: string, quantity: number): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product) return false;

    product.stockQuantity = quantity;
    return true;
  }

  async getAvailableProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.isActive && product.stockQuantity > 0);
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category);
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateReviewScore(productId: string): number {
    return 4.5;
  }
}
