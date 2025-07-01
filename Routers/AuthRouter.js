// routes/paymentRoutes.js
import express from "express";
import { logins, changePassword } from "../Controllers/AuthCtrl.js";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", logins);
router.patch("/change-password/:id", changePassword);

export default router;
