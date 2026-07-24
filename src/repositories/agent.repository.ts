import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const agentRepository = {
  async findAll() {
    return prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        is_admin: true,
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        properties: {
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
    });
  },
};