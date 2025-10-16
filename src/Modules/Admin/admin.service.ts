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

  logOut = async (req: Request, res: Response) => {
    res.clearCookie("accesstoken", {
      httpOnly: true, // Prevent client-side access
      sameSite: "lax",
      secure: false, // true in production
    });

    res.status(200).json(SuccessResponse("Logged out successfully", 200));
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
    try {
      const { name, price, description, category } = req.body;
      const { productID } = req.params;
      const imagefile = req.file;

      // Validate productID
      if (!productID) {
        throw new BadRequestException("Product ID is required");
      }

      // Check if the product exists
      const product = await this.productsRep.findOneDocument(
        { _id: productID },
        "-__v -createdAt -updatedAt -isAvailable"
      );

      if (!product) {
        throw new BadRequestException("This product does not exist");
      }

      // Update fields only if they are provided
      if (name) product.name = name;
      if (price) product.price = price;
      if (description) product.description = description;
      if (category) product.category = category;

      // Handle image update
      if (imagefile) {
        // Delete old image if it exists
        if (product.imagePath && product.imagePath !== "No path") {
          try {
            fs.unlinkSync(product.imagePath as string);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
        product.image = imagefile.filename;
        product.imagePath = imagefile.path;
      }

      // Save the updated product
      await product.save();

      // Prepare response without sensitive data
      const productResponse = product.toObject();
      delete productResponse.imagePath;

      return res
        .status(200)
        .json(
          SuccessResponse(
            "Product has been updated successfully",
            200,
            productResponse
          )
        );
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { productID } = req.params;

      // Validate productID
      if (!productID) {
        throw new BadRequestException("Product ID is required");
      }

      const product = await this.productsRep.findOneDocument({
        _id: productID,
      });
      if (!product) {
        throw new BadRequestException("This product does not exist");
      }

      // Delete the image of the product
      if (product.imagePath && product.imagePath !== "No path") {
        try {
          fs.unlinkSync(product.imagePath as string);
        } catch (err) {
          console.error("Error deleting image:", err);
          // Continue with product deletion even if image deletion fails
        }
      }

      // Delete the product
      await product.deleteOne();

      return res
        .status(200)
        .json(SuccessResponse("Product has been deleted successfully", 200));
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  };

  userAuth = async (req: Request, res: Response) => {
    const user = (req as IAuthRequest).loggedInUser;
    return res
      .status(200)
      .json(SuccessResponse("logged in user", 200, { user }));
  };
}

export default new AdminService();
