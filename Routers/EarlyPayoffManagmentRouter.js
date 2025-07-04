import express from "express";
import {
    earlyPayoffManage,
    getAllEarlyPayoffs,
    updateEarlyPayoffStatus
} from "../Controllers/EarlyPayoffManagmentCtrl.js";

import { authMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/earlyPayoff", earlyPayoffManage);
router.patch("/updateEarlyPayoffStatus/:id", authMiddleware, updateEarlyPayoffStatus);
router.get("/getAllEarlyPayoffs", getAllEarlyPayoffs);

export default router;
