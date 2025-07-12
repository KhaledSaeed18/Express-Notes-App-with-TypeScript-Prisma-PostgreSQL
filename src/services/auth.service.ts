import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { IUserRepository } from '../repository';
import { generateAccessToken, generateRefreshToken, generateUniqueUsername } from '../utils';
import { SignUpDTO, SignInDTO, AuthResponseDTO, UserResponseDTO } from '../types';
import { ConflictError, AuthenticationError, NotFoundError, ValidationError } from '../errors';

export interface IAuthService {
    signUp(data: SignUpDTO): Promise<AuthResponseDTO>;
    signIn(data: SignInDTO): Promise<AuthResponseDTO>;
    refreshToken(userId: string): Promise<{ accessToken: string }>;
    validateUser(userId: string): Promise<UserResponseDTO>;
}

export class AuthService implements IAuthService {
    constructor(private userRepository: IUserRepository) { }

    async signUp(data: SignUpDTO): Promise<AuthResponseDTO> {
        const { email, password } = data;

        // Validate input
        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        // Check if user already exists
        const userExists = await this.userRepository.emailExists(email);
        if (userExists) {
            throw new ConflictError('User already exists');
        }

        // Generate unique username
        const emailPrefix = email.split('@')[0];
        const username = await generateUniqueUsername(emailPrefix);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await this.userRepository.create({
            email,
            username,
            password: hashedPassword,
        });

        // Convert to response DTO
        const userResponse = this.toUserResponseDTO(user);
        return { user: userResponse };
    }

    async signIn(data: SignInDTO): Promise<AuthResponseDTO> {
        const { email, password } = data;

        // Validate input
        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        // Find user
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Convert to response DTO
        const userResponse = this.toUserResponseDTO(user);
        return {
            user: userResponse,
            accessToken,
            refreshToken
        };
    }

    async refreshToken(userId: string): Promise<{ accessToken: string }> {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const accessToken = generateAccessToken(userId);
        return { accessToken };
    }

    async validateUser(userId: string): Promise<UserResponseDTO> {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return this.toUserResponseDTO(user);
    }

    private toUserResponseDTO(user: User): UserResponseDTO {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
