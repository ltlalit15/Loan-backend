import Repayment from "../Models/RepaymentsModel.js";
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";

export const FundingBalance = asyncHandler(async (req, res) => {
  // Withdrawals
  const withdrawals = await Withdraw.aggregate([
    { $match: { withdrawStatus: "Approved" } },
    {
      $addFields: {
        amount: { $toDouble: "$withdrawAmount" },
        type: "Draw",
        date: "$createdAt"
      }
    },
    {
      $project: {
        _id: 0,
        amount: 1,
        type: 1,
        date: 1
      }
    }
  ]);

  // Repayments
  const repayments = await Repayment.aggregate([
    { $match: { repaymentStatus: "Paid" } },
    {
      $addFields: {
        amount: { $toDouble: "$repaymentAmount" },
        type: "Repayment",
        date: "$createdAt"
      }
    },
    {
      $project: {
        _id: 0,
        amount: 1,
        type: 1,
        date: 1
      }
    }
  ]);

  // Totals
  const totalDrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0);
  const totalRepayments = repayments.reduce((sum, t) => sum + t.amount, 0);
  const remainingBalance = totalDrawn - totalRepayments;

  // Merge and sort logs
  const transactionLog = [...withdrawals, ...repayments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  res.status(200).json({
    success: true,
    totalDrawn,
    totalRepayments,
    remainingBalance,
    transactionLog
  });
});
