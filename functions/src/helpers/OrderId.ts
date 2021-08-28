import * as OrderId from "order-id";

const orderIdGenerator = OrderId.default("62345737-7856-4ea3-b74d-0880f0095ce5")

const generateOrderId = () => orderIdGenerator.generate();

export default generateOrderId;
