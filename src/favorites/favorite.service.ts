import {
  findFavoritesByUser,
  findPropertyById,
  findFavorite,
  createFavorite,
  deleteFavorite,
} from "./favorite.repository";

export async function listFavoritesForUser(userId: string) {
  return findFavoritesByUser(userId);
}

export async function addFavoriteForUser(userId: string, propertyId: string) {
  const property = await findPropertyById(propertyId);
  if (!property) {
    throw new Error("NOT_FOUND");
  }

  const existing = await findFavorite(userId, propertyId);
  if (existing) {
    throw new Error("ALREADY_FAVORITED");
  }

  return createFavorite(userId, propertyId);
}

export async function removeFavoriteForUser(userId: string, propertyId: string) {
  const existing = await findFavorite(userId, propertyId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return deleteFavorite(userId, propertyId);
}