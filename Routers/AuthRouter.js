// routes/paymentRoutes.js
import express from "express";
import {
  logins,
  CreateCustumer
} from "../Controllers/AuthCtrl.js";

const router = express.Router();

router.post("/login", logins);
router.post("/createcustumer", CreateCustumer);

export default router;
