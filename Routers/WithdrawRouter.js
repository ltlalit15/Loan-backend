import express from "express";
import {
    createWithdraw,
    getAllWithdrawals,
    withdrawstatusupdate,
    getWeeklyWithdrawalsByCustomerId
} from "../Controllers/WithdrawCtrl.js";

import { authMiddleware, isAdmin, isCustumer } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/withdrawpayment", createWithdraw);
router.get("/getallwithdrawpayment", getAllWithdrawals);
router.patch("/withdrawstatusupdate/:id", withdrawstatusupdate);
router.get("/getWithdrwByCustumerId/:customerId", getWeeklyWithdrawalsByCustomerId)

export default router;
