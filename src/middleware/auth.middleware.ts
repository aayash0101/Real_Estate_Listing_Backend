import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const agentId = req.headers["x-agent-id"] as string | undefined;

  if (!agentId) {
    // No agent header — treat as unauthenticated (non-admin) guest
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