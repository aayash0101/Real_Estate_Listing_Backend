import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AgentTokenPayload {
  type: 'agent';
  id: string;
  is_admin: boolean;
}

export interface UserTokenPayload {
  type: 'user';
  id: string;
}

export type TokenPayload = AgentTokenPayload | UserTokenPayload;

export const jwtUtil = {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verify(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  },
};