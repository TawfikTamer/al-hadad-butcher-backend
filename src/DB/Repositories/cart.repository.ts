import { ICart } from "../../Common";
import { cartModel } from "../models";
import { BaseRepository } from "./base.repository";

export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(cartModel);
  }
}
