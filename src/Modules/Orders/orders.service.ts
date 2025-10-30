import { Request, Response } from "express";
import { OrderRepository } from "../../DB/Repositories/order.repository";
import { IOrders } from "../../Common";
import { BadRequestException, SuccessResponse } from "../../Utils";
import { DeleteResult } from "mongoose";

class OrderService {
  orderRep: OrderRepository = new OrderRepository();

  createOrder = (req: Request, res: Response) => {
    // get data from body
    const {
      fullName,
      email,
      phoneNumber,
      zone,
      address,
      orderItem,
      additionalInfo,
    } = req.body as IOrders;

    if (!fullName || !email || !phoneNumber || !zone || !address || !orderItem)
      throw new BadRequestException("All required fields must be provided");

    if (!orderItem.length)
      throw new BadRequestException("this request doesn't have any orders");

    // create the order
    this.orderRep.createNewDocument({
      fullName,
      email,
      phoneNumber,
      zone,
      address,
      orderItem,
      additionalInfo,
    });

    res.status(201).json(SuccessResponse("order added", 201));
  };
  getAllOrders = async (req: Request, res: Response) => {
    const orders = await this.orderRep.findDocuments(
      {},
      {},
      {
        populate: {
          path: "orderItem.productId",
          select: "-createdAt -updatedAt -__v -price -isAvailable",
        },
      }
    );

    res.status(200).json({ orders });
  };
  deleteOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const isDeleted = await this.orderRep.deleteOneDocument({ _id: orderId });
    if (!(isDeleted as DeleteResult).deletedCount)
      throw new BadRequestException("there is no such order to delete");

    res.status(200).json(SuccessResponse("order has been deleted"));
  };
  getUserOrders = (req: Request, res: Response) => {};
}

export default new OrderService();
