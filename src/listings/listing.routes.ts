import { Router } from "express";
import {
  getListings,
  getListingDetail,
  createListing,
  updateListingHandler,
  deleteListingHandler,
} from "./listing.controller";
import {
  validateListingQuery,
  validatePropertyBody,
  validatePropertyUpdateBody,
} from "../middleware/validate.middleware";
import { requireAgent } from "../middleware/auth.middleware";

const router = Router();

router.get("/", validateListingQuery, getListings);
router.get("/:id", getListingDetail);

router.post("/", requireAgent, validatePropertyBody, createListing);
router.patch("/:id", requireAgent, validatePropertyUpdateBody, updateListingHandler);
router.delete("/:id", requireAgent, deleteListingHandler);

export default router;