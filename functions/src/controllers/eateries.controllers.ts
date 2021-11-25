import db from "../config/db";
import { asyncWrap } from "../middleware/async";
import { throwError } from "../helpers/ErrorHandler";
import ApiResponse from "../types/ApiResponse";
import EateryInfo from "../types/EateryInfo";

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
		throwError(400, "error");
	}
});

export const saveEateryOwners = asyncWrap(async (req, res) => {
	let { uid, eaterySlug, registered } = req.body;
	let newOwner = { slug: eaterySlug, registered };

	try {
		await db.collection("owners").doc(uid).set(newOwner);

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "Saved eatery owner",
		};

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		throwError(400, "Error saving eatery owner");
	}
});

export const setEateryInfo = asyncWrap(async (req, res) => {
	let slug = req.params.slug;
	try {
		const eateryRef = db.collection("eateries").doc(slug);
		const eateryDoc = await eateryRef.get();
		if (!eateryDoc.exists) throwError(404, "Eatery not found");
		const eateryData = eateryDoc.data();

		const infoRef = db.collection("eateries").doc("info-data");
		const infoDoc = await infoRef.get();
		if (!infoDoc.exists) throwError(404, "Eateries info not found");

		try {
			if (!eateryData) {
				throwError(404, "Eatery data not found");
				return;
			}
			if (!eateryData.info) {
				throwError(404, "Eatery info not found");
				return;
			}

			let eateryInfo = eateryData.info as EateryInfo;

			if (req.body.closes_at) eateryInfo.closes_at = req.body.closes_at;
			if (req.body.contact) eateryInfo.contact = req.body.contact;
			if (req.body.cover) eateryInfo.cover = req.body.cover;
			if (req.body.description) eateryInfo.description = req.body.description;
			if (req.body.is_open) eateryInfo.is_open = req.body.is_open;
			if (req.body.location) eateryInfo.location = req.body.location;
			if (req.body.opens_at) eateryInfo.opens_at = req.body.opens_at;
			if (req.body.tint) eateryInfo.tint = req.body.tint;
			if (req.body.title) eateryInfo.title = req.body.title;

			await eateryRef.update({ info: { ...eateryInfo } });
			await infoRef.update({ [slug]: { ...eateryInfo } });
		} catch (error) {
			console.log(error);
			throwError(500, "Something went wrong");
		}

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "SUCCESS",
		};

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		throwError(400, "error");
	}
});

export const setEateryStatus = asyncWrap(async (req, res) => {
	let slug = req.params.slug;
	try {
		const eateryRef = db.collection("eateries").doc(slug);
		const eateryDoc = await eateryRef.get();
		if (!eateryDoc.exists) throwError(404, "Eatery not found");
		const eateryData = eateryDoc.data();

		const infoRef = db.collection("eateries").doc("info-data");
		const infoDoc = await infoRef.get();
		if (!infoDoc.exists) throwError(404, "Eateries info not found");

		try {
			if (!eateryData) {
				throwError(404, "Eatery data not found");
				return;
			}
			if (!eateryData.info) {
				throwError(404, "Eatery info not found");
				return;
			}
			if (typeof req.body.is_open !== "boolean") {
				throwError(500, "Bad request");
				return;
			}

			let is_open = req.body.is_open;

			await eateryRef.update({ info: { is_open } });
			await infoRef.update({ [slug]: { is_open } });
		} catch (error) {
			console.log(error);
			throwError(500, "Something went wrong");
		}

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "SUCCESS",
		};

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		throwError(400, "error");
	}
});
