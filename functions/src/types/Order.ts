import OrderItem from "./OrderItem";
import OrderStatus from "./OrderStatus";

type Order = {
  createdAt: number
  shop: string
  user: string
  shopName: string
  status: OrderStatus
  items: Array<OrderItem>
}

export default Order;
