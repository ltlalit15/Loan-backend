import Repayment from "../Models/RepaymentsModel.js";
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";

export const getReport = asyncHandler(async (req, res) => {
  const { customerId, reportType, startDate, endDate } = req.query;

  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  let customerFilter = {};
  if (customerId) {
    customerFilter.customerId = customerId;
  }

  const filters = {
    ...customerFilter,
    ...dateFilter,
  };

  let result;

  switch (reportType) {
    case "Draw History":
      result = await Withdraw.find(filters).sort({ createdAt: -1 });
      break;

    case "Repayment Logs":
      result = await Repayment.find(filters).sort({ createdAt: -1 });
      break;

    default:
      return res.status(400).json({ message: "Invalid report type." });
  }

  res.status(200).json({
    message: `${reportType} fetched successfully`,
    count: result.length,
    data: result,
  });
});
