import prisma from "../config/prisma";
import { PropertyType } from "@prisma/client";

export interface ListingFilters {
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: PropertyType;
  suburb?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  suburb: string;
  state: string;
  postcode: string;
  address: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parking?: number;
  land_size?: number;
  internal_status?: string;
  agent_id: string;
}

export type UpdateListingInput = Partial<Omit<CreateListingInput, "agent_id">>;

const AGENT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  is_admin: false,
};

const BASE_PROPERTY_SELECT = {
  id: true,
  title: true,
  description: true,
  price: true,
  suburb: true,
  state: true,
  postcode: true,
  address: true,
  property_type: true,
  bedrooms: true,
  bathrooms: true,
  parking: true,
  land_size: true,
  created_at: true,
  agent: { select: AGENT_SELECT },
};

const ADMIN_PROPERTY_SELECT = {
  ...BASE_PROPERTY_SELECT,
  internal_status: true,
};

export async function findListings(filters: ListingFilters, isAdmin: boolean) {
  const {
    price_min,
    price_max,
    bedrooms,
    bathrooms,
    property_type,
    suburb,
    keyword,
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;

  const where = {
    ...(price_min !== undefined || price_max !== undefined
      ? {
          price: {
            ...(price_min !== undefined && { gte: price_min }),
            ...(price_max !== undefined && { lte: price_max }),
          },
        }
      : {}),
    ...(bedrooms !== undefined && { bedrooms: { gte: bedrooms } }),
    ...(bathrooms !== undefined && { bathrooms: { gte: bathrooms } }),
    ...(property_type && { property_type }),
    ...(suburb && {
      suburb: { contains: suburb, mode: "insensitive" as const },
    }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" as const } },
        { description: { contains: keyword, mode: "insensitive" as const } },
        { address: { contains: keyword, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      select: isAdmin ? ADMIN_PROPERTY_SELECT : BASE_PROPERTY_SELECT,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return { items, total };
}

export async function findListingById(id: string, isAdmin: boolean) {
  return prisma.property.findUnique({
    where: { id },
    select: isAdmin ? ADMIN_PROPERTY_SELECT : BASE_PROPERTY_SELECT,
  });
}

export async function createListing(data: CreateListingInput) {
  return prisma.property.create({
    data,
    select: ADMIN_PROPERTY_SELECT, // return full shape (incl. internal_status) to the creating agent
  });
}

export async function updateListing(id: string, data: UpdateListingInput) {
  return prisma.property.update({
    where: { id },
    data,
    select: ADMIN_PROPERTY_SELECT,
  });
}

export async function deleteListing(id: string) {
  return prisma.property.delete({ where: { id } });
}

export async function findListingOwnerId(id: string): Promise<string | null> {
  const property = await prisma.property.findUnique({
    where: { id },
    select: { agent_id: true },
  });
  return property?.agent_id ?? null;
}