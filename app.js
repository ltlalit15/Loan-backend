import { Router } from "express";

import AuthRouter from "./Routers/AuthRouter.js";
import CustumerRouter from "./Routers/CustumerRouter.js";

const router = Router();

router.use("/api", AuthRouter);
router.use("/api", CustumerRouter);

export default router;
