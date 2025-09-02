import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register); // create first admin, then you can disable this route if you like
router.post("/login", login);

export default router;
