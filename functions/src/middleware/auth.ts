import { Request, Response, NextFunction } from "express";

import admin from "../config/admin";
import { asyncWrap } from "./async";

import { IRoles } from "../interfaces/auth.interfaces";
import { ADMIN_EMAIL } from "../config/config";
import { throwError } from "../helpers/ErrorHandler";

export const isAuthenticated = asyncWrap(async (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) && !(req.cookies && req.cookies.__session)) {
		throwError(403, "Unauthorized");
		return;
	}

	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		idToken = req.headers.authorization.split("Bearer ")[1];
		console.log(`idToken: ${idToken}`);
	} else if (req.cookies) {
		idToken = req.cookies.__session;
	} else {
		throwError(403, "Unauthorized");
		return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		// @ts-ignore
		req.locals = decodedIdToken;
		next();
		return;
	} catch (error) {
		throwError(403, "Unauthorized");
		return;
	}
});

export const isAuthorized = (opts: { param: string; hasRole: Array<IRoles>; allowSelfOnly?: boolean }) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { role, email, uid } = res.locals;
		const param = req.params[opts.param];

		if (email === ADMIN_EMAIL) {
			return next();
		}

		if (opts.allowSelfOnly && param && uid === param) return next();

		if (!role) return res.status(403).send();

		if (opts.hasRole.includes(role)) return next();

		return res.status(403).send();
	};
};
