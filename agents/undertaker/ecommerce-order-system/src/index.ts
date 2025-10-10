import { UserService } from './services/UserService';
import { ProductService } from './services/ProductService';
import { OrderService } from './services/OrderService';
import { PaymentService } from './services/PaymentService';
import { NotificationService } from './services/NotificationService';
import { AnalyticsService } from './services/AnalyticsService';

import { UserRoutes } from './api/routes/userRoutes';
import { ProductRoutes } from './api/routes/productRoutes';
import { OrderRoutes } from './api/routes/orderRoutes';

import { validateEmail, validatePassword, validateZipCode } from './utils/validators';
import { formatCurrency, formatDate, formatDateTime } from './utils/formatters';
import { API_BASE_URL, API_TIMEOUT, PAGINATION_DEFAULTS } from './utils/constants';

import { ReportService } from './services/ReportService';
import { V1User } from './types/v1';

async function initializeApp(): Promise<void> {
  console.log('Initializing E-commerce Order System...');
  
  const userService = new UserService();
  const productService = new ProductService();
  const notificationService = new NotificationService();
  const paymentService = new PaymentService();
  const orderService = new OrderService(productService, notificationService);
  const analyticsService = new AnalyticsService();

  const userRoutes = new UserRoutes(userService);
  const productRoutes = new ProductRoutes(productService);
  const orderRoutes = new OrderRoutes(orderService, paymentService);

  console.log('System initialized successfully');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`API Timeout: ${API_TIMEOUT}ms`);

  await runDemo(userService, productService, orderService, analyticsService);
}

async function runDemo(
  userService: UserService,
  productService: ProductService,
  orderService: OrderService,
  analyticsService: AnalyticsService
): Promise<void> {
  console.log('\n--- Running Demo ---\n');

  const user = await userService.createUser({
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer' as any,
    shippingAddresses: []
  });
  console.log('Created user:', user.id);

  const product1 = await productService.createProduct({
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1299.99,
    category: 'electronics' as any,
    stockQuantity: 50,
    isActive: true
  });

  const product2 = await productService.createProduct({
    name: 'Headphones',
    description: 'Wireless noise-canceling headphones',
    price: 299.99,
    category: 'electronics' as any,
    stockQuantity: 100,
    isActive: true
  });

  console.log('Created products:', product1.id, product2.id);

  const order = await orderService.createOrder(user.id, [
    {
      product: product1,
      quantity: 1,
      priceAtPurchase: product1.price
    },
    {
      product: product2,
      quantity: 2,
      priceAtPurchase: product2.price
    }
  ]);

  console.log('Created order:', order.id);
  console.log('Order total:', formatCurrency(order.totalAmount));

  await analyticsService.trackOrder(order);
  await analyticsService.trackProductView(product1.id);

  console.log('\n--- Demo Complete ---\n');
}

async function startHttpServer(port: number): Promise<void> {
  console.log(`Server would start on port ${port}`);
}

function configureErrorHandling(): void {
  console.log('Setting up global error handling');
}

const APPLICATION_VERSION = '2.0.0';
const BUILD_TIMESTAMP = '2024-01-15';

initializeApp().catch(error => {
  console.error('Failed to initialize application:', error);
  process.exit(1);
});
