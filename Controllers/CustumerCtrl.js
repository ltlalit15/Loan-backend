import Customer from "../Models/CustumerModel.js";
import Repayment from "../Models/RepaymentsModel.js";
import Withdraw from "../Models/WithdrawModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../Config/jwtToken.js";
import cloudinary from "../Config/cloudinary.js";
import fs from "fs";
import dayjs from "dayjs";

export const CreateCustumer = asyncHandler(async (req, res) => {
  const {
    customerName,
    companyName,
    email,
    phoneNumber,
    address,
    creditLine,
    password
  } = req.body;

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    res.status(400);
    return res.status(409).json({ message: "Customer already exists" });
  }

  let gstDocUrl = "";
  let panDocUrl = "";

  if (req.files?.gstDoc) {
    const result = await cloudinary.uploader.upload(req.files.gstDoc[0].path);
    gstDocUrl = result.secure_url;
    fs.unlinkSync(req.files.gstDoc[0].path);
  }

  if (req.files?.panDoc) {
    const result = await cloudinary.uploader.upload(req.files.panDoc[0].path);
    panDocUrl = result.secure_url;
    fs.unlinkSync(req.files.panDoc[0].path);
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const customer = await Customer.create({
    customerName,
    companyName,
    email,
    phoneNumber,
    address,
    creditLine,
    gstDoc: gstDocUrl,
    panDoc: panDocUrl,
    password: hashedPassword,
  });
  console.log("customer", customer);
  res.status(201).json({
    message: "Customer created successfully ✅",
    customer: {
      id: customer._id,
      customerName: customer.customerName,
      companyName: customer.companyName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      creditLine: customer.creditLine,
      gstDoc: customer.gstDoc,
      panDoc: customer.panDoc,
      factorRate: customer.factorRate,
      role: customer.role,
    },
  });
});

export const logins = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  const token = generateToken(customer._id);
  res.status(200).json({
    message: "Login successful ✅",
    customer: {
      id: customer._id,
      customerName: customer.customerName,
      companyName: customer.companyName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      creditLine: customer.creditLine,
      factorRate: customer.factorRate,
      gstDoc: customer.gstDoc,
      panDoc: customer.panDoc,
      role: customer.role,
      token,
    },
  });
});

export const getCustumers = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  let customers;

  if (customerId) {
    customers = await Customer.find({ _id: customerId}).select("-password");
  } else {
    customers = await Customer.find({ role: "customer" }).select("-password");
  }

  res.status(200).json({
    message: "Customers fetched successfully",
    total: customers.length,
    customers,
  });
});

export const UpdateCustumerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customerStatus } = req.body;

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { customerStatus },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedCustomer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json({
    message: "Customer status updated successfully ✅",
    customerId: updatedCustomer._id,
    updatedStatus: updatedCustomer.customerStatus,
  });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    companyName,
    email,
    phoneNumber,
    address,
    creditLine,
    approvedAmount,
    totalRepayment,
    term_month,
    installment,
    factorRate,
    availBalance,
    term_type
  } = req.body;

  const customer = await Customer.findById(id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found ❌");
  }

  // ✅ GST Doc Upload (No folder)
  if (req.files?.gstDoc) {
    if (customer.gstDocPublicId) {
      await cloudinary.uploader.destroy(customer.gstDocPublicId);
    }

    const result = await cloudinary.uploader.upload(req.files.gstDoc[0].path);
    customer.gstDoc = result.secure_url;
    customer.gstDocPublicId = result.public_id;
    fs.unlinkSync(req.files.gstDoc[0].path);
  }

  // ✅ PAN Doc Upload (No folder)
  if (req.files?.panDoc) {
    if (customer.panDocPublicId) {
      await cloudinary.uploader.destroy(customer.panDocPublicId);
    }

    const result = await cloudinary.uploader.upload(req.files.panDoc[0].path);
    customer.panDoc = result.secure_url;
    customer.panDocPublicId = result.public_id;
    fs.unlinkSync(req.files.panDoc[0].path);
  }

  // ✅ Update basic fields
  customer.customerName = customerName || customer.customerName;
  customer.companyName = companyName || customer.companyName;
  customer.email = email || customer.email;
  customer.phoneNumber = phoneNumber || customer.phoneNumber;
  customer.address = address || customer.address;
  customer.creditLine = creditLine || customer.creditLine;
  customer.factorRate = factorRate || customer.factorRate;
  customer.term_type = term_type || customer.term_type;
  customer.approvedAmount = approvedAmount || customer.approvedAmount;
  customer.totalRepayment = totalRepayment || customer.totalRepayment;
  customer.term_month = term_month || customer.term_month;
  customer.availBalance = availBalance || customer.availBalance;
  customer.installment = installment || customer.installment;

  if (totalRepayment !== undefined) {
    customer.remainingRepayment = totalRepayment;
  }

  const updatedCustomer = await customer.save();

  res.status(200).json({
    message: "Customer updated successfully ✅",
    customer: {
      id: updatedCustomer._id,
      customerName: updatedCustomer.customerName,
      companyName: updatedCustomer.companyName,
      email: updatedCustomer.email,
      phoneNumber: updatedCustomer.phoneNumber,
      address: updatedCustomer.address,
      creditLine: updatedCustomer.creditLine,
      factorRate: updatedCustomer.factorRate,
      gstDoc: updatedCustomer.gstDoc,
      panDoc: updatedCustomer.panDoc,
      approvedAmount: updatedCustomer.approvedAmount,
      totalRepayment: updatedCustomer.totalRepayment,
      term_month: updatedCustomer.term_month,
      installment: updatedCustomer.installment,
      availBalance: updatedCustomer.availBalance,
      remainingRepayment: updatedCustomer.remainingRepayment,
      term_type: updatedCustomer.term_type,
    },
  });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCustomer = await Customer.findByIdAndDelete(id);

  if (!deletedCustomer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  await Repayment.deleteMany({ customerId: id });
  await Withdraw.deleteMany({ customerId: id });

  res.status(200).json({
    message: "Customer deleted successfully",
    customerId: deletedCustomer._id,
  });
});

export const getCustomerNames = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ role: "customer" }, { customerName: 1 });

  const customerList = customers.map(customer => ({
    id: customer._id,
    name: customer.customerName
  }));
  res.status(200).json({
    msg: "Successfully fetched All Customer",
    total: customerList.length,
    customers: customerList
  })
});

export const autoDeductInstallments = asyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find();

    const now = dayjs();
    let updatedCount = 0;
    let logs = [];

    for (const customer of customers) {
      const {
        _id,
        totalRepayment,
        installment,
        term_type,
        updatedAt
      } = customer;

      const lastUpdated = dayjs(updatedAt);
      let nextDueDate;

      if (term_type === "monthly") {
        nextDueDate = lastUpdated.add(1, 'month');
      } else if (term_type === "weekly") {
        nextDueDate = lastUpdated.add(1, 'week');
      } else if (term_type === "biweekly") {
        nextDueDate = lastUpdated.add(2, 'week');
      } else {
        logs.push({ customerId: _id, message: "Invalid term_type" });
        continue;
      }

      if (now.isSame(nextDueDate, 'day')) {
        const newRepayment = totalRepayment - installment;

        await Customer.findByIdAndUpdate(
          _id,
          {
            totalRepayment: newRepayment > 0 ? newRepayment : 0,
            updatedAt: now.toDate(),
          }
        );

        updatedCount++;
        logs.push({ customerId: _id, message: `Installment of $${installment} deducted.` });
      } else {
        logs.push({ customerId: _id, message: `No payment due today. Next due on ${nextDueDate.format("YYYY-MM-DD")}` });
      }
    }

    res.status(200).json({
      message: `Installments processed for ${updatedCount} customer(s).`,
      logs,
    });

  } catch (error) {
    console.error("Auto Deduction Error:", error);
    res.status(500).json({ message: "Server error while processing auto deduction" });
  }
});




