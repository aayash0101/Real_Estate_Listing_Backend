import { Request, Response, NextFunction } from "express";
import {
  listFavoritesForUser,
  addFavoriteForUser,
  removeFavoriteForUser,
} from "./favorite.service";

export async function getFavorites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const favorites = await listFavoritesForUser(req.user!.id);
    res.json({ success: true, data: favorites });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { propertyId } = req.body;
    const favorite = await addFavoriteForUser(req.user!.id, propertyId);
    res.status(201).json({ success: true, data: favorite });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }
    if (error.message === "ALREADY_FAVORITED") {
      res.status(409).json({ success: false, message: "Already favorited" });
      return;
    }
    next(error);
  }
}

export async function removeFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { propertyId } = req.params;
    await removeFavoriteForUser(req.user!.id, propertyId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ success: false, message: "Favorite not found" });
      return;
    }
    next(error);
  }
}