import express from "express";
import {
    getNotification,
    getAdminNotification
} from "../Controllers/NotificationCtrl.js";

import { authMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/getnotification/:customerId", getNotification);
router.get("/adminnotification", getAdminNotification);

export default router;
