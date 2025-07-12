import { PrismaClient } from '@prisma/client';
import { PaginationParams } from '../types';

export abstract class BaseRepository {
    protected prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Generic method to check if a record exists
     */
    protected async exists(model: any, where: any): Promise<boolean> {
        const record = await model.findFirst({
            where,
            select: { id: true }
        });
        return record !== null;
    }

    /**
     * Generic method to count records
     */
    protected async count(model: any, where?: any): Promise<number> {
        return await model.count({ where });
    }

    /**
     * Generic method to find many with pagination
     */
    protected async findManyWithPagination<T>(
        model: any,
        where?: any,
        orderBy?: any,
        pagination?: PaginationParams
    ): Promise<T[]> {
        return await model.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: pagination?.take,
        });
    }
}
