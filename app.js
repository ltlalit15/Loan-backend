import { Router } from "express";

import AuthRouter from "./Routers/AuthRouter.js";
import CustumerRouter from "./Routers/CustumerRouter.js";
import WithdrawRouter from "./Routers/WithdrawRouter.js";

const router = Router();

router.use("/api", AuthRouter);
router.use("/api", CustumerRouter);
router.use("/api", WithdrawRouter);

export default router;
