import Contact from "../Models/SupportModel.js";
import asyncHandler from "express-async-handler";

export const createContact = asyncHandler(async (req, res) => {
  const { name, phoneNumber, email, subject, message } = req.body;

  const newContact = await Contact.create({ name, phoneNumber, email, subject, message });
  res.status(201).json({ message: "Contact saved", data: newContact });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({ data: contacts });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Contact.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json({ message: "Contact deleted" });
});
