import { Request, Response } from "express";
import { ProductRepository } from "../../DB/Repositories";
import { SuccessResponse } from "../../Utils";

// Products service: fetch products lists
class ProductsService {
  productsRep: ProductRepository = new ProductRepository();

  /**
   * Return all non-deleted products.
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  allProduct = async (req: Request, res: Response) => {
    const allProducts = await this.productsRep.findDocuments(
      { isDeleted: false },
      "-createdAt -updatedAt -__v "
    );

    return res
      .status(200)
      .json(SuccessResponse("here are all the products", 200, allProducts));
  };

  /**
   * Return all soft-deleted products.
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
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
