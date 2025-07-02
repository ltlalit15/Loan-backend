// routes/paymentRoutes.js
import express from "express";
import { logins, CreateCustumer, getCustumers, UpdateCustumerStatus, deleteCustomer, updateCustomer } from "../Controllers/CustumerCtrl.js";

import upload from "../Utils/multer.js";
import { authMiddleware, isAdmin, isCustumer } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();

router.post("/login", logins);
router.get("/custumers", authMiddleware, isAdmin, getCustumers);

router.post(
  "/createcustumer",
  upload.fields([
    { name: "gstDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
  ]),
  CreateCustumer
);

router.put(
  "/updateCustumer/:id",
  upload.fields([
    { name: "gstDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
  ]),
  authMiddleware,
  isCustumer,
  updateCustomer
);

router.patch("/updatecustomerstatus/:id", authMiddleware, isAdmin, UpdateCustumerStatus);
router.delete("/deleteCustomer/:id", authMiddleware, isAdmin, deleteCustomer);

export default router;
