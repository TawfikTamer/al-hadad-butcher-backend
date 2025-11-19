import { Router } from "express";
import AdminService from "./admin.service";
import { localUpload, validationMiddleware } from "../../Middlewares";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware";
import {
  addProductValidator,
  signInValidator,
  updateProductValidator,
} from "../../Utils";

const adminRouter = Router();

adminRouter.post(
  "/signIn",
  validationMiddleware(signInValidator),
  AdminService.signIn
);

adminRouter.get("/userAuth", authenticationMiddleware, AdminService.userAuth);
adminRouter.post("/logOut", authenticationMiddleware, AdminService.logOut);

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

export { adminRouter };
