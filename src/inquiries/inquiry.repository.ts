import prisma from "../config/prisma";

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id: string;
  agent_id: string;
}

const INQUIRY_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  created_at: true,
  property: {
    select: { id: true, title: true, address: true },
  },
};

export async function createInquiry(data: CreateInquiryInput) {
  return prisma.inquiry.create({
    data,
    select: INQUIRY_SELECT,
  });
}

export async function findInquiriesForAgent(agentId: string) {
  return prisma.inquiry.findMany({
    where: { agent_id: agentId },
    select: INQUIRY_SELECT,
    orderBy: { created_at: "desc" },
  });
}

export async function findPropertyOwnerAgentId(propertyId: string): Promise<string | null> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { agent_id: true },
  });
  return property?.agent_id ?? null;
}