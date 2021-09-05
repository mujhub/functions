import db from "../config/db";

import { asyncWrap } from "../middleware/async";

import Order from "../types/Order";
import OrderStatus from "../types/OrderStatus";
import ApiResponse from "../types/ApiResponse";

import generateOrderId from "../helpers/OrderId";
import { CustomError, throwError } from "../helpers/ErrorHandler";
import { isOpen } from "../utils/misc";
import OrderItem from "../types/OrderItem";
import ReceiptItem from "../types/ReceiptItem";

export const addOrder = asyncWrap(async (req, res) => {
	try {
		// @ts-ignore
		const { uid } = req.locals;
		const { items, shop } = req.body;

		if (!shop || !items.length) throwError(400, "Invalid Request");

		const shopDoc = await db.collection("eateries").doc(shop).get();

		if (!shopDoc.exists) throwError(404, "Shop doesn't exist");

		const shopData = shopDoc.data();
		const { opens_at, closes_at, title: shopName } = shopData?.info;
		const shopMenu = shopData?.menu;

		if (!isOpen({ opens_at, closes_at })) throwError(400, "Shop is not accepting orders");

		let orderedMenu = [] as Array<ReceiptItem>;

		try {
			items.forEach((orderedItem: OrderItem) => {
				let f = 0;
				shopMenu.forEach((menuItem: any) => {
					if (orderedItem.itemId === menuItem.id) {
						orderedItem.variants.forEach((variant) => {
							let receiptItem = { name: "", category: "", description: "", price: 0, type: 0 };
							let price = 0;
							if (typeof menuItem.price === "object") {
								if (!menuItem.price[variant]) throwError(400, "Invalid Request");
								price = menuItem.price[variant];
							} else price = menuItem.price;
							receiptItem = { ...receiptItem, ...menuItem, price };
							orderedMenu.push(receiptItem as ReceiptItem);
						});
						f = 1;
					}
				});
				if (f === 0) throwError(400, "Invalid Request");
			});
		} catch (error) {
			console.log(error);
			throwError(400, "Invalid Request");
		}

		let newOrder = { user: uid, status: OrderStatus.PLACED, createdAt: Date.now(), items: orderedMenu, shop, shopName } as Order;

		const orderId = generateOrderId();

		await db.collection("orders").doc(orderId).set(newOrder);
		console.log("ORDER PLACED", orderId, newOrder);

		const response: ApiResponse = {
			status: 201,
			success: true,
			message: "CREATED",
			data: {
				id: orderId,
			},
		};

		res.status(201).json(response);
	} catch (error) {
		if (error instanceof CustomError) throwError(error.statusCode, error.message);
		throwError(500, "INTERNAL SERVER ERROR");
	}
});

export const getOrderByID = asyncWrap(async (req, res) => {
	try {
		const { id } = req.params;

		const order = await db.collection("orders").doc(id).get();

		if (!order.exists) throwError(404, "NOT FOUND");

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "FOUND",
			data: order.data() as Order,
		};

		res.status(200).json(response);
	} catch (error) {
		if (error instanceof CustomError) throwError(error.statusCode, error.message);
		throwError(500, "INTERNAL SERVER ERROR");
	}
});

export const getOrdersByUserID = asyncWrap(async (req, res) => {
	try {
		const { id } = req.params;
		const queryResult = await db.collection("orders").where("user", "==", id).get();

		const orders = queryResult.docs.map((doc) => doc.data() as Order);

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "SUCCESS",
			data: {
				length: orders.length,
				orders: orders,
			},
		};

		res.status(200).json(response);
	} catch (error) {
		if (error instanceof CustomError) throwError(error.statusCode, error.message);
		throwError(500, "INTERNAL SERVER ERROR");
	}
});

export const getOrdersByShopID = asyncWrap(async (req, res) => {
	try {
		const { id } = req.params;
		const queryResult = await db.collection("orders").where("shop", "==", id).get();

		const orders = queryResult.docs.map((doc) => doc.data() as Order);

		const response: ApiResponse = {
			status: 200,
			success: true,
			message: "SUCCESS",
			data: {
				length: orders.length,
				orders: orders,
			},
		};

		res.status(200).json(response);
	} catch (error) {
		if (error instanceof CustomError) throwError(error.statusCode, error.message);
		throwError(500, "INTERNAL SERVER ERROR");
	}
});

export const updateOrderStatus = asyncWrap(async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const orderRef = db.collection("orders").doc(id);
		const exists = (await orderRef.get()).exists;

		if (!exists) throwError(404, "NOT FOUND");

		if (!Object.values(OrderStatus).includes(status as OrderStatus)) throwError(400, "Invalid request");

		await orderRef.update({
			status: status as OrderStatus,
		});

		const response: ApiResponse = {
			status: 202,
			success: true,
			message: "UPDATED",
			data: { id },
		};

		res.status(202).json(response);
	} catch (error) {
		console.log(error);
		if (error instanceof CustomError) throwError(error.statusCode, error.message);
		throwError(500, "INTERNAL SERVER ERROR");
	}
});
