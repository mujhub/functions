import db from "../config/db";
import { asyncWrap } from "../middleware/async";
import { throwError } from "../helpers/ErrorHandler";
import ApiResponse from "../types/ApiResponse";

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
		const eateryDoc = await db.collection("eateries").doc(slug).get();
		if (!eateryDoc.exists) throwError(404, "Eatery not found");

		const eateryData = eateryDoc.data();

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "FOUND",
			data: eateryData,
		};

		res.status(201).json(response);
	} catch (error) {
		throwError(400, 'error');
	}
});

export const saveEateryOwners = asyncWrap(async(req,res) => {
	
	let {uid,eaterySlug,registered} = req.body;

	console.log(req.body,"body");

	let newOwner = {slug:eaterySlug,registered};

	try{
		await db.collection("owners").doc(uid).set(newOwner);

		const response:ApiResponse = {
			status:200,
			success:true,
			message:"Saved Eatery Owner"
		}

		res.status(200).json(response);
	}catch(error) {
		throwError(400,"Couldnt save eatery owner");
	}
})