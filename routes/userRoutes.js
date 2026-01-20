import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { syncUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/sync", verifyToken, syncUser);

export default router;
