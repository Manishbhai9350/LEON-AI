import { configDotenv } from 'dotenv';
configDotenv()
import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';
import {CONNECT} from './services/DB/DB.js'
import { UserRouter } from './Routes/User.routes.js';
import morgan from 'morgan';
import cors from 'cors';
import { ProjectRouter } from './Routes/Project.routes.js';
import { GeminiRouter } from './Routes/Gemini.routes.js';

const app = express();

CONNECT()

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use(cors({
    origin:process.env.CLIENT_URI,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true,
    preflightContinue:true,
}))
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan(process.env.ENV))

app.use('/user',UserRouter)
app.use('/project',ProjectRouter)
app.use('/ai',GeminiRouter)

export {app}