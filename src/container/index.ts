import { PrismaClient } from '@prisma/client';
import { UserRepository, NoteRepository, type IUserRepository, type INoteRepository } from '../repository';
import { AuthService, NoteService, type IAuthService, type INoteService } from '../services';
import { AuthController, NoteController, type IAuthController, type INoteController } from '../controllers';

export interface IContainer {
    getUserRepository(): IUserRepository;
    getNoteRepository(): INoteRepository;
    getAuthService(): IAuthService;
    getNoteService(): INoteService;
    getAuthController(): IAuthController;
    getNoteController(): INoteController;
}

export class Container implements IContainer {
    private static instance: Container;
    private prisma: PrismaClient;
    private userRepository!: IUserRepository;
    private noteRepository!: INoteRepository;
    private authService!: IAuthService;
    private noteService!: INoteService;
    private authController!: IAuthController;
    private noteController!: INoteController;

    private constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.initializeRepositories();
        this.initializeServices();
        this.initializeControllers();
    }

    public static getInstance(prisma: PrismaClient): Container {
        if (!Container.instance) {
            Container.instance = new Container(prisma);
        }
        return Container.instance;
    }

    public static resetInstance(): void {
        Container.instance = null as any;
    }

    private initializeRepositories(): void {
        this.userRepository = new UserRepository(this.prisma);
        this.noteRepository = new NoteRepository(this.prisma);
    }

    private initializeServices(): void {
        this.authService = new AuthService(this.userRepository);
        this.noteService = new NoteService(this.noteRepository);
    }

    private initializeControllers(): void {
        this.authController = new AuthController(this.authService);
        this.noteController = new NoteController(this.noteService);
    }

    public getUserRepository(): IUserRepository {
        return this.userRepository;
    }

    public getNoteRepository(): INoteRepository {
        return this.noteRepository;
    }

    public getAuthService(): IAuthService {
        return this.authService;
    }

    public getNoteService(): INoteService {
        return this.noteService;
    }

    public getAuthController(): IAuthController {
        return this.authController;
    }

    public getNoteController(): INoteController {
        return this.noteController;
    }
}

export default Container;
