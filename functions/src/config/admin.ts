import * as firebaseAdmin from "firebase-admin";
import { DB_URL, ADMIN_CREDENTIALS } from "./config";

const credentials = ADMIN_CREDENTIALS as firebaseAdmin.ServiceAccount;

export default firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(credentials),
	databaseURL: DB_URL,
});
