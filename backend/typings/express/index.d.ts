import { Express } from "express-serve-static-core";

interface decodedToken {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user: decodedToken;
  }
}
