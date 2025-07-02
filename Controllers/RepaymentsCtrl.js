// Controllers/WithdrawController.js
import Repayment from "../Models/RepaymentsModel.js";
import asyncHandler from "express-async-handler";

export const repayments = asyncHandler(async (req, res) => {
    const {
        customerId,
        payAmount,
        withdrawAmount
    } = req.body;

    const Pay = await Repayment.create({
        customerId,
        payAmount,
        withdrawAmount,
    });

    res.status(201).json({
        message: `Paid successfully`,
        Pay,
    });
});
