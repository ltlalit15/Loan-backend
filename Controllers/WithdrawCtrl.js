// Controllers/WithdrawController.js
import Withdraw from "../Models/WithdrawModel.js";
import Custumer from "../Models/CustumerModel.js";
import Notifiaction from "../Models/NotifiactionModel.js";
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
    select: 'customerName einNumber'
  });
    const result = withdrawals.map((withdraw) => ({
    ...withdraw._doc,
    customerId: withdraw.customerId?._id,
    einNumber: withdraw.customerId?.einNumber,
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

  const findWithdraw = await Withdraw.findById(id);
  if (!findWithdraw) {
    res.status(404);
    throw new Error("Withdraw request not found");
  }

  // 💥 Prevent duplicate approval
  if (findWithdraw.withdrawStatus === "Approved") {
    res.status(400);
    throw new Error("Withdraw already approved");
  }

  if (withdrawStatus === "Approved") {
    const withdrawAmount = parseFloat(findWithdraw.withdrawAmount);
    const customerId = findWithdraw.customerId;

    // ✅ Get latest balance from customer
    const customer = await Custumer.findById(customerId);
    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const currentBalance = parseFloat(customer.availBalance);
    const updatedAvailableAmount = Number((currentBalance - withdrawAmount).toFixed(2));

    // ✅ Update withdraw record
    withdrawStatusCustomer = await Withdraw.findByIdAndUpdate(
      id,
      {
        withdrawStatus,
        availableAmount: updatedAvailableAmount,
      },
      { new: true, runValidators: true }
    );

    // ✅ Update customer balance
    if (withdrawStatusCustomer) {
      await Custumer.findByIdAndUpdate(customerId, {
        availBalance: updatedAvailableAmount,
      });

      await Notifiaction.create({
        message: `Withdrawal of $${withdrawAmount} has been approved and processed.`,
        customerId,
      });
    }
  } else {
    withdrawStatusCustomer = await Withdraw.findByIdAndUpdate(
      id,
      { withdrawStatus },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    message: "Withdraw status updated successfully ✅",
    customerId: withdrawStatusCustomer.customerId,
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
