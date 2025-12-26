import fs from "node:fs";
import { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";

import { ProductRepository } from "../../DB/Repositories";
import { IAuthRequest, IProduct } from "../../Common";

import {
  BadRequestException,
  generateToken,
  SuccessResponse,
} from "../../Utils";
import { Secret, SignOptions } from "jsonwebtoken";

// Admin service: handles admin-related actions
class AdminService {
  productsRep = new ProductRepository();

  /**
   * Sign in as admin and set auth cookie.
   * @param {Request} req - Express request (body: email, password)
   * @param {Response} res - Express response
   */
  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password != process.env.ADMIN_PASSWORD
    )
      throw new BadRequestException(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );

    // generate token
    const accesstoken = generateToken(
      { email },
      process.env.JWT_ACCESS_KEY as Secret,
      {
        expiresIn: process.env
          .JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
        jwtid: uuidV4(),
      }
    );

    res
      .status(200)
      .cookie("accesstoken", accesstoken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
        secure: process.env.NODE_ENV == "production",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json(SuccessResponse("تم تسجيل الدخول بنجاح", 200, { accesstoken }));
  };

  /**
   * Log out admin by clearing auth cookie.
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  logOut = async (req: Request, res: Response) => {
    res.clearCookie("accesstoken", {
      httpOnly: true, // Prevent client-side access
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      secure: process.env.NODE_ENV == "production",
    });

    res.status(200).json(SuccessResponse("تم تسجيل الخروج بنجاح", 200));
  };

  /**
   * Add a new product (admin).
   * @param {Request} req - Express request (body: product fields, file: image)
   * @param {Response} res - Express response
   */
  addProduct = async (req: Request, res: Response) => {
    const { name, price, description, category }: Partial<IProduct> = req.body;
    const imagefile = req.file;

    if (!name) throw new BadRequestException("حقل الاسم مطلوب");
    if (!description) throw new BadRequestException("حقل الوصف مطلوب");
    if (!price) throw new BadRequestException("حقل السعر مطلوب");
    if (!category) throw new BadRequestException("حقل الفئة مطلوب");

    // check if the product is already exist
    const isExist = await this.productsRep.findOneDocument({
      name,
      isDeleted: false,
    });
    if (isExist) {
      if (req.file?.path) fs.unlinkSync(req.file?.path);
      throw new BadRequestException("هذا المنتج موجود بالفعل");
    }

    // add the product to the DB
    this.productsRep.createNewDocument({
      name,
      description,
      price,
      category,
      image: imagefile?.filename || "NO Image",
      imagePath: imagefile?.path || "NO path",
    });

    res.status(200).json(
      SuccessResponse<Partial<IProduct>>("تمت إضافة المنتج", 200, {
        name,
        description,
        price,
        category,
        image: imagefile?.filename || "NO Image",
      })
    );
  };

  /**
   * Update an existing product by id.
   * @param {Request} req - Express request (params: productID, body: fields)
   * @param {Response} res - Express response
   */
  updateProduct = async (req: Request, res: Response) => {
    const {
      name,
      price,
      description,
      category,
      isAvailable,
    }: Partial<IProduct> = req.body;
    const { productID } = req.params;
    const imagefile = req.file;

    // check if the product is not exist
    const product = await this.productsRep.findOneDocument(
      { _id: productID },
      "-__v -createdAt -updatedAt "
    );
    if (!product) throw new BadRequestException("هذا المنتج غير موجود");

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (isAvailable) product.isAvailable = isAvailable;
    if (imagefile) {
      if (
        product.imagePath &&
        product.imagePath != "NO path" &&
        fs.existsSync(product.imagePath)
      )
        fs.unlinkSync(product.imagePath);
      product.image = imagefile.filename;
      product.imagePath = imagefile.path;
    }
    product.save();
    const productResponse = product.toObject();
    productResponse.imagePath = undefined;

    return res
      .status(200)
      .json(SuccessResponse("تم تحديث المنتج", 200, productResponse));
  };

  /**
   * Soft-delete a product (mark as deleted).
   * @param {Request} req - Express request (params: productID)
   * @param {Response} res - Express response
   */
  softDeleteProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;

    const product = await this.productsRep.findOneDocument({ _id: productID });
    if (!product) throw new BadRequestException("هذا المنتج غير موجود");

    // soft delete the product
    product.isDeleted = true;
    await product.save();

    return res.status(200).json(SuccessResponse("تم حذف المنتج بنجاح", 200));
  };

  /**
   * Hard-delete a product and remove its image file.
   * @param {Request} req - Express request (params: productID)
   * @param {Response} res - Express response
   */
  hardDeleteProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;

    const product = await this.productsRep.findOneDocument({ _id: productID });
    if (!product) throw new BadRequestException("هذا المنتج غير موجود");

    // delete the image of the product
    if (
      product.imagePath &&
      product.imagePath != "NO path" &&
      fs.existsSync(product.imagePath)
    ) {
      fs.unlinkSync(product.imagePath as string);
    }

    // hard delete the product
    await product.deleteOne();

    return res.status(200).json(SuccessResponse("تم حذف المنتج بنجاح", 200));
  };

  /**
   * Return the currently authenticated admin user.
   * @param {Request} req - Express request (auth required)
   * @param {Response} res - Express response
   */
  userAuth = async (req: Request, res: Response) => {
    const user = (req as IAuthRequest).loggedInUser;
    return res
      .status(200)
      .json(SuccessResponse("المستخدم المسجل", 200, { user }));
  };
}

export default new AdminService();
