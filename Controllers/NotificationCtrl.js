import Notifiaction from "../Models/NotifiactionModel.js";
import asyncHandler from "express-async-handler";

export const getNotification = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const getNotificationData = await Notifiaction.find({ customerId });
    return res.status(200).json({ data: getNotificationData })
});

export const getAdminNotification = asyncHandler(async (req, res) => {
    const notifications = await Notifiaction.find()
        .populate({ path: 'customerId', select: 'customerName' });

    const formattedData = notifications.map((notif) => ({
        id: notif._id,
        customerName: notif.customerId?.customerName || "N/A",
        customerId: notif.customerId?._id || "N/A",
        message: notif.message,
        createdAt: notif.createdAt,
        updatedAt: notif.updatedAt
    }));

    return res.status(200).json({ data: formattedData });
});
