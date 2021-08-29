import * as express from "express";
import { addOrder, getOrderByID, getOrdersByShopID, getOrdersByUserID, updateOrderStatus } from "../controllers/orders.controllers";
// import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/", addOrder);
router.get("/:id", getOrderByID);
router.get("/user/:id", getOrdersByUserID);
router.get("/shop/:id", getOrdersByShopID);
router.put("/:id", updateOrderStatus);

export default router;
