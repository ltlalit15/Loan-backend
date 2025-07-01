// routes/paymentRoutes.js
import express from "express";
import { logins } from "../Controllers/AuthCtrl.js";

const router = express.Router();

router.post("/login", logins);


export default router;
