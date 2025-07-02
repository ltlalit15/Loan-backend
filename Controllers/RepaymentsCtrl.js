// Controllers/WithdrawController.js
import Repayment from "../Models/RepaymentsModel.js";
import asyncHandler from "express-async-handler";

export const repayments = asyncHandler(async (req, res) => {
  const {
    customerId,
    payAmount
  } = req.body;

  const Pay = await Repayment.create({
    customerId,
    payAmount
  });

  res.status(201).json({
    message: `Paid successfully`,
    Pay,
  });
});

export const getrepayments = asyncHandler(async (req, res) => {
  const { customerId, payAmount } = req.body;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const existingRepayment = await Repayment.findOne({
    customerId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  if (existingRepayment) {
    res.status(400);
    throw new Error("Repayment already exists for this month ❌");
  }

  const Pay = await Repayment.create({
    customerId,
    payAmount,
  });

  res.status(201).json({
    message: "Paid successfully ✅",
    Pay,
  });
});

export const paymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { payStatus } = req.body;

  const updatedpayStatus = await Repayment.findByIdAndUpdate(
    id,
    { payStatus },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedpayStatus) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json({
    message: "Pay status updated successfully",
    customerId: updatedpayStatus._id,
    updatedStatus: updatedpayStatus.payStatus,
  });
});