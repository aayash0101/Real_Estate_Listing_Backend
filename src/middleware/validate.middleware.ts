import { Request, Response, NextFunction } from "express";
import { PropertyType } from "@prisma/client";

const VALID_PROPERTY_TYPES = Object.values(PropertyType);

function isPositiveInt(val: string): boolean {
  const n = parseInt(val, 10);
  return !isNaN(n) && n >= 0;
}

export function validateListingQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { price_min, price_max, bedrooms, bathrooms, property_type, page, limit } =
    req.query as Record<string, string>;

  if (price_min && !isPositiveInt(price_min)) {
    res.status(400).json({
      success: false,
      message: "price_min must be a non-negative integer",
    });
    return;
  }

  if (price_max && !isPositiveInt(price_max)) {
    res.status(400).json({
      success: false,
      message: "price_max must be a non-negative integer",
    });
    return;
  }

  if (
    price_min &&
    price_max &&
    parseInt(price_min, 10) > parseInt(price_max, 10)
  ) {
    res.status(400).json({
      success: false,
      message: "price_min cannot be greater than price_max",
    });
    return;
  }

  if (bedrooms && !isPositiveInt(bedrooms)) {
    res.status(400).json({
      success: false,
      message: "bedrooms must be a non-negative integer",
    });
    return;
  }

  if (bathrooms && !isPositiveInt(bathrooms)) {
    res.status(400).json({
      success: false,
      message: "bathrooms must be a non-negative integer",
    });
    return;
  }

  if (
    property_type &&
    !VALID_PROPERTY_TYPES.includes(property_type.toUpperCase() as PropertyType)
  ) {
    res.status(400).json({
      success: false,
      message: `property_type must be one of: ${VALID_PROPERTY_TYPES.join(", ")}`,
    });
    return;
  }

  if (page && !isPositiveInt(page)) {
    res.status(400).json({
      success: false,
      message: "page must be a positive integer",
    });
    return;
  }

  if (limit && !isPositiveInt(limit)) {
    res.status(400).json({
      success: false,
      message: "limit must be a positive integer",
    });
    return;
  }

  next();
}