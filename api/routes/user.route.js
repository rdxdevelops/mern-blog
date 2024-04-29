import { Router } from "express";
import {
  deleteUser,
  updateUser,
  signout,
  getUsers,
  getUserInfo
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get('/:userId', getUserInfo)

export default router;
