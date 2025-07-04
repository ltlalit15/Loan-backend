import express from "express";
import {
    earlyPayoffManage,
    getAllEarlyPayoffs
} from "../Controllers/EarlyPayoffManagmentCtrl.js";

import { authMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/earlyPayoffManage", authMiddleware, earlyPayoffManage);
router.get("/earlyPayoffManage", authMiddleware, earlyPayoffManage);
router.get("/getAllEarlyPayoffs", authMiddleware, getAllEarlyPayoffs);

export default router;
