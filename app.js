import { Router } from "express";

import AuthRouter from "./Routers/AuthRouter.js";

const router = Router();

router.use("/api", AuthRouter);

export default router;
