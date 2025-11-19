import { Router } from "express";
import productService from "./product.service";
const productRouter = Router();

productRouter.get("/all", productService.allProduct);
productRouter.get("/soft-deleted", productService.softDeletedProduct);

export { productRouter };
