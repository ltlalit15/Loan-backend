import { Router } from "express";

import AuthRouter from "./Routers/AuthRouter.js";
import CustumerRouter from "./Routers/CustumerRouter.js";
import WithdrawRouter from "./Routers/WithdrawRouter.js";
// import RepaymentsRouter from "./Routers/RepaymentsRouter.js";

const router = Router();

router.use("/api", AuthRouter);
router.use("/api", CustumerRouter);
router.use("/api", WithdrawRouter);
// router.use("/api", RepaymentsRouter);

export default router;
