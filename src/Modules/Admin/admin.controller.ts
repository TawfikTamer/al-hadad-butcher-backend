import { Router } from "express";
import AdminService from "./admin.service";

import {
  localUpload,
  validationMiddleware,
  authenticationMiddleware,
} from "../../Middlewares";

import {
  addProductValidator,
  signInValidator,
  updateProductValidator,
} from "../../Utils";

// Create router for admin module
const adminRouter = Router();

// Auth routes
adminRouter.post(
  "/signIn",
  validationMiddleware(signInValidator),
  AdminService.signIn
);

// Auth check and logout
adminRouter.get("/userAuth", authenticationMiddleware, AdminService.userAuth);
adminRouter.post("/logOut", authenticationMiddleware, AdminService.logOut);

// Product management routes (create/update)
adminRouter.post(
  "/add-product",
  authenticationMiddleware,
  localUpload({ path: "product Images" }).single("image"),
  validationMiddleware(addProductValidator),
  AdminService.addProduct
);

adminRouter.patch(
  "/update-product/:productID",
  authenticationMiddleware,
  localUpload({ path: "product Images" }).single("image"),
  validationMiddleware(updateProductValidator),
  AdminService.updateProduct
);

// Product deletion routes
adminRouter.delete(
  "/soft-delete-product/:productID",
  authenticationMiddleware,
  AdminService.softDeleteProduct
);

adminRouter.delete(
  "/hard-delete-product/:productID",
  authenticationMiddleware,
  AdminService.hardDeleteProduct
);

// Export admin router
export { adminRouter };
