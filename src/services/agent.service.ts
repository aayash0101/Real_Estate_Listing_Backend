import { agentRepository } from '../repositories/agent.repository';

export const agentService = {
  async getAllAgents() {
    const agents = await agentRepository.findAll();
    
    return agents.map(({ is_admin, _count, ...agent }) => ({
      ...agent,
      listing_count: _count.listings,
    }));
  },

  async getAgentById(id: string) {
    const agent = await agentRepository.findById(id);
    if (!agent) return null;

    const { listings, ...rest } = agent;
    return { ...rest, properties: listings };
  },
};