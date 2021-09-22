import OrderStatus from "./OrderStatus";
import ReceiptItem from "./ReceiptItem";

type Order = {
	createdAt: number;
	shop: string;
	user: string;
	shopName: string;
	status: OrderStatus;
	items: Array<ReceiptItem>;
	block: string;
	token: string;
	name: string,
	phoneNo: number;
};

export default Order;
