import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async registerAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password } = req.body;
      const result = await authService.registerAgent(name, email, phone, password);
      res.status(201).json({ data: result });
    } catch (err: any) {
      if (err.message === 'EMAIL_TAKEN') {
        res.status(409).json({ error: 'An agent with this email already exists' });
        return;
      }
      next(err);
    }
  },

  async loginAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginAgent(email, password);
      res.status(200).json({ data: result });
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      next(err);
    }
  },

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.registerUser(name, email, password);
      res.status(201).json({ data: result });
    } catch (err: any) {
      if (err.message === 'EMAIL_TAKEN') {
        res.status(409).json({ error: 'A user with this email already exists' });
        return;
      }
      next(err);
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      res.status(200).json({ data: result });
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      next(err);
    }
  },
};