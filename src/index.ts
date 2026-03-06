import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(env.port, () => {
      console.log(`MAikUp API server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
      console.log(`Health check: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
