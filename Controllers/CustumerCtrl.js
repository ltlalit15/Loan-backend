import Customer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../Config/jwtToken.js";
import cloudinary from "../Config/cloudinary.js";
import fs from "fs";

export const CreateCustumer = asyncHandler(async (req, res) => {
  const {
    customerName,
    companyName,
    email,
    phoneNumber,
    address,
    creditLine,
    factorRate,
    password,
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
    factorRate,
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
  const customers = await Customer.find({}).select("-password");

  res.status(200).json({
    message: "All customers fetched successfully ✅",
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
    factorRate,
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

  res.status(200).json({
    message: "Customer deleted successfully",
    customerId: deletedCustomer._id,
  });
});
