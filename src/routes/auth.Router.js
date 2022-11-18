import { signUp, signIn, postStatus } from "../controllers/auth.Controller.js";
import {Router} from "express"

const router = Router();

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.post("/status", postStatus);



export default router;