import { Request, Response, NextFunction } from "express";
import { submitInquiry, getInquiriesForAgent } from "./inquiry.service";

export async function createInquiryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Name, email, and message are required" });
      return;
    }

    const inquiry = await submitInquiry(req.params.id, { name, email, phone, message });
    res.status(201).json({ success: true, data: inquiry });
  } catch (error: any) {
    if (error.message === "LISTING_NOT_FOUND") {
      res.status(404).json({ success: false, message: "Listing not found" });
      return;
    }
    next(error);
  }
}

export async function getMyInquiries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const inquiries = await getInquiriesForAgent(req.agent!.id);
    res.json({ success: true, data: inquiries });
  } catch (error) {
    next(error);
  }
}