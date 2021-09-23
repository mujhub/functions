import * as functions from "firebase-functions";
import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from "firebase-admin";

import v1 from "./routes/index";

const main = express();

main.use(bodyParser.json());

main.use(cookieParser());
main.use(cors({ origin: true }));

main.use("/v1", v1);

export const api = functions.https.onRequest(main);

// database.ref("orders/7234-033127-7361").onUpdate

//Order place notif on eater side

export const test = functions.firestore.document("orders/{document}").onCreate((res) => {
	const payload = {
		notification: {
			title: "Welcome",
			body: "thank for installing our app",
		},
	};

	admin
		.messaging()
		.sendToDevice(
			"eoz7U6qFQZWkzVCqSCR9v9:APA91bH2_a0vJT72hw9-FHIXylB0bUekd7f3PUek8EivJdi98ucZaHE95jOD-nYKgnmxLSOoFY2H6h9qb0HrpZjM1zMtjExl5lT0Lzopl0bv4nklGpRdh9MHQzajKf8lFPMj9Oi8RZKp",
			payload
		)
		.then(function (response) {
			console.log("Notification sent successfully:", response);
		})
		.catch(function (error) {
			console.log("Notification sent failed:", error);
		});
});

//Update order status notif on user side

export const updateOrder = functions.firestore.document("orders/{document}").onUpdate((res) => {
	const payload = {
		notification: {
			color: "#f28d0a",
			icon: "https://www.mujhub.com/static/media/logoSq256.7b56d951.png",
			title: "Order Status Updated",
			body: `Order Status : ${res.after.data().status}`,
		},
	};

	if (res.after.data().status === "ACCEPTED") {
		admin
			.messaging()
			.sendToDevice(res.after.data().token, payload)
			.then(function (response) {
				console.log("Notification sent successfully:", response);
			})
			.catch(function (error) {
				console.log("Notification sent failed:", error);
			});
	}
});

//Mess Menu Updation

export const messMenuUpdate = functions.firestore.document("mess/menuData").onUpdate((snapshot) => {
	let after = snapshot.after.data();
	if (!after.notify) return;

	const payload = {
		notification: {
			color: "#f28d0a",
			title: "Mess Menu Updated",
			body: "Updated",
			icon: "https://www.mujhub.com/static/media/logoSq256.7b56d951.png",
		},
	};

	admin
		.messaging()
		.sendToTopic("messMenuUpdate", payload)
		.then(function (response) {
			console.log("Notification sent successfully:", response);
		})
		.catch(function (error) {
			console.log("Notification sent failed:", error);
		});
});
