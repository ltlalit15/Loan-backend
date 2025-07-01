import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String
    },
    companyName: {
      type: String
    },
    email: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String
    },
    creditLine: {
      type: String
    },
    password: {
      type: String
    },
    gstDoc: {
      type: String
    },
    panDoc: {
      type: String
    },
    role: {
      type: String,
      default: "customer"
    }
  },
  {
    timestamps: true, 
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
