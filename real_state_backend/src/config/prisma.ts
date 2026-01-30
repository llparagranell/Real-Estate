import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
// @ts-ignore - Prisma 7.x ESM compatibility issue
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };