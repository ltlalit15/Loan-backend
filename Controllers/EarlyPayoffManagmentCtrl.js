import EarlyPayoff from "../Models/EarlyPayoffManagmentModel.js";
import Custumer from "../Models/CustumerModel.js";

import asyncHandler from "express-async-handler";

export const earlyPayoffManage = asyncHandler(async (req, res) => {
  const { customerId, earlyPayAmount, discount } = req.body;

  const customer = await Custumer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  console.log("customer?.updatedAt== new Date()", customer?.updatedAt == new Date());
  // if (customer?.updatedAt== new Date()) {

  // }

  const totalRepayment = parseFloat(customer.totalRepayment);
  const paidAmount = parseFloat(earlyPayAmount);

  // let earlyPayoffStatus = "";

  // if (paidAmount >= totalRepayment) {
  //   earlyPayoffStatus = "100% Paid";
  // } else if (paidAmount >= totalRepayment * 0.5) {
  //   earlyPayoffStatus = "50% Paid";
  // } else {
  //   earlyPayoffStatus = "Less than 50% Paid";
  // }

  const newEarlyPayoff = await EarlyPayoff.create({
    customerId,
    earlyPayAmount: paidAmount,
    discount,
    earlyPayoffStatus,
  });

  res.status(201).json({
    message: "Early payoff request created successfully",
    data: newEarlyPayoff,
  });
});

export const updateEarlyPayoffStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { earlyPayoffStatus } = req.body;

  const updated = await EarlyPayoff.findByIdAndUpdate(
    id,
    { earlyPayoffStatus },
    { new: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Early payoff request not found");
  }

  res.status(200).json({
    message: "Early payoff status updated successfully",
    data: updated,
  });
});


export const getAllEarlyPayoffs = asyncHandler(async (req, res) => {
  const { id, customerId } = req.query;

  let filter = {};

  if (id) {
    filter._id = id;
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  const allRequests = await EarlyPayoff.find(filter).populate(
    "customerId",
    "customerName email phoneNumber"
  );

  res.status(200).json({
    message: "Early payoff request(s) fetched",
    data: allRequests,
  });
});
