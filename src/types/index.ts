// Common types and interfaces
export interface PaginationParams {
    skip?: number;
    take?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// User types
export interface CreateUserDTO {
    email: string;
    username: string;
    password: string;
}

export interface UserResponseDTO {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

// Note types
export interface CreateNoteDTO {
    title: string;
    content: string;
    userId: string;
}

export interface UpdateNoteDTO {
    title?: string;
    content?: string;
}

export interface NoteResponseDTO {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Auth types
export interface SignUpDTO {
    email: string;
    password: string;
}

export interface SignInDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    user: UserResponseDTO;
    accessToken?: string;
    refreshToken?: string;
}
