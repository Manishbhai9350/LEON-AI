import { Router } from "express";
import { IsUserAuthenticated } from "../middleware/Auth.js";
import { AddUserToProjectController, CreateProjectController, GetAllProjectsController, GetProjectController, UpdateFileSystem } from "../controllers/Project.controller.js";


const router = Router()


router.post('/create',IsUserAuthenticated,CreateProjectController) 
router.put('/add-user',IsUserAuthenticated,AddUserToProjectController)
router.get('/all',IsUserAuthenticated,GetAllProjectsController)
router.get('/get-project/:projectID',IsUserAuthenticated,GetProjectController)
router.put('/update-file-system/:projectID',IsUserAuthenticated,UpdateFileSystem)


export {router as ProjectRouter}