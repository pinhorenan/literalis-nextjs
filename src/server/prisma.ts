// server/db.ts
import { PrismaClient } from '@prisma/client';
declare global { var _prisma: PrismaClient | undefined; };
export const prisma = global._prisma ?? (global._prisma = new PrismaClient());
