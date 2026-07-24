import prisma from "../config/prisma";

export async function findFavoritesByUser(userId: string) {
  return prisma.favorite.findMany({
    where: { user_id: userId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          suburb: true,
          property_type: true,
          bedrooms: true,
          bathrooms: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function findPropertyById(propertyId: string) {
  return prisma.property.findUnique({ where: { id: propertyId } });
}

export async function findFavorite(userId: string, propertyId: string) {
  return prisma.favorite.findUnique({
    where: { user_id_property_id: { user_id: userId, property_id: propertyId } },
  });
}

export async function createFavorite(userId: string, propertyId: string) {
  return prisma.favorite.create({
    data: { user_id: userId, property_id: propertyId },
  });
}

export async function deleteFavorite(userId: string, propertyId: string) {
  return prisma.favorite.delete({
    where: { user_id_property_id: { user_id: userId, property_id: propertyId } },
  });
}