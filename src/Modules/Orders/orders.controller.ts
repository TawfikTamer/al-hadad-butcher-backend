import { Router } from "express";
import ordersService from "./orders.service";

const orderRouter = Router();
orderRouter.post("/create-order", ordersService.createOrder);
orderRouter.get("/get-all-orders", ordersService.getAllOrders);
orderRouter.delete("/delete-order/:orderId", ordersService.deleteOrder);

export default orderRouter;
