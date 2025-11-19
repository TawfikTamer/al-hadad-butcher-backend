import { Request, Response } from "express";
import { ProductRepository } from "../../DB/Repositories/products.repository";
import { IAuthRequest, IProduct } from "../../Common";
import {
  BadRequestException,
  generateToken,
  SuccessResponse,
} from "../../Utils";
import fs from "node:fs";
import { v4 as uuidV4 } from "uuid";
import { Secret, SignOptions } from "jsonwebtoken";

class AdminService {
  productsRep = new ProductRepository();

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
        httpOnly: true, // Prevent client-side access
        sameSite: "lax",
        secure: false, // true in production
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      })
      .json(SuccessResponse("تم تسجيل الدخول بنجاح", 200, { accesstoken }));
  };

  logOut = async (req: Request, res: Response) => {
    res.clearCookie("accesstoken", {
      httpOnly: true, // Prevent client-side access
      sameSite: "lax",
      secure: false, // true in production
    });

    res.status(200).json(SuccessResponse("تم تسجيل الخروج بنجاح", 200));
  };

  addProduct = async (req: Request, res: Response) => {
    const { name, price, description, category }: Partial<IProduct> = req.body;
    const imagefile = req.file;

    if (!name) throw new BadRequestException("حقل الاسم مطلوب");
    if (!description) throw new BadRequestException("حقل الوصف مطلوب");
    if (!price) throw new BadRequestException("حقل السعر مطلوب");
    if (!category) throw new BadRequestException("حقل الفئة مطلوب");

    // check if the product is already exist
    const isExist = await this.productsRep.findOneDocument({ name });
    if (isExist) throw new BadRequestException("هذا المنتج موجود بالفعل");

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

  softDeleteProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;

    const product = await this.productsRep.findOneDocument({ _id: productID });
    if (!product) throw new BadRequestException("هذا المنتج غير موجود");

    // soft delete the product
    product.isDeleted = true;
    await product.save();

    return res.status(200).json(SuccessResponse("تم حذف المنتج بنجاح", 200));
  };

  hardDeleteProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;

    const product = await this.productsRep.findOneDocument({ _id: productID });
    if (!product) throw new BadRequestException("هذا المنتج غير موجود");

    // delete the image of the product
    if (product.imagePath && product.imagePath != "NO path") {
      fs.unlinkSync(product.imagePath as string);
    }

    // hard delete the product
    await product.deleteOne();

    return res.status(200).json(SuccessResponse("تم حذف المنتج بنجاح", 200));
  };

  userAuth = async (req: Request, res: Response) => {
    const user = (req as IAuthRequest).loggedInUser;
    return res
      .status(200)
      .json(SuccessResponse("المستخدم المسجل", 200, { user }));
  };
}

export default new AdminService();
