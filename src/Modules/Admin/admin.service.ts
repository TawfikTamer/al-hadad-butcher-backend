import { Request, Response } from "express";
import { ProductRepository } from "../../DB/Repositories/products.repository";
import { IProduct } from "../../Common";
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
      throw new BadRequestException("invalid email/password");

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
      .json(SuccessResponse("logged in succeccfully", 200, { accesstoken }));
  };

  addProduct = async (req: Request, res: Response) => {
    const { name, price, description, category }: Partial<IProduct> = req.body;
    const imagefile = req.file;

    if (!name) throw new BadRequestException("name field required");
    if (!description)
      throw new BadRequestException("description field required");
    if (!price) throw new BadRequestException("price field required");
    if (!category) throw new BadRequestException("category field required");

    // check if the product is already exist
    const isExist = await this.productsRep.findOneDocument({ name });
    if (isExist) throw new BadRequestException("this product already exist");

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
      SuccessResponse<Partial<IProduct>>("test", 200, {
        name,
        description,
        price,
        category,
        image: imagefile?.filename || "NO Image",
      })
    );
  };

  updateProduct = async (req: Request, res: Response) => {
    const { name, price, description, category }: Partial<IProduct> = req.body;
    const { productID } = req.params;
    const imagefile = req.file;

    // check if the product is not exist
    const product = await this.productsRep.findOneDocument(
      { _id: productID },
      "-__v -createdAt -updatedAt -isAvailable "
    );
    if (!product) throw new BadRequestException("this product is not exist");

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (imagefile) {
      product.image = imagefile.filename;
      product.imagePath = imagefile.path;
    }
    product.save();
    const productResponse = product.toObject();
    productResponse.imagePath = undefined;

    return res
      .status(200)
      .json(SuccessResponse("product has updated", 200, productResponse));
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;

    const product = await this.productsRep.findOneDocument({ _id: productID });
    if (!product) throw new BadRequestException("this product is not exist");

    // delete the image of the product
    if (product.imagePath && product.imagePath != "No path") {
      fs.unlinkSync(product.imagePath as string);
    }

    // delete the product
    await product.deleteOne();

    return res
      .status(200)
      .json(SuccessResponse("product has been deleted", 200));
  };
}

export default new AdminService();
