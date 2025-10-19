import * as crypto from 'crypto';

// Get encryption key from environment or generate a secure default for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

// Ensure we have a consistent 32-byte key
const getKey = (): Buffer => {
  const key = ENCRYPTION_KEY.length === 64 
    ? Buffer.from(ENCRYPTION_KEY, 'hex')
    : crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  return key;
};

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - The plaintext to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  try {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data encrypted with the encrypt function
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return '';
  
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }
    
    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hashes sensitive data one-way (for lookups)
 * @param text - The text to hash
 * @returns SHA-256 hash
 */
export function hash(text: string): string {
  if (!text) return '';
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Redacts SSN to show only last 4 digits
 * @param ssn - Full SSN
 * @returns Redacted SSN (e.g., ***-**-1234)
 */
export function redactSSN(ssn: string): string {
  if (!ssn) return '';
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length < 4) return '***-**-****';
  const last4 = cleaned.slice(-4);
  return `***-**-${last4}`;
}

/**
 * Generates a secure random token
 * @param length - Length of token in bytes (default 32)
 * @returns Hex string token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validates if a string is valid base64
 * @param str - String to validate
 * @returns Boolean indicating if valid base64
 */
export function isValidBase64(str: string): boolean {
  if (!str) return false;
  
  // Check if it's a data URL
  if (str.startsWith('data:')) {
    const parts = str.split(',');
    if (parts.length !== 2) return false;
    str = parts[1];
  }
  
  try {
    const decoded = Buffer.from(str, 'base64').toString('base64');
    return decoded === str;
  } catch {
    return false;
  }
}

// Log warning if using default key in production
if (!process.env.ENCRYPTION_KEY) {
  console.warn('⚠️ WARNING: Using generated encryption key. Set ENCRYPTION_KEY environment variable for production!');
}