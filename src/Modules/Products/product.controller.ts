import { Router } from "express";
import productService from "./product.service";
const productRouter = Router();

productRouter.get("/all", productService.allProduct);

export { productRouter };
