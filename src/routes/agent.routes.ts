import { Router } from 'express';
import { agentController } from '../controllers/agent.controller';

const router = Router();

router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgentById);

export default router;