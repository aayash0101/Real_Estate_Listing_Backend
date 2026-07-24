import { Request, Response, NextFunction } from 'express';
import { agentService } from '../services/agent.service';

export const agentController = {
  async getAgents(req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await agentService.getAllAgents();
      res.status(200).json({ data: agents });
    } catch (err) {
      next(err);
    }
  },

  async getAgentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const agent = await agentService.getAgentById(id);

      if (!agent) {
        res.status(404).json({ error: 'Agent not found' });
        return;
      }

      res.status(200).json({ data: agent });
    } catch (err) {
      next(err);
    }
  },
};