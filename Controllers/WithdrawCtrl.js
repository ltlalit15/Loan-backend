// Controllers/WithdrawController.js
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";

export const createWithdraw = asyncHandler(async (req, res) => {
  const {
    custumerId,
    approvedCreditLine,
    availableAmount,
    withdrawAmount
  } = req.body;

  const remainingCreditLine = availableAmount - withdrawAmount
  const withdraw = await Withdraw.create({
    custumerId,
    approvedCreditLine,
    availableAmount,
    withdrawAmount,
    remainingCreditLine
  });

  res.status(201).json({
    message: `${withdrawAmount} Withdrawal successfully`,
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

export const withdrawstatusupdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { withdrawStatus } = req.body;

  const withdrawStatusCustomer = await Withdraw.findByIdAndUpdate(
    id,
    { withdrawStatus },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!withdrawStatusCustomer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json({
    message: "Customer  withdrawStatus successfully ✅",
    customerId: withdrawStatusCustomer._id,
    withdrawStatus: withdrawStatusCustomer.withdrawStatus,
  });
});