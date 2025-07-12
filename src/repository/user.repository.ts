import { User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { CreateUserDTO, UserResponseDTO } from '../types';

export interface IUserRepository {
    create(data: CreateUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    emailExists(email: string): Promise<boolean>;
    usernameExists(username: string): Promise<boolean>;
    update(id: string, data: Partial<CreateUserDTO>): Promise<User>;
    delete(id: string): Promise<User>;
}

export class UserRepository extends BaseRepository implements IUserRepository {
    async create(data: CreateUserDTO): Promise<User> {
        return await this.prisma.user.create({
            data,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { username },
        });
    }

    async emailExists(email: string): Promise<boolean> {
        return await this.exists(this.prisma.user, { email });
    }

    async usernameExists(username: string): Promise<boolean> {
        return await this.exists(this.prisma.user, { username });
    }

    async update(id: string, data: Partial<CreateUserDTO>): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<User> {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
