/**
 * Cookie Management Utility
 * For secure storage of authentication tokens on the client-side.
 */

export const cookies = {
  /**
   * Set a cookie with specified name, value, and options.
   */
  set: (name: string, value: string, days = 7): void => {
    if (typeof document === "undefined") return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    const secure = window.location.protocol === "https:" ? "Secure;" : "";
    const cookieValue = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; ${secure}`;
    
    document.cookie = cookieValue;
  },

  /**
   * Get a cookie value by name.
   */
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;
    
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    
    return null;
  },

  /**
   * Remove a cookie by name.
   */
  remove: (name: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;`;
  },
};
