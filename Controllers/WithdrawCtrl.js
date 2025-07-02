// Controllers/WithdrawController.js
import Withdraw from "../Models/WithdrawModel.js";
import Custumer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const createWithdraw = asyncHandler(async (req, res) => {
  const {
    customerId,
    approvedCreditLine,
    availableAmount,
    withdrawAmount
  } = req.body;

  const remainingCreditLine = availableAmount - withdrawAmount
  const withdraw = await Withdraw.create({
    customerId: new mongoose.Types.ObjectId(customerId),
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
  console.log("withdrawStatusCustomer", withdrawStatusCustomer);
  const withdrawcustomerId = withdrawStatusCustomer?.customerId
  const withdrawAmount = withdrawStatusCustomer?.withdrawAmount
  const findCustomerAndUpdate = await Custumer.findByIdAndUpdate({ _id: withdrawcustomerId },
    // {availableBalance:}
  )
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

export const getWithdrwByCustomerId = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const withdrawals = await Withdraw.find({ customerId }).populate({
    path: 'customerId',
    select: 'customerName'
  });

  // flatten the populated customerId object
  const result = withdrawals.map((withdraw) => ({
    ...withdraw._doc,
    customerId: withdraw.customerId?._id,
    customerName: withdraw.customerId?.customerName
  }));

  res.status(200).json({
    message: "All withdrawals fetched successfully ✅",
    result,
  });
});
