import * as express from "express";
import { getAllEateries, getEateryBySlug } from "../controllers/eateries.controllers";

const router = express.Router();

router.get("/all", getAllEateries);
router.get("/:slug", getEateryBySlug);

export default router;
