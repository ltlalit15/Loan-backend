import express from "express";
import {
    getReport
} from "../Controllers/ReportCtrl.js";

import { authMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/report", authMiddleware, isAdmin, getReport);

export default router;
