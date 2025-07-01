import Customer from "../Models/AuthModel.js";
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
    throw new Error("Customer already exists");
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
      email: customer.email,
      role: customer.role,
      token
    },
  });
});
