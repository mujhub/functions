import * as express from "express";

import outletsRoutes from "../routes/outlets";
import itemsRoutes from "../routes/items";
import ordersRoutes from "../routes/orders";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello");
});

router.use("/outlet", outletsRoutes);
router.use("/item", itemsRoutes);
router.use("/order", ordersRoutes);

export default router;
