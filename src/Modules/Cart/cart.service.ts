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

    const isAvailable = await this.productRepo.findDocumentById(productId);
    if (!isAvailable)
      throw new BadRequestException("this product is not valid");

    const newItem: ICartItem = { productId, quantity, price };
    cartDoc?.items?.push(newItem);
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
      .json(SuccessResponse("added to cart", 200, { cartDoc }));
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
      .json(SuccessResponse("here is your cart", 200, cartDoc));
  };

  confirmOrder = (req: Request, res: Response) => {};

  deleteFromCart = (req: Request, res: Response) => {};

  updateOnCart = (req: Request, res: Response) => {};
}

export default new CartService();
