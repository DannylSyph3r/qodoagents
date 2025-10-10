export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }
  
  export function validateZipCode(zipCode: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  }
  
  export function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?1?\d{9,15}$/;
    return phoneRegex.test(phone);
  }
  
  export function validateCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }
  
  export function validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  function verifyChecksum(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;
  
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
  
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
  
      sum += digit;
      isEven = !isEven;
    }
  
    return sum % 10 === 0;
  }
  
  const MIN_PASSWORD_LENGTH = 8;
  const MAX_PASSWORD_LENGTH = 128;