import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";
import listingRoutes from "./listings/listing.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/listings", listingRoutes);

export default app;