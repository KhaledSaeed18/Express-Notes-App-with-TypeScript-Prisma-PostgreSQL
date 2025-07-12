/*
    * User Repository
    * This file contains the UserRepository class which implements IUserRepository interface.
    * It provides methods to interact with the user data in the database.
*/

import { User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { CreateUserDTO } from '../types';

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
    // Create a new user
    async create(data: CreateUserDTO): Promise<User> {
        return await this.prisma.user.create({
            data,
        });
    }

    // Find a user by email
    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }

    // Find a user by ID
    async findById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    // Find a user by username
    async findByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { username },
        });
    }

    // Check if an email exists
    async emailExists(email: string): Promise<boolean> {
        return await this.exists(this.prisma.user, { email });
    }

    // Check if a username exists
    async usernameExists(username: string): Promise<boolean> {
        return await this.exists(this.prisma.user, { username });
    }

    // Update a user by ID
    async update(id: string, data: Partial<CreateUserDTO>): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }

    // Delete a user by ID
    async delete(id: string): Promise<User> {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
