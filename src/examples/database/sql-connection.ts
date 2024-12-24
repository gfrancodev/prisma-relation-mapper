import { PrismaClient } from "@prisma/client";

const sqlConnection = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const prisma = sqlConnection;
