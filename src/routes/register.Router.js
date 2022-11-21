import { postRegistro , getRegistro, deleteRegistro, putRegistro} from "../controllers/register.Controller.js";
import verificaToken from "../middlewares/tokenValidation.Middleware.js";
import verificaId from "../middlewares/IdValidation.Middleware.js";
import {Router} from "express"

const router = Router();

router.post("/registro", verificaToken, postRegistro);

router.get("/registro", verificaToken, getRegistro);

router.delete("/registro/:id", verificaToken, verificaId, deleteRegistro);

router.put("/registro/:id", verificaToken, verificaId, putRegistro);

export default router;
