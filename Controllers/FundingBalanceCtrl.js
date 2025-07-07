import Repayment from "../Models/RepaymentsModel.js";
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";
import Customer from "../Models/CustumerModel.js";

export const FundingBalance = asyncHandler(async (req, res) => {
  // Find all approved withdrawals
  const withdrawals = await Withdraw.find({ withdrawStatus: "Approved" });
  const findCustomer = await Customer.find();

  // Calculate total amount drawn
  const totalDrawn = withdrawals.reduce((acc, curr) => acc + Number(curr.withdrawAmount || 0), 0);

  // Find all repayments
  const repayments = await Repayment.find({});

  // Calculate total repayments
  const totalRepayments = repayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Remaining balance = totalDrawn - totalRepayment
  const remainingBalance = findCustomer.reduce((acc, curr) => acc + Number(curr.remainingRepayment || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      totalDrawn,
      remainingBalance:remainingBalance,
      totalRepayments
    }
  });
});
