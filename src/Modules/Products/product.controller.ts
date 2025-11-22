import { Router } from "express";
import productService from "./product.service";

// Create product router
const productRouter = Router();

// Public product routes
productRouter.get("/all", productService.allProduct);
productRouter.get("/soft-deleted", productService.softDeletedProduct);

// Export product router
export { productRouter };
