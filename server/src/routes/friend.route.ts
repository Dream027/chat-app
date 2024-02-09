import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";

const router = Router();

router.use(verifyToken);

export default router;
