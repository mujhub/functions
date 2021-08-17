import admin from "../config/admin";
import { asyncWrap } from "./async";

export const validateAuth = asyncWrap(async (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) && !(req.cookies && req.cookies.__session)) {
		res.status(403).send("Unauthorized");
		return;
	}

	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		idToken = req.headers.authorization.split("Bearer ")[1];
	} else if (req.cookies) {
		idToken = req.cookies.__session;
	} else {
		res.status(403).send("Unauthorized");
		return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		// @ts-ignore
		req.user = decodedIdToken;
		next();
		return;
	} catch (error) {
		res.status(403).send("Unauthorized");
		return;
	}
});
