import { postRegistro , getRegistro, deleteRegistro, putRegistro} from "../controllers/register.Controller.js"
import {Router} from "express"

const router = Router();

router.post("/registro", postRegistro);

router.get("/registro", getRegistro);

router.delete("/registro/:id", deleteRegistro);

router.put("/registro/:id", putRegistro);

export default router;
