import { Router } from "express";
import ordersService from "./orders.service";

import {
  authorizationMiddleware,
  validationMiddleware,
} from "../../Middlewares";
import { changeOrderStateValidator, createOrderValidator } from "../../Utils";

// Create router for orders
const orderRouter = Router();

// Create a new order
orderRouter.post(
  "/create-order",
  authorizationMiddleware,
  validationMiddleware(createOrderValidator),
  ordersService.createOrder
);

// Change order state
orderRouter.patch(
  "/change-order-state/:orderId",
  authorizationMiddleware,
  validationMiddleware(changeOrderStateValidator),
  ordersService.changeOrderState
);

// Public admin route to get all orders
orderRouter.get("/get-all-orders", ordersService.getAllOrders);

// User-specific order routes
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

// Delete an order (soft delete)
orderRouter.delete("/delete-order/:orderId", ordersService.deleteOrder);

// Export order router
export { orderRouter };
