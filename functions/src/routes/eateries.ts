import * as express from "express";
import { getAllEateries, getEateryBySlug, saveEateryOwners, setEateryInfo, setEateryStatus } from "../controllers/eateries.controllers";
import { isAuthenticated, isAuthorized } from "../middleware/auth";

const router = express.Router();

router.get("/all", getAllEateries);
router.get("/:slug", isAuthenticated, getEateryBySlug);
router.post("/saveEateryOwners", isAuthenticated, isAuthorized({ hasRole: ["admin"] }), saveEateryOwners);
router.post("/updateInfo/:slug", isAuthenticated, isAuthorized({ hasRole: ["admin", "owner"] }), setEateryInfo);
router.post("/updateStatus/:slug", isAuthenticated, isAuthorized({ hasRole: ["admin", "owner"] }), setEateryStatus);

export default router;
