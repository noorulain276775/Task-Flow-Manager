import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser, login } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", login);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
