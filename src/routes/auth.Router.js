import { signUp, signIn, postStatus, deleteSessao } from "../controllers/auth.Controller.js";
import verificaToken from "../middlewares/tokenValidation.Middleware.js";
import {Router} from "express"

const router = Router();

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.post("/status", verificaToken, postStatus);

router.delete("/sessao", verificaToken, deleteSessao);

export default router;