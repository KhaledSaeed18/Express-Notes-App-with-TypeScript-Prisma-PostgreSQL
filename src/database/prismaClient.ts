import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectPrisma() {
    try {
        await prisma.$connect();
        console.log('Prisma connected to database successfully');
    } catch (error) {
        console.error('Prisma failed to connect:', error);
    }
}

connectPrisma();

export default prisma;
