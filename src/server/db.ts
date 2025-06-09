// Prisma singleton
import { PrismaClient } from '@prisma/client';
declare global { var _prisma: PrismaClient | undefined; };
export const db = global._prisma ?? (global._prisma = new PrismaClient());
