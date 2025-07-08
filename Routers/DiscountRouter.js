import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  costomerearlypay,
  deleteDiscount
} from "../Controllers/DiscountCtrl.js";

const router = express.Router();

router.post("/discount", createDiscount);
router.get("/discount", getAllDiscounts);
router.get("/costomerearlypay", costomerearlypay);
router.put("/discount/:customerId", updateDiscount);
router.delete("/discount/:customerId", deleteDiscount);

export default router;
