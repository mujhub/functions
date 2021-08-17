import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";

import v1 from "./routes/index";

const main = express();

main.use("/v1", v1);
main.use(bodyParser.json());

export const api = functions.https.onRequest(main);
