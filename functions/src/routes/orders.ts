import * as express from "express";
import { addOrder, getOrderByID, getOrdersByShopID, getOrdersByUserID, updateOrderStatus } from "../controllers/orders.controllers";
import { isAuthorized } from "../middleware/auth";

const router = express.Router();

router.post("/", addOrder);
router.get("/:id", getOrderByID);
router.get("/user/:id", isAuthorized({ allowSelfOnly: true, hasRole: ["admin", "user"], param: "id" }), getOrdersByUserID);
router.get("/shop/:id", isAuthorized({ allowSelfOnly: true, hasRole: ["admin", "owner"], param: "id" }), getOrdersByShopID);
router.put("/:id", isAuthorized({ hasRole: ["admin", "owner"] }), updateOrderStatus);

export default router;
