import * as express from "express";
import { addOrder, getOrderByID, updateOrderStatus } from "../controllers/orders.controllers";

const router = express.Router();

router.post("/", addOrder);
router.get("/:id", getOrderByID);
router.put("/:id", updateOrderStatus);

export default router;
