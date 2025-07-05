import asyncHandler from "express-async-handler";
import CreditUpgrade from "../Models//CreditUpgardeRequestModel.js";

// ✅ Create request
export const createCreditUpgrade = asyncHandler(async (req, res) => {
  const { customerId, requestedAmount } = req.body;

  const newRequest = await CreditUpgrade.create({
    customerId,
    requestedAmount,
  });

  res.status(201).json({
    message: "Credit upgrade request created",
    data: newRequest,
  });
});

// ✅ Get all requests
export const getAllCreditUpgrades = asyncHandler(async (req, res) => {
  const data = await CreditUpgrade.find().populate("customerId", "customerName email totalRepayment remainingRepayment");

  const modifiedData = data.map((item) => {
    const customer = item.customerId;

    let repaymentDonePercent = 0;

    if (customer?.totalRepayment && customer?.remainingRepayment) {
      const total = parseFloat(customer.totalRepayment);
      const remaining = parseFloat(customer.remainingRepayment);

      if (total > 0) {
        repaymentDonePercent = ((total - remaining) / total) * 100;
      }
    }

    return {
      ...item._doc,
      repaymentDonePercent: repaymentDonePercent.toFixed(2) + '%',
    };
  });

  res.status(200).json({
    message: "All credit upgrade requests with repayment percent",
    data: modifiedData,
  });
});

// ✅ Get one by ID
export const getCreditUpgradeById = asyncHandler(async (req, res) => {
  const { customerId } = req.query;
  const request = await CreditUpgrade.findById({customerId:customerId}).populate("customerId");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json({ data: request });
});

export const updateCreditUpgradeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { creditUpgradeStatus } = req.body;

  const updated = await CreditUpgrade.findByIdAndUpdate(
    id,
    { creditUpgradeStatus },
    { new: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json({
    message: "Status updated",
    data: updated,
  });
});

// ✅ Delete request
export const deleteCreditUpgrade = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await CreditUpgrade.findByIdAndDelete(id);

  if (!deleted) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json({ message: "Request deleted" });
});
