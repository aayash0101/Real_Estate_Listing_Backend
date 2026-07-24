import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import listingRoutes from "./listings/listing.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  });
});

app.use("/listings", listingRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;