import * as express from "express";

const router = express.Router();

router.all("/", (req, res) => {
	res.send("Hello");
});

export default router;
