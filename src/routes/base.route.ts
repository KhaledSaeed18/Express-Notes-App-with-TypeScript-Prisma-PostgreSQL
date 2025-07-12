import express, { Router } from "express";
import { Container } from "../container";
import prisma from "../database/prismaClient";

export abstract class BaseRoute {
    protected router: Router;
    protected container: Container;

    constructor() {
        this.router = express.Router();
        this.container = Container.getInstance(prisma);
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    protected abstract initializeRoutes(): void;
}
