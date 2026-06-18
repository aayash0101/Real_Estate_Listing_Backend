import { PropertyType } from "@prisma/client";
import { findListings, findListingById, ListingFilters } from "./listing.repository";

export interface RawQueryParams {
  price_min?: string;
  price_max?: string;
  bedrooms?: string;
  bathrooms?: string;
  property_type?: string;
  suburb?: string;
  keyword?: string;
  page?: string;
  limit?: string;
}

function toInt(val: string | undefined): number | undefined {
  if (!val) return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) ? undefined : n;
}

function toPropertyType(val: string | undefined): PropertyType | undefined {
  if (!val) return undefined;
  const upper = val.toUpperCase();
  if (Object.values(PropertyType).includes(upper as PropertyType)) {
    return upper as PropertyType;
  }
  return undefined;
}

export async function searchListings(params: RawQueryParams, isAdmin: boolean) {
  const filters: ListingFilters = {
    price_min: toInt(params.price_min),
    price_max: toInt(params.price_max),
    bedrooms: toInt(params.bedrooms),
    bathrooms: toInt(params.bathrooms),
    property_type: toPropertyType(params.property_type),
    suburb: params.suburb,
    keyword: params.keyword,
    page: toInt(params.page) ?? 1,
    limit: Math.min(toInt(params.limit) ?? 10, 50), // cap at 50
  };

  const { items, total } = await findListings(filters, isAdmin);
  const page = filters.page!;
  const limit = filters.limit!;

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getListingById(id: string, isAdmin: boolean) {
  const listing = await findListingById(id, isAdmin);
  if (!listing) return null;
  return listing;
}