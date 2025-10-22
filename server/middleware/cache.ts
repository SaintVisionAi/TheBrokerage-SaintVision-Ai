/**
 * Simple in-memory cache for storing frequently accessed data
 * like routes, page metadata, and rate limit counters
 */
class CacheManager {
  private store: Map<string, { value: any; expiresAt?: number }> = new Map();

  /**
   * Get a value from cache
   */
  get(key: string): any {
    const item = this.store.get(key);
    
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Set a value in cache with optional TTL in milliseconds
   */
  set(key: string, value: any, ttlMs?: number): void {
    this.store.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    });
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Clean up expired items
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new CacheManager();

// Run cleanup every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);
