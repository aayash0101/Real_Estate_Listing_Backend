import path from "path";
import fs from "fs";
import { PropertyType } from "@prisma/client";
import {
  findListings,
  findListingById,
  createListing as createListingRepo,
  updateListing as updateListingRepo,
  deleteListing as deleteListingRepo,
  findListingOwnerId,
  createPropertyImages,
  findImageById,
  deletePropertyImage,
  ListingFilters,
  CreateListingInput,
  UpdateListingInput,
} from "./listing.repository";

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

export async function searchListings(
  params: RawQueryParams,
  isAdmin: boolean,
  agentId?: string
) {
  const filters: ListingFilters = {
    price_min: toInt(params.price_min),
    price_max: toInt(params.price_max),
    bedrooms: toInt(params.bedrooms),
    bathrooms: toInt(params.bathrooms),
    property_type: toPropertyType(params.property_type),
    suburb: params.suburb,
    keyword: params.keyword,
    agent_id: agentId,
    page: toInt(params.page) ?? 1,
    limit: Math.min(toInt(params.limit) ?? 10, 50),
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

export async function createListingForAgent(agentId: string, data: CreateListingInput) {
  return createListingRepo({ ...data, agent_id: agentId });
}

export async function updateListingForAgent(
  listingId: string,
  requestingAgent: { id: string; is_admin: boolean },
  data: UpdateListingInput
) {
  const ownerId = await findListingOwnerId(listingId);

  if (!ownerId) {
    throw new Error("NOT_FOUND");
  }

  if (ownerId !== requestingAgent.id && !requestingAgent.is_admin) {
    throw new Error("FORBIDDEN");
  }

  return updateListingRepo(listingId, data);
}

export async function deleteListingForAgent(
  listingId: string,
  requestingAgent: { id: string; is_admin: boolean }
) {
  const ownerId = await findListingOwnerId(listingId);

  if (!ownerId) {
    throw new Error("NOT_FOUND");
  }

  if (ownerId !== requestingAgent.id && !requestingAgent.is_admin) {
    throw new Error("FORBIDDEN");
  }

  return deleteListingRepo(listingId);
}


export async function addListingImages(
  listingId: string,
  files: Express.Multer.File[],
  requestingAgent: { id: string; is_admin: boolean }
) {
  const ownerId = await findListingOwnerId(listingId);

  if (!ownerId) {
    throw new Error("NOT_FOUND");
  }

  if (ownerId !== requestingAgent.id && !requestingAgent.is_admin) {
    throw new Error("FORBIDDEN");
  }

  const urls = files.map((f) => `/uploads/listings/${f.filename}`);
  return createPropertyImages(listingId, urls);
}

export async function removeListingImage(
  imageId: string,
  requestingAgent: { id: string; is_admin: boolean }
) {
  const image = await findImageById(imageId);

  if (!image) {
    throw new Error("NOT_FOUND");
  }

  if (image.property.agent_id !== requestingAgent.id && !requestingAgent.is_admin) {
    throw new Error("FORBIDDEN");
  }

  const filePath = path.join(process.cwd(), image.url);
  fs.unlink(filePath, () => {
  });

  await deletePropertyImage(imageId);
  return { success: true };
}