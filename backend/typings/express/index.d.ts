import { Express } from "express-serve-static-core";

interface decodedToken {
  // [x: string]: any;
  id: number;
  role: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user: decodedToken;
  }
}
