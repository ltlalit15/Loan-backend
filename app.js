import { Router } from "express";

import AuthRouter from "./Routers/AuthRouter.js";
import CustumerRouter from "./Routers/CustumerRouter.js";
import WithdrawRouter from "./Routers/WithdrawRouter.js";
import RepaymentsRouter from "./Routers/RepaymentsRouter.js";
import ReportRouter from "./Routers/ReportRouter.js";
import NotificationRouter from "./Routers/NotificationRouter.js";

const router = Router();

router.use("/api", AuthRouter);
router.use("/api", CustumerRouter);
router.use("/api", WithdrawRouter);
router.use("/api", RepaymentsRouter);
router.use("/api", ReportRouter);
router.use("/api", NotificationRouter);

export default router;
