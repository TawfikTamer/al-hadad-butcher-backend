import { Router } from "express";
import ordersService from "./orders.service";
import {
  authorizationMiddleware,
  validationMiddleware,
} from "../../Middlewares";
import { createOrderValidator } from "../../Utils";

const orderRouter = Router();
orderRouter.post(
  "/create-order",
  authorizationMiddleware,
  validationMiddleware(createOrderValidator),
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
