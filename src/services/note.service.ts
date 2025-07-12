import { Note } from '@prisma/client';
import { INoteRepository } from '../repository';
import { CreateNoteDTO, UpdateNoteDTO, NoteResponseDTO, PaginationParams, PaginatedResult } from '../types';
import { NotFoundError, ValidationError, AuthorizationError } from '../errors';

export interface INoteService {
    createNote(userId: string, data: Omit<CreateNoteDTO, 'userId'>): Promise<NoteResponseDTO>;
    getUserNotes(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<NoteResponseDTO>>;
    searchUserNotes(userId: string, query: string, pagination?: PaginationParams): Promise<PaginatedResult<NoteResponseDTO>>;
    getNoteById(userId: string, noteId: string): Promise<NoteResponseDTO>;
    updateNote(userId: string, noteId: string, data: UpdateNoteDTO): Promise<NoteResponseDTO>;
    deleteNote(userId: string, noteId: string): Promise<NoteResponseDTO>;
    validateNoteOwnership(userId: string, noteId: string): Promise<void>;
}

export class NoteService implements INoteService {
    constructor(private noteRepository: INoteRepository) { }

    async createNote(userId: string, data: Omit<CreateNoteDTO, 'userId'>): Promise<NoteResponseDTO> {
        const { title, content } = data;

        // Create note (validation is handled by middleware)
        const note = await this.noteRepository.create({
            title: title.trim(),
            content: content.trim(),
            userId,
        });

        return this.toNoteResponseDTO(note);
    }

    async getUserNotes(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<NoteResponseDTO>> {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        const [notes, total] = await Promise.all([
            this.noteRepository.findByUserId(userId, pagination),
            this.noteRepository.countByUserId(userId),
        ]);

        const notesDTO = notes.map(note => this.toNoteResponseDTO(note));

        return {
            data: notesDTO,
            total,
            page: pagination?.skip && pagination?.take ? Math.floor(pagination.skip / pagination.take) + 1 : undefined,
            limit: pagination?.take,
            totalPages: pagination?.take ? Math.ceil(total / pagination.take) : undefined,
        };
    }

    async searchUserNotes(userId: string, query: string, pagination?: PaginationParams): Promise<PaginatedResult<NoteResponseDTO>> {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        if (!query || query.trim().length === 0) {
            throw new ValidationError('Search query is required');
        }

        const searchQuery = query.trim();

        const [notes, total] = await Promise.all([
            this.noteRepository.searchByUserId(userId, searchQuery, pagination),
            this.noteRepository.countSearchByUserId(userId, searchQuery),
        ]);

        const notesDTO = notes.map(note => this.toNoteResponseDTO(note));

        return {
            data: notesDTO,
            total,
            page: pagination?.skip && pagination?.take ? Math.floor(pagination.skip / pagination.take) + 1 : undefined,
            limit: pagination?.take,
            totalPages: pagination?.take ? Math.ceil(total / pagination.take) : undefined,
        };
    }

    async getNoteById(userId: string, noteId: string): Promise<NoteResponseDTO> {
        if (!userId || !noteId) {
            throw new ValidationError('User ID and Note ID are required');
        }

        await this.validateNoteOwnership(userId, noteId);

        const note = await this.noteRepository.findByIdAndUserId(noteId, userId);
        if (!note) {
            throw new NotFoundError('Note not found');
        }

        return this.toNoteResponseDTO(note);
    }

    async updateNote(userId: string, noteId: string, data: UpdateNoteDTO): Promise<NoteResponseDTO> {
        if (!userId || !noteId) {
            throw new ValidationError('User ID and Note ID are required');
        }

        await this.validateNoteOwnership(userId, noteId);

        // Prepare update data (validation is handled by middleware)
        const updateData: UpdateNoteDTO = {};
        if (data.title !== undefined) updateData.title = data.title.trim();
        if (data.content !== undefined) updateData.content = data.content.trim();

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            throw new ValidationError('No valid fields to update');
        }

        const updatedNote = await this.noteRepository.update(noteId, updateData);
        return this.toNoteResponseDTO(updatedNote);
    }

    async deleteNote(userId: string, noteId: string): Promise<NoteResponseDTO> {
        if (!userId || !noteId) {
            throw new ValidationError('User ID and Note ID are required');
        }

        await this.validateNoteOwnership(userId, noteId);

        const deletedNote = await this.noteRepository.delete(noteId);
        return this.toNoteResponseDTO(deletedNote);
    }

    async validateNoteOwnership(userId: string, noteId: string): Promise<void> {
        const noteExists = await this.noteRepository.noteExists(noteId);
        if (!noteExists) {
            throw new NotFoundError('Note not found');
        }

        const userOwnsNote = await this.noteRepository.userOwnsNote(noteId, userId);
        if (!userOwnsNote) {
            throw new AuthorizationError('You do not have permission to access this note');
        }
    }

    private toNoteResponseDTO(note: Note): NoteResponseDTO {
        return {
            id: note.id,
            title: note.title,
            content: note.content,
            userId: note.userId,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        };
    }
}
