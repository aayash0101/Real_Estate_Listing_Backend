import { Request, Response, NextFunction } from "express";
import { searchListings, getListingById } from "./listing.service";

export async function getListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const isAdmin = req.agent?.is_admin ?? false;
    const result = await searchListings(
      req.query as Record<string, string>,
      isAdmin
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getListingDetail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const isAdmin = req.agent?.is_admin ?? false;
    const listing = await getListingById(req.params.id, isAdmin);

    if (!listing) {
      res.status(404).json({ success: false, message: "Listing not found" });
      return;
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
}