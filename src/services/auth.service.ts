import { PrismaClient } from '@prisma/client';
import { passwordUtil } from '../utils/password.util';
import { jwtUtil } from '../utils/jwt.util';

const prisma = new PrismaClient();

export const authService = {
  async registerAgent(name: string, email: string, phone: string | undefined, password: string) {
    const existing = await prisma.agent.findUnique({ where: { email } });
    if (existing) throw new Error('EMAIL_TAKEN');

    const password_hash = await passwordUtil.hash(password);
    const agent = await prisma.agent.create({
      data: { name, email, phone, password_hash },
      select: { id: true, name: true, email: true, phone: true, is_admin: true },
    });

    const token = jwtUtil.sign({ type: 'agent', id: agent.id, is_admin: agent.is_admin });
    return { agent, token };
  },

  async loginAgent(email: string, password: string) {
    const agent = await prisma.agent.findUnique({ where: { email } });
    if (!agent) throw new Error('INVALID_CREDENTIALS');

    const valid = await passwordUtil.compare(password, agent.password_hash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const token = jwtUtil.sign({ type: 'agent', id: agent.id, is_admin: agent.is_admin });
    return {
      agent: { id: agent.id, name: agent.name, email: agent.email, phone: agent.phone, is_admin: agent.is_admin },
      token,
    };
  },

  async registerUser(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('EMAIL_TAKEN');

    const password_hash = await passwordUtil.hash(password);
    const user = await prisma.user.create({
      data: { name, email, password_hash },
      select: { id: true, name: true, email: true },
    });

    const token = jwtUtil.sign({ type: 'user', id: user.id });
    return { user, token };
  },

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const valid = await passwordUtil.compare(password, user.password_hash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const token = jwtUtil.sign({ type: 'user', id: user.id });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },
};