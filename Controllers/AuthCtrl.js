import Payment from "../Models/AuthModel.js";
import asyncHandler from "express-async-handler";

export const logins = asyncHandler(async (req, res) => {
  const deleted = await Payment.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Payment deleted successfully",
    data: deleted,
  });
});
