import * as express from "express";

const router = express.Router();

router.all("/", (req, res) => {
	res.send("Order");
});

export default router;
