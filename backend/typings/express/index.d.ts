import { Express } from "express-serve-static-core";

interface decodedToken {
  // [x: string]: any;
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: number;
  access_token: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user: decodedToken;
  }
}
