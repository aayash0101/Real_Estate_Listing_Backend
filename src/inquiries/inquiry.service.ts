import {
  createInquiry,
  findInquiriesForAgent,
  findPropertyOwnerAgentId,
  CreateInquiryInput,
} from "./inquiry.repository";

export interface SubmitInquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitInquiry(propertyId: string, input: SubmitInquiryInput) {
  const agentId = await findPropertyOwnerAgentId(propertyId);
  if (!agentId) {
    throw new Error("LISTING_NOT_FOUND");
  }

  const data: CreateInquiryInput = {
    ...input,
    property_id: propertyId,
    agent_id: agentId,
  };

  return createInquiry(data);
}

export async function getInquiriesForAgent(agentId: string) {
  return findInquiriesForAgent(agentId);
}