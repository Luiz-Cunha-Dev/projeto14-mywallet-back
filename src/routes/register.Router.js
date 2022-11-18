import { postRegistro , getRegistro} from "../controllers/register.Controller.js"
import {Router} from "express"

const router = Router();

router.post("/registro", postRegistro);

router.get("/registro", getRegistro);



export default router;
