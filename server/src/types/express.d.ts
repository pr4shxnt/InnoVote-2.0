import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phoneNumber: string;
        sessionExpiresAt: number;
      };
      admin?: {
        username: string;
      };
    }
  }
}

export {};
