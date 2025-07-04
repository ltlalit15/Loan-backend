import EarlyPayoff from "../Models/EarlyPayoffManagmentModel.js";

import asyncHandler from "express-async-handler";

export const earlyPayoffManage = asyncHandler(async (req, res) => {
  const { customerId, earlyPayAmount, discount, earlyPayoffStatus } = req.body;

  const newEarlyPayoff = await EarlyPayoff.create({
    customerId,
    earlyPayAmount,
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
  const allRequests = await EarlyPayoff.find().populate("customerId", "customerName email phoneNumber");

  res.status(200).json({
    message: "All early payoff requests fetched",
    data: allRequests,
  });
});

