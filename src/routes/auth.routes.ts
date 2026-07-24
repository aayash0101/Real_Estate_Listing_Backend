import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/agent/register', authController.registerAgent);
router.post('/agent/login', authController.loginAgent);
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

export default router;