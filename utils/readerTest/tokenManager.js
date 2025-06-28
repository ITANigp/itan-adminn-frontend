import { api } from "@/utils/auth/readerApi"; 

class ReadingTokenManager {
  constructor() {
    this.tokens = {};
    this.refreshTimers = {};
  }

  storeToken(bookId, token, purchaseId) {
    const payload = this.decodeToken(token);
    this.tokens[bookId] = {
      token,
      purchaseId,
      expiresAt: payload.exp * 1000,
    };
    this.scheduleRefresh(bookId);
  }

  getToken(bookId) {
    const tokenData = this.tokens[bookId];
    if (!tokenData) return null;
    if (Date.now() >= tokenData.expiresAt) {
      this.refreshToken(bookId);
      return null;
    }
    return tokenData.token;
  }

  scheduleRefresh(bookId) {
    const tokenData = this.tokens[bookId];
    if (!tokenData) return;

    if (this.refreshTimers[bookId]) {
      clearTimeout(this.refreshTimers[bookId]);
    }

    const refreshTime = tokenData.expiresAt - 15 * 60 * 1000;
    const delay = Math.max(0, refreshTime - Date.now());

    if (delay > 0) {
      this.refreshTimers[bookId] = setTimeout(() => {
        this.refreshToken(bookId);
      }, delay);
    }
  }

  async refreshToken(bookId) {
    const tokenData = this.tokens[bookId];
    if (!tokenData) return null;

    try {
      const response = await api.post(
        "/purchases/refresh_reading_token",
        {
          purchase_id: tokenData.purchaseId,
        }
      );

      const newToken = response.data.data.reading_token;
      this.storeToken(bookId, newToken, tokenData.purchaseId);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh reading token:", error);
      return null;
    }
  }

  decodeToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }
}

export const tokenManager = new ReadingTokenManager();
