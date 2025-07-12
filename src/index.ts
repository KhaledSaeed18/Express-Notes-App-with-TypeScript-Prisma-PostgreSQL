import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { errorMiddleware } from './middleware';
import { authRoutes, noteRoutes } from './routes';

dotenv.config();

const app = express();

const corsOptions = {
    origin: [process.env.CLIENT_URL!],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());

const port = process.env.PORT!;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const version = process.env.API_VERSION!;
const baseUrl = `${process.env.BASE_URL!}/${version}`;

app.use(`${baseUrl}/auth`, authRoutes);
app.use(`${baseUrl}/note`, noteRoutes);

app.all('*', (req, res) => {
    res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    })
})

app.use(errorMiddleware)