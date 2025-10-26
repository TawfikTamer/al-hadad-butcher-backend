import { Router } from "express";
import { authorizationMiddleware } from "../../Middlewares";
import cartService from "./cart.service";

const cartRoute = Router();
cartRoute.post("/add-to-cart", authorizationMiddleware, cartService.addToCart);
cartRoute.get("/list-cart", authorizationMiddleware, cartService.listCart);
cartRoute.patch(
  "/delete-item",
  authorizationMiddleware,
  cartService.deleteFromCart
);
cartRoute.patch(
  "/update-item",
  authorizationMiddleware,
  cartService.updateOnCart
);
export { cartRoute };
