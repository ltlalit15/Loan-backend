// Controllers/WithdrawController.js
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";

export const createWithdraw = asyncHandler(async (req, res) => {
  const {
    custumerId,
    approvedCreditLine,
    availableAmount,
    withdrawAmount,
    rateFactor,
  } = req.body;

  const withdraw = await Withdraw.create({
    custumerId,
    approvedCreditLine,
    availableAmount,
    withdrawAmount,
    rateFactor,
  });

  res.status(201).json({
    message: "Withdrawal created successfully",
    withdraw,
  });
});

export const getAllWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdraw.find();
  res.status(200).json({
    message: "All withdrawals fetched successfully ✅",
    total: withdrawals.length,
    withdrawals,
  });
});
