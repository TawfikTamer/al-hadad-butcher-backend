import { IProduct } from "../../Common";
import { productsModel } from "../models";
import { BaseRepository } from "./base.repository";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(productsModel);
  }
}
