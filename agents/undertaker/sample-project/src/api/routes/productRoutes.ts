import { ProductService } from '../../services/ProductService';
import { ProductCategory } from '../../models/Product';

export class ProductRoutes {
  constructor(private productService: ProductService) {}

  async getProduct(productId: string): Promise<any> {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      return { error: 'Product not found', status: 404 };
    }
    return { data: product, status: 200 };
  }

  async getAvailableProducts(): Promise<any> {
    const products = await this.productService.getAvailableProducts();
    return { data: products, status: 200 };
  }

  async getProductsByCategory(category: string): Promise<any> {
    const products = await this.productService.getProductsByCategory(
      category as ProductCategory
    );
    return { data: products, status: 200 };
  }

  async createProduct(productData: any): Promise<any> {
    const product = await this.productService.createProduct(productData);
    return { data: product, status: 201 };
  }
}