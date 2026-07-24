import { agentRepository } from '../repositories/agent.repository';

export const agentService = {
  async getAllAgents() {
    const agents = await agentRepository.findAll();

    return agents.map(({ is_admin, _count, ...agent }) => ({
      ...agent,
      listing_count: _count.properties,
    }));
  },

  async getAgentById(id: string) {
    return agentRepository.findById(id);
  },
};