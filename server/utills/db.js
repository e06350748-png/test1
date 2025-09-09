const { PrismaClient } = require('@prisma/client');

let prisma;

if (global.prisma) {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  global.prisma = prisma;
}

// Handle missing fields gracefully
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    if (error.code === 'P2022') {
      console.warn(`Warning: Column not found in database: ${error.meta?.column}`);
      if (params.action === 'findMany') return [];
      if (params.action === 'findUnique' || params.action === 'findFirst') return null;
    }
    throw error;
  }
});

module.exports = prisma;
