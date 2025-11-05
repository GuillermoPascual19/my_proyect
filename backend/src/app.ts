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

app.use(cors(corsOptions));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api", userRoutes);

// Send static files in uploads folder
app.use("/uploads", express.static("uploads"));

export default app;
