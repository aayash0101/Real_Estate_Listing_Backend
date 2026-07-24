import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { jwtUtil } from "../utils/jwt.util";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];

  // 1. Try JWT first (Authorization: Bearer <token>)
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);

    try {
      const payload = jwtUtil.verify(token);

      if (payload.type === "agent") {
        const agent = await prisma.agent.findUnique({ where: { id: payload.id } });
        if (!agent) {
          res.status(401).json({ success: false, message: "Invalid token: agent not found" });
          return;
        }
        req.agent = agent;
        next();
        return;
      }

      if (payload.type === "user") {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
          res.status(401).json({ success: false, message: "Invalid token: user not found" });
          return;
        }
        req.user = user;
        next();
        return;
      }
    } catch {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }
  }

  // 2. Fall back to legacy x-agent-id header (kept for existing tests/behaviour)
  const agentId = req.headers["x-agent-id"] as string | undefined;

  if (!agentId) {
    // No token, no header — treat as unauthenticated (non-admin) guest
    next();
    return;
  }

  try {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) {
      res.status(401).json({ success: false, message: "Invalid agent ID" });
      return;
    }

    req.agent = agent;
    next();
  } catch {
    res.status(500).json({ success: false, message: "Auth lookup failed" });
  }
}

export function requireAgent(req: Request, res: Response, next: NextFunction): void {
  if (!req.agent) {
    res.status(401).json({ success: false, message: "Agent authentication required" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.agent?.is_admin) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: "User authentication required" });
    return;
  }
  next();
}