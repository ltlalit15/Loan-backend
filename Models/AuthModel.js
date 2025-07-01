// models/PaymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {

    details: [],

  },
  { timestamps: true }
);

export default mongoose.model("Customer", paymentSchema);
