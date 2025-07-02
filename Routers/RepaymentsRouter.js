import express from "express";
import {
    repayments,
    getrepayments,
    paymentStatus
} from "../Controllers/RepaymentsCtrl.js";

import { authMiddleware, isAdmin, isCustumer } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/repayments", repayments);
router.get("/getrepayments", getrepayments);
router.patch("/paymentStatus/:id", paymentStatus);

export default router;
