import express from "express";
import {
    createWithdraw,
    getAllWithdrawals,
} from "../Controllers/WithdrawCtrl.js";

const router = express.Router();

router.post("/withdrawpayment", createWithdraw);
router.get("/getallwithdrawpayment", getAllWithdrawals);

export default router;
