// routes/paymentRoutes.js
import express from "express";
import { logins, CreateCustumer, getCustumers, UpdateCustumerStatus, deleteCustomer, updateCustomer } from "../Controllers/AuthCtrl.js";

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

router.put(
  "/updateCustumer/:id",
  upload.fields([
    { name: "gstDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
  ]),
  updateCustomer
);


router.patch("/updatecustomerstatus/:id", UpdateCustumerStatus);
router.delete("/deleteCustomer/:id", deleteCustomer);

export default router;
