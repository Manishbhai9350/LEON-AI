import {Router} from 'express';
import { GenerateResult } from '../services/Gemini.js';
import { IsUserAuthenticated } from '../middleware/Auth.js';
import { GetAIResult } from '../controllers/Gemini.controller.js';

const router = new Router()


router.get('/result',IsUserAuthenticated,GetAIResult)


export {router as GeminiRouter}