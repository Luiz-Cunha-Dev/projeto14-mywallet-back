import { postRegistro , getRegistro, deleteRegistro} from "../controllers/register.Controller.js"
import {Router} from "express"

const router = Router();

router.post("/registro", postRegistro);

router.get("/registro", getRegistro);

router.delete("/registro/:id", deleteRegistro);



export default router;
