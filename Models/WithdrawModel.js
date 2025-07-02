// Models/WithdrawModel.js
import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
    {
  customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  required: true,
},

        approvedCreditLine: { type: String },
        availableAmount: { type: String },
        withdrawAmount: { type: String },
        remainingCreditLine: { type: String },
        withdrawStatus: { type: String, default: "pending" },
    },
    {
        timestamps: true,
    }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
