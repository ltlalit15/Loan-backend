import Notifiaction from "../Models/NotifiactionModel.js";
import asyncHandler from "express-async-handler";

export const getNotification = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const getNotificationData = await Notifiaction.find({ customerId });
    return res.status(200).json({ data: getNotificationData })
});
