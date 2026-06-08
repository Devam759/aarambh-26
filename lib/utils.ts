import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates the JKLU Application Number format (e.g. JKLU/BBA/2025/0310).
 * Format: JKLU/<Course>/<Year>/<Serial>
 */
export function validateRegistrationNumber(num: string): boolean {
  if (!num) return false;
  const regex = /^[jJ][kK][lL][uU]\/[a-zA-Z0-9\.\-]+\/\d{4}\/\d{4}$/;
  return regex.test(num.trim());
}

/**
 * Automatically formats registration number to: JKLU/<Course>/<Year>/<Serial>
 * E.g., JKLU/BBA/2025/0310
 */
export function formatRegistrationNumber(val: string, prevVal: string = ''): string {
  let clean = val.toUpperCase().replace(/[^A-Z0-9\.\-\/]/g, '');
  const isDeleting = prevVal && clean.length < prevVal.toUpperCase().replace(/[^A-Z0-9\.\-\/]/g, '').length;

  // Ensure starts with JKLU
  if (clean.length > 0) {
    if (!clean.startsWith('JKLU')) {
      if ('JKLU'.startsWith(clean)) {
        // Let user type J, JK, JKL, JKLU
      } else {
        clean = 'JKLU/' + clean.replace(/^\/+/, '');
      }
    } else if (clean.startsWith('JKLU')) {
      if (clean === 'JKLU') {
        if (!isDeleting) {
          clean = 'JKLU/';
        }
      } else if (clean.length > 4 && clean[4] !== '/') {
        clean = 'JKLU/' + clean.slice(4);
      }
    }
  }

  // Format rest: Course/Year/Serial
  if (clean.startsWith('JKLU/')) {
    let rest = clean.slice(5);
    const hasTrailingSlash = rest.endsWith('/') && rest.length > 1;
    rest = rest.replace(/\/+/g, '/');
    if (rest.endsWith('/') && rest.length > 1) {
      rest = rest.slice(0, -1);
    }

    const segments = rest.split('/');
    
    if (segments.length === 1) {
      const seg = segments[0];
      const firstDigitIdx = seg.search(/\d/);
      if (firstDigitIdx !== -1) {
        const course = seg.slice(0, firstDigitIdx);
        const digits = seg.slice(firstDigitIdx);
        
        let formattedDigits = digits.slice(0, 4);
        if (digits.length > 4) {
          formattedDigits += '/' + digits.slice(4, 8);
        } else if (digits.length === 4 && (hasTrailingSlash || !isDeleting)) {
          formattedDigits += '/';
        }
        
        if (course) {
          clean = `JKLU/${course}/${formattedDigits}`;
        } else {
          clean = `JKLU/${formattedDigits}`;
        }
      } else {
        const courseCodes = ['BBA', 'BTECH', 'B.TECH', 'BDES', 'B.DES', 'MDES', 'M.DES'];
        if (courseCodes.includes(seg) && !isDeleting) {
          clean = `JKLU/${seg}/`;
        } else if (hasTrailingSlash) {
          clean = `JKLU/${seg}/`;
        }
      }
    } else if (segments.length === 2) {
      const course = segments[0];
      const digits = segments[1].replace(/\D/g, '');
      
      let formattedDigits = digits.slice(0, 4);
      if (digits.length > 4) {
        formattedDigits += '/' + digits.slice(4, 8);
      } else if (digits.length === 4 && (hasTrailingSlash || !isDeleting)) {
        formattedDigits += '/';
      }
      
      if (course) {
        clean = `JKLU/${course}/${formattedDigits}`;
      } else {
        clean = `JKLU/${formattedDigits}`;
      }
    } else if (segments.length >= 3) {
      const course = segments[0];
      const year = segments[1].replace(/\D/g, '').slice(0, 4);
      const serial = segments[2].replace(/\D/g, '').slice(0, 4);
      
      if (course) {
        clean = `JKLU/${course}/${year}/${serial}`;
      } else {
        clean = `JKLU/${year}/${serial}`;
      }
    }
  }

  return clean;
}


