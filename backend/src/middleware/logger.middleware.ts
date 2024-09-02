import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"; // Import the Request type from the express package
import { decodedToken } from "../../typings/express";



export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(404).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET || "secret"
    );
    req.user = decoded as decodedToken; // Guardamos los datos del usuario decodificados en req.user
    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};
