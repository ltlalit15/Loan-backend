import Repayment from "../Models/RepaymentsModel.js";
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";
import Customer from "../Models/CustumerModel.js";
export const FundingBalance = asyncHandler(async (req, res) => {
  // Get all approved withdrawals
  const withdrawals = await Withdraw.find({ withdrawStatus: "Approved" });

  // Get all repayments
  const repayments = await Repayment.find();

  // Get all customers
  const findCustomer = await Customer.find();

  // Total withdrawal amount
  const totalDrawn = withdrawals.reduce((acc, curr) => acc + Number(curr.withdrawAmount || 0), 0);

  // Total repayment amount
  const totalRepayments = repayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Remaining balance
  const remainingBalance = findCustomer.reduce((acc, curr) => acc + Number(curr.remainingRepayment || 0), 0);

  // Add type to each record
  const formattedWithdrawals = withdrawals.map((item) => ({
    ...item._doc,
    type: "withdraw"
  }));

  const formattedRepayments = repayments.map((item) => ({
    ...item._doc,
    type: "repayment"
  }));

  // Merge both arrays
  const mergedData = [...formattedWithdrawals, ...formattedRepayments];

  // Optional: Sort by date if both have common field like createdAt
  mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    summary: {
      totalDrawn,
      totalRepayments,
      remainingBalance
    },
    records: mergedData
  });
});

