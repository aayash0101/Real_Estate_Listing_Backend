import { Agent, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      agent?: Agent;
      user?: User;
    }
  }
}

export {};