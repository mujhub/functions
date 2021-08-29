import db from "../config/db";
import { asyncWrap } from "../middleware/async";
import { CustomError, throwError } from "../helpers/ErrorHandler";
import Order from "../types/Order";
import OrderStatus from "../types/OrderStatus";
import ApiResponse from "../types/ApiResponse";
import generateOrderId from "../helpers/OrderId";

export const addOrder = asyncWrap(async (req, res) => {
	try {
    // @ts-ignore
    // console.log(req.locals);
    const newOrder = req.body as Order;
    const orderId = generateOrderId();

    await db.collection("orders").doc(orderId).set(newOrder);
		
    const response: ApiResponse = {
      status: 201,
      success: true,
      message: "CREATED",
      data: {
        "id": orderId
      }
    }

    res.status(201).json(response);
	} catch (error) {
		if (error instanceof CustomError)
      throwError(error.statusCode, error.message);
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
      data: order.data() as Order
    }

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof CustomError)
      throwError(error.statusCode, error.message);
    throwError(500, "INTERNAL SERVER ERROR");
  }
});

export const getOrdersByUserID = asyncWrap(async (req, res) => {
  try {
    const { id } = req.params;
    const queryResult = await db.collection("orders").where("user", "==", id).get();

    const orders = queryResult.docs.map((doc) => doc.data() as Order)
    
    const response: ApiResponse = {
      status: 200,
      success: true,
      message: "SUCCESS",
      data: {
        length: orders.length,
        orders: orders,
      }
    }

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof CustomError)
      throwError(error.statusCode, error.message);
    throwError(500, "INTERNAL SERVER ERROR");
  }
});

export const getOrdersByShopID = asyncWrap(async (req, res) => {
  try {
    const { id } = req.params;
    const queryResult = await db.collection("orders").where("shop", "==", id).get();

    const orders = queryResult.docs.map((doc) => doc.data() as Order)
    
    const response: ApiResponse = {
      status: 200,
      success: true,
      message: "SUCCESS",
      data: {
        length: orders.length,
        orders: orders,
      }
    }

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof CustomError)
      throwError(error.statusCode, error.message);
    throwError(500, "INTERNAL SERVER ERROR");
  }
});

export const updateOrderStatus = asyncWrap(async (req, res) => {
	try {
    const { id } = req.params;
    const { status } = req.body;

    const orderRef = db.collection("orders").doc(id);
    const exists = (await orderRef.get()).exists;

    console.log(exists);

    if (!exists) throwError(404, "NOT FOUND");

    await orderRef.update({
      status: status as OrderStatus
    });
    
    const response: ApiResponse = {
      status: 202,
      success: true,
      message: "UPDATED",
      data: {
        "id": id
      }
    }

    res.status(202).json(response);
  } catch (error) {
    console.log(error)
    if (error instanceof CustomError)
      throwError(error.statusCode, error.message);
    throwError(500, "INTERNAL SERVER ERROR");
  }
});
