import { Router } from "express";
import ordersService from "./orders.service";
import { authorizationMiddleware } from "../../Middlewares";

const orderRouter = Router();
orderRouter.post(
  "/create-order",
  authorizationMiddleware,
  ordersService.createOrder
);
orderRouter.get("/get-all-orders", ordersService.getAllOrders);
orderRouter.get(
  "/get-user-orders",
  authorizationMiddleware,
  ordersService.getUserOrders
);
orderRouter.get(
  "/get-user-specific-order/:orderId",
  authorizationMiddleware,
  ordersService.getSpecificOrder
);
orderRouter.delete("/delete-order/:orderId", ordersService.deleteOrder);

export default orderRouter;
