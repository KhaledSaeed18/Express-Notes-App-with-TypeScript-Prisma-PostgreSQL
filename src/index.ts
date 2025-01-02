import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import errorMiddleware from './middleware/error.middleware';

import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT!;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const version = process.env.API_VERSION!;
const baseUrl = `${process.env.BASE_URL!}/${version}`;

app.use(`${baseUrl}/auth`, authRoutes);
app.use(`${baseUrl}/note`, noteRoutes);


app.use(errorMiddleware)