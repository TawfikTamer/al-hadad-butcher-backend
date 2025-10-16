import { Router } from "express";
import AdminService from "./admin.service";
import { localUpload } from "../../Middlewares";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware";

const adminRouter = Router();

adminRouter.post("/signIn", AdminService.signIn);

adminRouter.get("/userAuth", authenticationMiddleware, AdminService.userAuth);
adminRouter.post("/logOut", authenticationMiddleware, AdminService.logOut);

adminRouter.post(
  "/add-product",
  authenticationMiddleware,
  localUpload({ path: "product Images" }).single("image"),
  AdminService.addProduct
);

adminRouter.patch(
  "/update-product/:productID",
  authenticationMiddleware,
  localUpload({ path: "product Images" }).single("image"),
  AdminService.updateProduct
);

adminRouter.delete(
  "/delete-product/:productID",
  authenticationMiddleware,
  AdminService.deleteProduct
);

export { adminRouter };
