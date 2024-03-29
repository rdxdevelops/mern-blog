import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signup);

export default router