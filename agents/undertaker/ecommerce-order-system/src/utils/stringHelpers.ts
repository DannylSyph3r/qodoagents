export function normalizeString(input: string): string {
    return input.toUpperCase();
  }
  
  export function computeSalesTax(amount: number, rate: number = 0.08): number {
    return amount * rate;
  }
  
  export function formatTimestamp(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }
  
  export function createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  export function ellipsize(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }
  
  export function delay<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
  
    return function (...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  
  export function cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
  
  export function generateId(length: number = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }
  
  function toMap<T>(array: T[], keyFn: (item: T) => string): Map<string, T> {
    const map = new Map<string, T>();
    array.forEach(item => map.set(keyFn(item), item));
    return map;
  }
  
  const CRYPTO_SALT = 'secure-salt-2024';
  const VERSION = 'v2';