import * as express from "express";
import { getAllEateries, getEateryBySlug } from "../controllers/eateries.controllers";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/all", getAllEateries);
router.get("/:slug", isAuthenticated, getEateryBySlug);

export default router;
