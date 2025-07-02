import Customer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../Config/jwtToken.js";
import crypto from "crypto";

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
    message: "Login successful",
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

export const changePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (!password) {
    res.status(400);
    throw new Error("New password is required");
  }

  const customer = await Customer.findById(id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await Customer.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );

  res.status(200).json({ message: "Password updated successfully" });
});



export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    res.status(404);
    throw new Error("User not found");
  }

  const token = crypto.randomBytes(20).toString("hex");

  customer.resetToken = token;
  customer.resetTokenExpiry = Date.now() + 3600000;
  await customer.save();


  res.status(200).json({
    message: "Reset token generated",
    resetToken: token,
    note: "Use this token in /reset-password/:token API",
  });
});


export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const customer = await Customer.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!customer) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  customer.password = hashedPassword;
  customer.resetToken = undefined;
  customer.resetTokenExpiry = undefined;

  await customer.save();

  res.status(200).json({ message: "Password reset successful" });
});

