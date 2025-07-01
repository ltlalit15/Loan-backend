import Customer from "../Models/CustumerModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../Config/jwtToken.js";

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

