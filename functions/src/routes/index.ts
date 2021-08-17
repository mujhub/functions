import * as express from "express";

import { validateAuth } from "../middlewares/auth";

import outletsRoutes from "../routes/outlets";
import itemsRoutes from "../routes/items";
import ordersRoutes from "../routes/orders";

const router = express.Router();

router.use(validateAuth);

router.get("/", (req, res) => {
	res.send("Hello");
});

router.use("/outlet", outletsRoutes);
router.use("/item", itemsRoutes);
router.use("/order", ordersRoutes);

export default router;
