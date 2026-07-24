import { Request, Response, NextFunction } from "express";
import {
  searchListings,
  getListingById,
  createListingForAgent,
  updateListingForAgent,
  deleteListingForAgent,
} from "./listing.service";

export async function getListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const isAdmin = req.agent?.is_admin ?? false;
    const wantsMine = req.query.mine === "true";
    const agentId = wantsMine && req.agent ? req.agent.id : undefined;

    const result = await searchListings(
      req.query as Record<string, string>,
      isAdmin,
      agentId
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

export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.agent is guaranteed non-null here by the requireAgent middleware on this route
    const listing = await createListingForAgent(req.agent!.id, req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
}

export async function updateListingHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const listing = await updateListingForAgent(
      req.params.id,
      { id: req.agent!.id, is_admin: req.agent!.is_admin },
      req.body
    );
    res.json({ success: true, data: listing });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ success: false, message: "Listing not found" });
      return;
    }
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You do not own this listing" });
      return;
    }
    next(error);
  }
}

export async function deleteListingHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteListingForAgent(req.params.id, {
      id: req.agent!.id,
      is_admin: req.agent!.is_admin,
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ success: false, message: "Listing not found" });
      return;
    }
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You do not own this listing" });
      return;
    }
    next(error);
  }
}