import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite } from "./favorite.controller";
import { requireUser } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireUser, getFavorites);
router.post("/", requireUser, addFavorite);
router.delete("/:propertyId", requireUser, removeFavorite);

export default router;