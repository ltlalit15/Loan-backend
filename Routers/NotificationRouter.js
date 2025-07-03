import express from "express";
import {
    getNotification
} from "../Controllers/NotificationCtrl.js";

import { authMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/getnotification/:customerId", getNotification);

export default router;
