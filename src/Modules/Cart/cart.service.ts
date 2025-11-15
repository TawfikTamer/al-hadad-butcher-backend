import { Request, Response } from "express";
import { CartRepository, ProductRepository } from "../../DB/Repositories";
import { IAuthRequest, ICartItem } from "../../Common";
import mongoose from "mongoose";
import { BadRequestException, SuccessResponse } from "../../Utils";

class CartService {
  cartRepo = new CartRepository();
  productRepo = new ProductRepository();

  addToCart = async (req: Request, res: Response) => {
    const { cartDoc, token } = (req as IAuthRequest).loggedInUser;
    let { productId, quantity, price } = req.body;

    productId = new mongoose.Types.ObjectId(productId);
    quantity = quantity < 0.25 ? 0.25 : quantity;

    const isAvailable = await this.productRepo.findDocumentById(productId);
    if (!isAvailable) throw new BadRequestException("هذا المنتج غير صالح");

    let productIsExist = false;
    if (cartDoc?.items) {
      for (const item of cartDoc.items) {
        if (item.productId._id?.toString() == productId) {
          item.quantity += quantity;
          productIsExist = true;
          break;
        }
      }
    }
    if (!productIsExist) {
      const newItem: ICartItem = { productId, quantity, price };
      cartDoc?.items?.push(newItem);
    }

    await cartDoc?.save();

    // create cookies
    res
      .status(200)
      .cookie("guestUser", token, {
        httpOnly: true, // Prevent client-side access
        sameSite: "lax",
        secure: false, // true in production
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      })
      .json(SuccessResponse("تمت إضافة المنتج إلى السلة", 200, { cartDoc }));
  };

  listCart = async (req: Request, res: Response) => {
    const { cartDoc, token } = (req as IAuthRequest).loggedInUser;

    res
      .status(200)
      .cookie("guestUser", token, {
        httpOnly: true, // Prevent client-side access
        sameSite: "lax",
        secure: false, // true in production
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      })
      .json(SuccessResponse("هنا سلتك", 200, cartDoc));
  };

  deleteFromCart = async (req: Request, res: Response) => {
    const { cartDoc, token } = (req as IAuthRequest).loggedInUser;
    let { productId } = req.body;

    if (cartDoc?.items) {
      cartDoc.items = cartDoc.items.filter(
        (item) => item.productId._id != productId
      );
      await cartDoc.save();
    }

    res
      .status(200)
      .cookie("guestUser", token, {
        httpOnly: true, // Prevent client-side access
        sameSite: "lax",
        secure: false, // true in production
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      })
      .json(SuccessResponse("تم حذف المنتج من السلة", 200, cartDoc));
  };

  updateOnCart = async (req: Request, res: Response) => {
    const { cartDoc, token } = (req as IAuthRequest).loggedInUser;
    let { productId, quantity } = req.body;

    productId = new mongoose.Types.ObjectId(productId);
    quantity = quantity < 0.25 ? 0.25 : quantity;
    const isAvailable = await this.productRepo.findDocumentById(productId);
    if (!isAvailable) throw new BadRequestException("هذا المنتج غير صالح");

    if (cartDoc?.items)
      for (const item of cartDoc.items) {
        if (item.productId._id?.toString() == productId) {
          item.quantity = quantity;
          break;
        }
      }

    await cartDoc?.save();

    // create cookies
    res
      .status(200)
      .cookie("guestUser", token, {
        httpOnly: true, // Prevent client-side access
        sameSite: "lax",
        secure: false, // true in production
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      })
      .json(SuccessResponse("تمت إضافة المنتج إلى السلة", 200, { cartDoc }));
  };

  confirmOrder = (req: Request, res: Response) => {};
}

export default new CartService();
