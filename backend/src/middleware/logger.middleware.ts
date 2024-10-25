import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"; // Import the Request type from the express package
import { decodedToken } from "../../typings/express";
import multer from "multer";
import app from "../app";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


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

// export const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // limit file size to 5MB
//   },
// });

// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   const params = {
//     Bucket: 'your_bucket_name',
//     Key: req.file.originalname,
//     Body: req.file.buffer,
//   };

//   s3.upload(params, (err: any, data: any) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error uploading file');
//     }

//     res.send('File uploaded successfully');
//   });
// });

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
//export const upload = multer({ storage: storage });
