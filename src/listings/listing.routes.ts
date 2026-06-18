import { Router } from "express";
import { getListings, getListingDetail } from "./listing.controller";

const router = Router();

router.get("/", getListings);
router.get("/:id", getListingDetail);

export default router;