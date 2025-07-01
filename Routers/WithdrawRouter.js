import express from "express";
import {
    createWithdraw,
    getAllWithdrawals,
    withdrawstatusupdate
} from "../Controllers/WithdrawCtrl.js";

const router = express.Router();

router.post("/withdrawpayment", createWithdraw);
router.get("/getallwithdrawpayment", getAllWithdrawals);
router.patch("/withdrawstatusupdate/:id", withdrawstatusupdate);

export default router;
