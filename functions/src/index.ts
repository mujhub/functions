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

export const resetMessData = functions.pubsub
	.schedule("0 0 * * *")
	.timeZone("Asia/Kolkata")
	.onRun(async () => {
		const menuData = await admin.firestore().collection("mess").doc("menuData").get();
		if (menuData.exists) {
			try {
				const data = menuData.data();
				if (data) {
					let meals = data.meals;
					meals.forEach((meal: any) => {
						meal.menu = [];
						meal.isSpecial = false;
					});
					data.meals = meals;
					admin.firestore().collection("mess").doc("menuData").update(data);
					console.log("Cleared Mess Menu");
				}
			} catch (error) {
				console.log(JSON.stringify(error));
			}
		}
	});

export const changeMessSaturdayTimings = functions.pubsub
	.schedule("0 0 * * 6")
	.timeZone("Asia/Kolkata")
	.onRun(async () => {
		const menuData = await admin.firestore().collection("mess").doc("menuData").get();
		if (menuData.exists) {
			try {
				const data = menuData.data();
				if (data) {
					let meals = data.meals;
					if (meals[0]) {
						meals[0].startsAt = "07:30";
						meals[0].endsAt = "10:30";
					}
					if (meals[1]) {
						meals[1].startsAt = "12:00";
						meals[1].endsAt = "15:30";
					}
					if (meals[2]) {
						meals[2].startsAt = "17:30";
						meals[2].endsAt = "18:30";
					}
					if (meals[3]) {
						meals[3].startsAt = "19:30";
						meals[3].endsAt = "21:30";
					}
					data.meals = meals;
					admin.firestore().collection("mess").doc("menuData").update(data);
					console.log("Changed Timings on Saturday");
				}
			} catch (error) {
				console.log(JSON.stringify(error));
			}
		}
	});

export const changeMessMondayTimings = functions.pubsub
	.schedule("0 0 * * 1")
	.timeZone("Asia/Kolkata")
	.onRun(async () => {
		const menuData = await admin.firestore().collection("mess").doc("menuData").get();
		if (menuData.exists) {
			try {
				const data = menuData.data();
				if (data) {
					let meals = data.meals;
					if (meals[0]) {
						meals[0].startsAt = "07:30";
						meals[0].endsAt = "09:30";
					}
					if (meals[1]) {
						meals[1].startsAt = "12:00";
						meals[1].endsAt = "14:30";
					}
					if (meals[2]) {
						meals[2].startsAt = "17:30";
						meals[2].endsAt = "18:30";
					}
					if (meals[3]) {
						meals[3].startsAt = "19:30";
						meals[3].endsAt = "21:30";
					}
					data.meals = meals;
					admin.firestore().collection("mess").doc("menuData").update(data);
					console.log("Changed Timings on Monday");
				}
			} catch (error) {
				console.log(JSON.stringify(error));
			}
		}
	});
