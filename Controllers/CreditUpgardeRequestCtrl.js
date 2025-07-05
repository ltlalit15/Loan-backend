import asyncHandler from "express-async-handler";
import CreditUpgrade from "../Models/CreditUpgardeRequestModel.js";
import Customer from "../Models/CustumerModel.js";

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
  const data = await CreditUpgrade.find().populate(
    "customerId",
    "customerName email totalRepayment remainingRepayment"
  );

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
      _id: item._id,
      customerId: customer._id,
      customerName: customer.customerName,
      requestedAmount: item.requestedAmount,
      creditUpgradeStatus: item.creditUpgradeStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      __v: item.__v,
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
  const request = await CreditUpgrade.findById({ customerId: customerId }).populate("customerId");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json({ data: request });
});


export const updateCreditUpgradeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { creditUpgradeStatus } = req.body;

  // Step 1: Find the Credit Upgrade Request
  const findCustomer = await CreditUpgrade.findById(id);
  if (!findCustomer) {
    res.status(404);
    throw new Error("Credit upgrade request not found");
  }

  const customerId = findCustomer?.customerId;

  // Step 2: Get full customer details
  const customerDetails = await Customer.findById(customerId);
  if (!customerDetails) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Step 3: Eligibility Logic
  const creditLine = parseFloat(customerDetails.creditLine || 0);
  const availBalance = parseFloat(customerDetails.availBalance || 0);
  const totalRepayment = parseFloat(customerDetails.totalRepayment || 0);
  const remainingRepayment = parseFloat(customerDetails.remainingRepayment || 0);

  // Calculations
  const fundsUsed = creditLine - availBalance;
  const amountPaid = totalRepayment - remainingRepayment;

  const percentUsed = (fundsUsed / creditLine) * 100;
  const percentPaid = (amountPaid / totalRepayment) * 100;

  // Step 4: Check Eligibility
  if (percentUsed >= 50 && percentPaid >= 50) {
    // ✅ Eligible - Update the creditUpgradeStatus
    const updated = await CreditUpgrade.findByIdAndUpdate(
      id,
      { creditUpgradeStatus },
      { new: true }
    );

    return res.status(200).json({
      message: "Status updated - customer is eligible",
      data: updated,
      eligibility: {
        percentUsed: percentUsed.toFixed(2),
        percentPaid: percentPaid.toFixed(2),
      },
    });
  } else {
    // ❌ Not eligible
    return res.status(400).json({
      message: "Customer is not eligible for credit upgrade",
      reason: {
        percentUsed: percentUsed.toFixed(2),
        percentPaid: percentPaid.toFixed(2),
      },
    });
  }
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
