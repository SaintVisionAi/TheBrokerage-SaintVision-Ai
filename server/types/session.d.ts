import 'express-session';
declare module 'express-session' {
  interface SessionData {
    id?: string;
    userId?: string;
    user?: { id: string; email: string | null; name: string | null; role: string | null; plan?: string | null; };
    ghlAccessToken?: string;
    ghlRefreshToken?: string;
    ghlTokenExpiry?: number;
    ghlLocationId?: string;
  }
}
export {};
