import express from "express";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import morgan from "morgan";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// app.use(cors({
//     origin: 'http://localhost:8080', // Permite solo solicitudes desde este origen
//     methods: 'GET,POST', // Permite solo ciertos métodos HTTP
//     allowedHeaders: 'Content-Type,Authorization', // Permite solo ciertos encabezados
//   }));
// app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes
app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());

app.use(morgan("dev"));

// Middleware to parse urlencoded bodies
app.use("/api", userRoutes);

export default app;
