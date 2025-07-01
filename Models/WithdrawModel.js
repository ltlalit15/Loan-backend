// Models/WithdrawModel.js
import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
    {
        custumerId: { type: String, required: true },
        approvedCreditLine: { type: String },
        availableAmount: { type: String },
        withdrawAmount: { type: String },
        rateFactor: { type: String },
        withdrawStatus: { type: String, default: "pending" }, // pending, approved, rejected
    },
    {
        timestamps: true,
    }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
