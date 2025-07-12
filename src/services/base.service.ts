import { AppError } from '../errors';

export abstract class BaseService {
    protected handleError(error: unknown): never {
        if (error instanceof AppError) {
            throw error;
        }

        if (error instanceof Error) {
            throw new AppError(error.message, 500);
        }

        throw new AppError('An unexpected error occurred', 500);
    }

    protected validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
        }
    }

    protected sanitizeString(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }

    protected isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
