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

app.use(cors({
    origin:'*',
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