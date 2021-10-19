import * as functions from "firebase-functions";
import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from "firebase-admin";
import v1 from "./routes/index";
import db from "./config/db"

const main = express();

main.use(bodyParser.json());

main.use(cookieParser());
main.use(cors({ origin: true }));

main.use("/v1", v1);

export const api = functions.https.onRequest(main);

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
})

export const onCreateOrder = functions.firestore.document("orders/{document}").onCreate((res) => {
    
    const slug = res.data().shop;

    const sendToken = () => {
        //ownerDoc
        db.collection("owners").where("slug","==",slug).get()
        .then((ownerDoc) =>{

            ownerDoc.forEach((doc) => {            
    
                const payload = {
                    notification: {
                        color: "#f28d0a",
                        icon: "https://www.mujhub.com/static/media/logoSq256.7b56d951.png",
                        title: "Order Placed",
                        body: `Order Status`,
                    },
                    data:{
                        orderId:res.id
                    }
                }
            
                admin
                    .messaging()
                    .sendToDevice(doc.data().token,payload)
                    .then((response) => {
                        console.log("Notification sent successfully",response);
                    }).catch((err) => {
                        console.log(err);
                    })
            })
        });
    }

    sendToken();
})
//Mess Menu Updation

export const messMenuUpdate = functions.firestore.document("mess/menuData").onUpdate((res) => {

    const payload = {
        notification: {
            color: "#f28d0a",
            title: "Mess Menu Updated",
            body: "Updated",
            icon: "https://www.mujhub.com/static/media/logoSq256.7b56d951.png",
        }
    }

    return admin
        .messaging()
        .sendToTopic("messMenuUpdate", payload)
        .then(function (response) {
            console.log("Notification sent successfully:", response);
        })
        .catch(function (error) {
            console.log("Notification sent failed:", error);
        });
})