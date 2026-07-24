import { Router } from "express";
import { getListings, getListingDetail } from "./listing.controller";
import { validateListingQuery } from "../middleware/validate.middleware";

const router = Router();

router.get("/", validateListingQuery, getListings);
router.get("/:id", getListingDetail);

export default router;