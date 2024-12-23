import { Router } from "express";
import { CreateUserController, LoginUserController, LogoutController, ProfileController } from "../controllers/User.controller.js";
import { body } from "express-validator";
import { IsUserAuthenticated } from "../middleware/Auth.js";

const router = Router();


router.post('/register',
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:8,max:20}).withMessage('Invalid Password')
    ,CreateUserController)

router.post('/login',
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:8,max:20}).withMessage('Invalid Password')
    ,LoginUserController)

router.get('/profile',IsUserAuthenticated,ProfileController )
router.get('/logout',IsUserAuthenticated,LogoutController)



export {router as UserRouter}