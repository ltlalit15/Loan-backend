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
    approvedAmount: {
      type: String
    },
    installment: {
      type: String
    },
    term_month: {
      type: String
    },
    totalRepayment: {
      type: String
    },
    availBalance: {
      type: String
    },
    factorRate: {
      type: String
    },
    remainingRepayment: {
      type: String
    },
    term_type: {
      type: String
    },
    role: {
      type: String,
      default: "customer"
    },
    customerStatus: {
      type: String,
      default: "inReview"
    },
    resetToken:
    {
      type: String

    },
    resetTokenExpiry: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
