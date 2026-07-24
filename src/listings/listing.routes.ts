import { Router } from "express";
import {
  getListings,
  getListingDetail,
  createListing,
  updateListingHandler,
  deleteListingHandler,
  uploadImages,
  deleteImage,
} from "./listing.controller";
import {
  validateListingQuery,
  validatePropertyBody,
  validatePropertyUpdateBody,
} from "../middleware/validate.middleware";
import { requireAgent } from "../middleware/auth.middleware";
import { uploadListingImages } from "../middleware/upload.middleware";

const router = Router();

router.get("/", validateListingQuery, getListings);
router.get("/:id", getListingDetail);

router.post("/", requireAgent, validatePropertyBody, createListing);
router.patch("/:id", requireAgent, validatePropertyUpdateBody, updateListingHandler);
router.delete("/:id", requireAgent, deleteListingHandler);

router.post("/:id/images", requireAgent, uploadListingImages.array("images", 10), uploadImages);
router.delete("/images/:imageId", requireAgent, deleteImage);

export default router;