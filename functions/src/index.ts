import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";

import v1 from "./routes/index";

const main = express();

main.use(bodyParser.json());
main.use(cookieParser());
main.use(cors({ origin: true }));

main.use("/v1", v1);

export const api = functions.https.onRequest(main);
