import * as express from "express";

import outletsRoutes from "./eateries";
import itemsRoutes from "../routes/items";
import ordersRoutes from "../routes/orders";

import { ErrorHandler, throwError } from "../helpers/ErrorHandler";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Welcome to MUJ HUB");
});

router.use("/eateries", outletsRoutes);
router.use("/items", itemsRoutes);
router.use("/orders", ordersRoutes);

router.use("/error", (req, res, next) => {
	throwError(500, "Internal");
});

router.use(ErrorHandler);

export default router;
