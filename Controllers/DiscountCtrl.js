import DiscountModel from "../Models/DiscountModel.js";
import Custumer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const getAllDiscounts = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  let filter = {};
  if (customerId) {
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: "Invalid customerId format" });
    }
    filter.customerId = new mongoose.Types.ObjectId(customerId);
  }

  // ✅ Include approvedAmount & totalRepayment in populate
  const data = await DiscountModel.find(filter).populate(
    "customerId",
    "customerName email approvedAmount totalRepayment"
  );

  const today = new Date();

  const result = await Promise.all(
    data.map(async (item) => {
      const approvedAmount = parseFloat(item.customerId?.approvedAmount || 0);
      const totalRepayment = parseFloat(item.customerId?.totalRepayment || 0);
      const factorRateAmount = totalRepayment - approvedAmount;

      const discountTen = parseFloat(item.discountTen || 0);
      const discountFive = parseFloat(item.discountFive || 0);

      const TenDicountAmount = (factorRateAmount * discountTen) / 100;
      const FiveDicountAmount = (factorRateAmount * discountFive) / 100;

      // Calculate Discount Ten Status
      let discountTenStatus = "N/A";
      if (item.startDateTen && item.endDateTen) {
        if (today > item.endDateTen) {
          discountTenStatus = "Expired";
        } else if (today >= item.startDateTen && today <= item.endDateTen) {
          discountTenStatus = "Active";
        }
      }

      // Calculate Discount Five Status
      let discountFiveStatus = "N/A";
      if (item.startDateFive && item.endDateFive) {
        if (today > item.endDateFive) {
          discountFiveStatus = "Expired";
        } else if (today >= item.startDateFive && today <= item.endDateFive) {
          discountFiveStatus = "Active";
        }
      }

      // ✅ Update status in DB
      await DiscountModel.findByIdAndUpdate(
        item._id,
        {
          discountTenStatus,
          discountFiveStatus,
        },
        { new: true }
      );

      let finalTenAmount = TenDicountAmount;
      let finalFiveAmount = FiveDicountAmount;

      if (item.discountStatus === "Used") {
        finalTenAmount = 0;
        finalFiveAmount = 0;
      }

      return {
        customerId: item.customerId?._id,
        _id: item?._id,
        customerName: item.customerId?.customerName,
        email: item.customerId?.email,
        discountTen: item.discountTen,
        startDateTen: item.startDateTen,
        endDateTen: item.endDateTen,
        discountFive: item.discountFive,
        startDateFive: item.startDateFive,
        endDateFive: item.endDateFive,
        discountStatus: item.discountStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        TenDicountAmount: finalTenAmount.toFixed(2),
        FiveDicountAmount: finalFiveAmount.toFixed(2),
      };

    })
  );

  res.status(200).json({ success: true, data: result });
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
    customerName: customer.customerName,
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
