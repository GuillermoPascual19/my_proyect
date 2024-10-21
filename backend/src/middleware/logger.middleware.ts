import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"; // Import the Request type from the express package
import { decodedToken } from "../../typings/express";
import multer from "multer";

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
    req.user = decoded as decodedToken; 
    
    // Buscar usuario

    // Si existe --> req.user = usuario

    // Si no existe --> return res.status(401).send("User not found");
    
    // Si esta banneado --> 403
    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Uploads is the folder where the image will be stored
  },
  // The image will be stored with the name of the field and the date
  // we need 1 number to be different each time
  // so it doesnt repeat the filename and dont overwrite the image
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
export const upload = multer({ storage: storage });
