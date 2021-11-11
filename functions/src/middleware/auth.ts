import { Request, Response, NextFunction } from "express";

import admin from "../config/admin";
import { asyncWrap } from "./async";

import { Roles } from "../interfaces/auth.interfaces";
import { throwError } from "../helpers/ErrorHandler";
import { ADMIN_EMAIL } from "../config/config";

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

export const isAuthorized = (opts: { param?: string; hasRole: Array<Roles>; allowSelfOnly?: boolean }) => {
	return (req: Request, _: Response, next: NextFunction) => {
		// @ts-ignore
		const { role, email, uid } = req.locals;
		const param = opts.param ? req.params[opts.param] : null;

		console.log(param);

		if (email === ADMIN_EMAIL) return next();

		if (!role) throwError(403, "Unauthorized");

		if (opts.allowSelfOnly && param && uid === param) return next();

		if (!opts.allowSelfOnly && opts.hasRole.includes(role)) return next();

		throwError(403, "Unauthorized");
	};
};
