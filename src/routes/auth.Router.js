import { signUp, signIn, postStatus, deleteSessao } from "../controllers/auth.Controller.js";
import {Router} from "express"

const router = Router();

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.post("/status", postStatus);

router.delete("/sessao", deleteSessao);

export default router;