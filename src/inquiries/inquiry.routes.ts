import { Router } from "express";
import { createInquiryHandler, getMyInquiries } from "./inquiry.controller";
import { requireAgent } from "../middleware/auth.middleware";

const router = Router();

router.post("/listings/:id/inquiries", createInquiryHandler);

router.get("/inquiries/mine", requireAgent, getMyInquiries);

export default router;