import { Note } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { CreateNoteDTO, UpdateNoteDTO, PaginationParams } from '../types';

export interface INoteRepository {
    create(data: CreateNoteDTO): Promise<Note>;
    findById(id: string): Promise<Note | null>;
    findByIdAndUserId(id: string, userId: string): Promise<Note | null>;
    findByUserId(userId: string, pagination?: PaginationParams): Promise<Note[]>;
    searchByUserId(userId: string, query: string, pagination?: PaginationParams): Promise<Note[]>;
    countByUserId(userId: string): Promise<number>;
    countSearchByUserId(userId: string, query: string): Promise<number>;
    update(id: string, data: UpdateNoteDTO): Promise<Note>;
    delete(id: string): Promise<Note>;
    noteExists(id: string): Promise<boolean>;
    userOwnsNote(noteId: string, userId: string): Promise<boolean>;
}

export class NoteRepository extends BaseRepository implements INoteRepository {
    async create(data: CreateNoteDTO): Promise<Note> {
        return await this.prisma.note.create({
            data,
        });
    }

    async findById(id: string): Promise<Note | null> {
        return await this.prisma.note.findUnique({
            where: { id },
        });
    }

    async findByIdAndUserId(id: string, userId: string): Promise<Note | null> {
        return await this.prisma.note.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async findByUserId(userId: string, pagination?: PaginationParams): Promise<Note[]> {
        return await this.findManyWithPagination<Note>(
            this.prisma.note,
            { userId },
            { createdAt: 'desc' },
            pagination
        );
    }

    async searchByUserId(userId: string, query: string, pagination?: PaginationParams): Promise<Note[]> {
        return await this.findManyWithPagination<Note>(
            this.prisma.note,
            {
                userId,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            { createdAt: 'desc' },
            pagination
        );
    }

    async countByUserId(userId: string): Promise<number> {
        return await this.count(this.prisma.note, { userId });
    }

    async countSearchByUserId(userId: string, query: string): Promise<number> {
        return await this.count(this.prisma.note, {
            userId,
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
            ],
        });
    }

    async update(id: string, data: UpdateNoteDTO): Promise<Note> {
        return await this.prisma.note.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Note> {
        return await this.prisma.note.delete({
            where: { id },
        });
    }

    async noteExists(id: string): Promise<boolean> {
        return await this.exists(this.prisma.note, { id });
    }

    async userOwnsNote(noteId: string, userId: string): Promise<boolean> {
        return await this.exists(this.prisma.note, { id: noteId, userId });
    }
}
