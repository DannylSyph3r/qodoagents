export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export class ShippingAddressModel {
  constructor(private address: ShippingAddress) {}

  getFullAddress(): string {
    const parts = [
      this.address.addressLine1,
      this.address.addressLine2,
      this.address.city,
      this.address.state,
      this.address.zipCode,
      this.address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  private validatePostalCode(): boolean {
    return /^\d{5}(-\d{4})?$/.test(this.address.zipCode);
  }
}

export function formatShippingLabel(address: ShippingAddress): string {
  return `${address.fullName}\n${address.addressLine1}\n${address.city}, ${address.state} ${address.zipCode}`;
}

const DEFAULT_SHIPPING_COUNTRY = 'United States';