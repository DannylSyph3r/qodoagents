import { UserService } from '../src/services/UserService';

describe('UserService', () => {
  it('should create a user', async () => {
    const userService = new UserService();
    const user = await userService.createUser({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'customer' as any,
      shippingAddresses: []
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});