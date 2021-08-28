import * as functions from "firebase-functions";
import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import v1 from "./routes/index";

const main = express();

main.use(bodyParser.json());
main.use(cookieParser());
main.use(cors({ origin: true }));

main.use("/v1", v1);

export const api = functions.https.onRequest(main);
