import * as express from "express";

import { isAuthenticated } from "../middleware/auth";
import { ErrorHandler } from "../helpers/ErrorHandler";

import itemsRoutes from "./items";
import ordersRoutes from "./orders";
import outletsRoutes from "./eateries";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Welcome to MUJ HUB");
});

router.use("/eateries", outletsRoutes);
router.use("/items", itemsRoutes);
router.use("/orders", isAuthenticated, ordersRoutes);

router.use(ErrorHandler);

export default router;
