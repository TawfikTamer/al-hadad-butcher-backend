import { ordersModel } from "../models";
import { IOrders } from "../../Common";
import { BaseRepository } from "./base.repository";
import { FilterQuery, PaginateOptions } from "mongoose";

export class OrderRepository extends BaseRepository<IOrders> {
  constructor() {
    super(ordersModel);
  }

  async orderPagination(
    filters?: FilterQuery<IOrders>,
    options?: PaginateOptions
  ) {
    return await ordersModel.paginate(filters, options);
  }
}
