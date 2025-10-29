import { ordersModel } from "../models";
import { IOrders } from "../../Common";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<IOrders> {
  constructor() {
    super(ordersModel);
  }
}
