// routes/paymentRoutes.js
import express from "express";
import { logins, CreateCustumer, getCustumers, UpdateCustumerStatus } from "../Controllers/AuthCtrl.js";

import upload from "../Utils/multer.js";

const router = express.Router();

router.post("/login", logins);
router.get("/custumers", getCustumers);

router.post(
  "/createcustumer",
  upload.fields([
    { name: "gstDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
  ]),
  CreateCustumer
);

router.patch("/updatecompanystatus/:id", UpdateCustumerStatus);

export default router;
