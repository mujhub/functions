import db from "../config/db";
import { asyncWrap } from "../middleware/async";
import { throwError } from "../helpers/ErrorHandler";

export const getAllEateries = asyncWrap(async (req, res) => {
	try {
		const allEateriesDoc = await db.collection("eateries").doc("info-data").get();
		if (allEateriesDoc.exists) {
			const allEateriesData = allEateriesDoc.data();
			res.json(allEateriesData);
		}
		throwError(404, "Not Found");
	} catch (error) {
		throwError(400, "Something went wrong");
	}
});

export const getEateryBySlug = asyncWrap(async (req, res) => {
	let slug = req.params.slug;
	try {
		const EateryDoc = await db.collection("eateries").doc(slug).get();
		if (EateryDoc.exists) {
			const eateryData = EateryDoc.data();
			res.json(eateryData);
		} else throwError(404, "Eatery not found");
	} catch (error) {
		throwError(400, error);
	}
});
