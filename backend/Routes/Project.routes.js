import { Router } from "express";
import { IsUserAuthenticated } from "../middleware/Auth.js";
import { AddUserToProjectController, CreateProjectController, GetAllProjectsController, GetProjectController } from "../controllers/Project.controller.js";


const router = Router()

router.post('/create',IsUserAuthenticated,CreateProjectController)
router.put('/add-user',IsUserAuthenticated,AddUserToProjectController)
router.get('/all',IsUserAuthenticated,GetAllProjectsController)
router.get('/get-project/:projectID',IsUserAuthenticated,GetProjectController)


export {router as ProjectRouter}