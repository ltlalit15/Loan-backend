import DiscountModel from "../Models/DiscountModel.js";
import Custumer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";

export const getAllDiscounts = asyncHandler(async (req, res) => {
    const { customerId } = req.query;

    let filter = {};
    if (customerId) {
        filter.customerId = customerId;
    }
    const data = await DiscountModel.find(filter).populate("customerId", "customerName email");

    res.status(200).json({ success: true, data });
});

export const costomerearlypay = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  const customer = await Custumer.findById(customerId).select("customerName updatedAt");
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  const discount = await DiscountModel.findOne({ customerId });
  if (!discount) {
    return res.status(404).json({ success: false, message: "Discount not found for this customer" });
  }

  const updatedAt = new Date(customer.updatedAt);

  // Convert all date strings to Date objects
  const startTen = new Date(discount.startDateTen);
  const endTen = new Date(discount.endDateTen);
  const startFive = new Date(discount.startDateFive);
  const endFive = new Date(discount.endDateFive);

  let appliedDiscount = null;

  if (updatedAt >= startTen && updatedAt <= endTen) {
    appliedDiscount = `${discount.discountTen}%`;
  } else if (updatedAt >= startFive && updatedAt <= endFive) {
    appliedDiscount = `${discount.discountFive}%`;
  } else {
    appliedDiscount = "No discount available";
  }

  return res.status(200).json({
    success: true,
    customerName:customer.customerName,
    customerId,
    creditApprovedDate: updatedAt,
    appliedDiscount,
    message: "Discount check complete",

  });
});


export const createDiscount = asyncHandler(async (req, res) => {
    const { discountTen, startDateTen, endDateTen, discountFive, startDateFive, endDateFive, customerId } = req.body;

    const result = await DiscountModel.create({
        discountTen,
        startDateTen,
        endDateTen,
        discountFive,
        startDateFive,
        endDateFive,
        customerId
    });

    res.status(201).json({ success: true, message: "Discount created successfully", data: result });
});

export const updateDiscount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updated = await DiscountModel.findOneAndUpdate(
       { _id: id }
,
        { $set: req.body },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ success: false, message: "Discount not found for this customer." });
    }

    res.status(200).json({ success: true, message: "Discount updated successfully", data: updated });
});

export const deleteDiscount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await DiscountModel.findOneAndDelete({ _id: id });

    if (!deleted) {
        return res.status(404).json({ success: false, message: "No discount found to delete for this customer." });
    }

    res.status(200).json({ success: true, message: "Discount deleted successfully" });
});
