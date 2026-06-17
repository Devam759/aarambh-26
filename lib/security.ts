import crypto from 'crypto';

// 1. In-memory Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

/**
 * Custom in-memory rate limiting mechanism.
 * Limits the number of requests per IP within a specified time window.
 */
export function isRateLimited(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  
  // Prune expired entries to prevent memory leaks when the map becomes large
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.firstRequest > windowMs) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }
  
  const rateData = rateLimitMap.get(ip)!;
  if (now - rateData.firstRequest > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }
  
  if (rateData.count >= limit) {
    return true;
  }
  
  rateData.count++;
  return false;
}

/**
 * XSS & Script injection sanitation helper.
 * Strips HTML tags and escapes special characters.
 */
export function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    const text = val.trim();
    let result = '';
    let inTag = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '<') {
        inTag = true;
      } else if (char === '>') {
        inTag = false;
      } else if (!inTag) {
        result += char;
      }
    }
    return result.replace(/[&<>"']/g, (char) => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return map[char] || char;
    });
  }
  return val;
}

/**
 * Recursively sanitizes request objects to prevent nested injections.
 */
export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        sanitized[key] = sanitizeObject(val);
      } else {
        sanitized[key] = sanitizeInput(val);
      }
    }
  }
  return sanitized;
}

export const isProd = (process.env.NEXT_PUBLIC_CASHFREE_ENV || '').replace(/['"]/g, '').trim().toUpperCase() === 'PRODUCTION';

export const cashfreeAppId = isProd
  ? (process.env.CASHFREE_PROD_APP_ID || process.env.CASHFREE_APP_ID || '')
  : (process.env.CASHFREE_TEST_APP_ID || process.env.CASHFREE_APP_ID || '');

export const cashfreeSecretKey = isProd
  ? (process.env.CASHFREE_PROD_SECRET_KEY || process.env.CASHFREE_SECRET_KEY || '')
  : (process.env.CASHFREE_TEST_SECRET_KEY || process.env.CASHFREE_SECRET_KEY || '');

/**
 * Verifies the validity of the signature sent by Cashfree Webhooks.
 * Uses SHA-256 HMAC of (timestamp + rawBody) computed with the active Cashfree secret key.
 */
export function verifyCashfreeSignature(signature: string, rawBody: string, timestamp: string): boolean {
  const secretKey = cashfreeSecretKey;
  if (!secretKey) {
    console.warn("Cashfree Secret Key missing in environment variables.");
    if (isProd || process.env.NODE_ENV === 'production') {
      console.error("Signature verification failed: Cashfree Secret Key is missing in production.");
      return false;
    }
    console.warn("Signature verification bypassed (non-production environment).");
    return true;
  }
  
  const data = timestamp + rawBody;
  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('base64');
  
  return computedSignature === signature;
}

/**
 * Standardizes mobile numbers to always format as +91 1234567890.
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `+91 ${digits.slice(-10)}`;
  }
  return phone;
}

/**
 * Masks an email address to protect PII in logs (e.g. d***m@gmail.com).
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '[REDACTED]';
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return `***@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
}


