// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// دالة ترجع PrismaClient جديد
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"], 
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// نخلي Prisma global عشان ما يتعملش منه نسخة جديدة في كل ريلود
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// نستخدم الـ singleton أو نعمل واحد جديد
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// في وضع التطوير، نخزن النسخة في global لتجنب تكرار الـ prepared statements
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
