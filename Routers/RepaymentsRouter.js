import express from "express";
import {
    repayments,
} from "../Controllers/RepaymentsCtrl.js";

import { authMiddleware, isAdmin, isCustumer } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/repayments", authMiddleware, isCustumer, repayments);

export default router;
