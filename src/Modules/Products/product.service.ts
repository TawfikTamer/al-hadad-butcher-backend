import { Request, Response } from "express";
import { ProductRepository } from "../../DB/Repositories/products.repository";
import { SuccessResponse } from "../../Utils";

class ProductsService {
  productsRep: ProductRepository = new ProductRepository();

  allProduct = async (req: Request, res: Response) => {
    const allProducts = await this.productsRep.findDocuments(
      { isDeleted: false },
      "-createdAt -updatedAt -__v "
    );

    return res
      .status(200)
      .json(SuccessResponse("here are all the products", 200, allProducts));
  };

  softDeletedProduct = async (req: Request, res: Response) => {
    const allProducts = await this.productsRep.findDocuments(
      { isDeleted: true },
      "-createdAt -updatedAt -__v "
    );

    return res
      .status(200)
      .json(SuccessResponse("here are all the products", 200, allProducts));
  };
}

export default new ProductsService();
