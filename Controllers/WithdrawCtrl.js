// Controllers/WithdrawController.js
import Withdraw from "../Models/WithdrawModel.js";
import Custumer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const createWithdraw = asyncHandler(async (req, res) => {
  const {
    customerId,
    approvedCreditLine,
    availableAmount,
    remainingCreditLine,
    withdrawAmount
  } = req.body;

  const withdraw = await Withdraw.create({
    customerId: new mongoose.Types.ObjectId(customerId),
    approvedCreditLine,
    availableAmount,
    withdrawAmount,
    remainingCreditLine
  });

  res.status(201).json({
    message: `${withdrawAmount} Withdrawal successfully`,
    withdraw,
  });
});

export const getAllWithdrawals = asyncHandler(async (req, res) => {

  const withdrawals = await Withdraw.find().populate({
    path: 'customerId',
    select: 'customerName'
  });
    const result = withdrawals.map((withdraw) => ({
    ...withdraw._doc,
    customerId: withdraw.customerId?._id,
    customerName: withdraw.customerId?.customerName
  }));
  res.status(200).json({
    message: "All withdrawals fetched successfully ✅",
    total: result.length,
    result,
  });
});

export const withdrawstatusupdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { withdrawStatus } = req.body;

  let withdrawStatusCustomer;

  // Find withdraw record first
  const findWithdraw = await Withdraw.findById(id);
  if (!findWithdraw) {
    res.status(404);
    throw new Error("Withdraw request not found");
  }

  if (withdrawStatus === "Approved") {
    console.log("Approved condition");
    const CustomeravailableAmount = parseFloat(findWithdraw.availableAmount);
    const CustomerwithdrawAmount = parseFloat(findWithdraw.withdrawAmount);
    const CustomerId = findWithdraw.customerId;

    const updatedAvailableAmount = (CustomeravailableAmount - CustomerwithdrawAmount).toFixed(2);

    // Update Withdraw status and availableAmount
    withdrawStatusCustomer = await Withdraw.findByIdAndUpdate(
      id,
      {
        withdrawStatus,
        availableAmount: updatedAvailableAmount,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // Update Customer available balance
    await Custumer.findByIdAndUpdate(CustomerId, {
      availBalance: updatedAvailableAmount,
    });

  } else {
    console.log("else condition");

    withdrawStatusCustomer = await Withdraw.findByIdAndUpdate(
      id,
      { withdrawStatus },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
  }

  res.status(200).json({
    message: "Withdraw status updated successfully ✅",
    customerId: withdrawStatusCustomer._id,
    withdrawStatus: withdrawStatusCustomer.withdrawStatus,
  });
});



export const getWithdrwByCustomerId = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const withdrawals = await Withdraw.find({ customerId }).populate({
    path: 'customerId',
    select: 'customerName'
  });

  // flatten the populated customerId object
  const result = withdrawals.map((withdraw) => ({
    ...withdraw._doc,
    customerId: withdraw.customerId?._id,
    customerName: withdraw.customerId?.customerName
  }));

  res.status(200).json({
    message: "All withdrawals fetched successfully ✅",
    result,
  });
});


//  console.log("withdrawStatusCustomer", withdrawStatusCustomer);
  
//   const withdrawcustomerId = withdrawStatusCustomer?.customerId
//   const CustomerwithdrawAmount = withdrawStatusCustomer?.withdrawAmount
//   const CustomeravailableAmount = withdrawStatusCustomer?.availableAmount
//   const CustomerwithdrawStatus = withdrawStatusCustomer?.withdrawStatus
//   console.log("withdrawcustomerId",withdrawcustomerId);
//   console.log("CustomerwithdrawAmount",CustomerwithdrawAmount);
//   console.log("CustomeravailableAmount",CustomeravailableAmount);
//   console.log("CustomerwithdrawStatus",CustomerwithdrawStatus);

//   if (CustomerwithdrawStatus == "Approved") {
//     const aaaa = await Custumer.findByIdAndUpdate({ _id: withdrawcustomerId },
//       { availableBalance: CustomeravailableAmount - CustomerwithdrawAmount }
//     )
//     console.log("aaaa", aaaa);

//   }

//   if (!withdrawStatusCustomer) {
//     res.status(404);
//     throw new Error("Customer not found");
//   }
