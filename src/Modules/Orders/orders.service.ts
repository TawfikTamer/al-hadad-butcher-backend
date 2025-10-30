import { Request, Response } from "express";
import { OrderRepository } from "../../DB/Repositories/order.repository";
import { IAuthRequest, IOrders } from "../../Common";
import { BadRequestException, SuccessResponse } from "../../Utils";
import { ProductRepository } from "../../DB/Repositories";

class OrderService {
  orderRep: OrderRepository = new OrderRepository();
  productsRep: ProductRepository = new ProductRepository();

  createOrder = async (req: Request, res: Response) => {
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
    // get user Id
    const { userID } = (req as IAuthRequest).loggedInUser;

    if (!fullName || !email || !phoneNumber || !zone || !address || !orderItem)
      throw new BadRequestException("All required fields must be provided");

    if (!orderItem.length)
      throw new BadRequestException("this request doesn't have any orders");

    const productsId = orderItem.map((product) => {
      return product.productId;
    });

    const products = await this.productsRep.findDocuments({
      _id: productsId,
      isAvailable: true,
    });

    if (products.length !== orderItem.length)
      throw new BadRequestException("products is not available");

    // create the order
    this.orderRep.createNewDocument({
      fullName,
      email,
      phoneNumber,
      zone,
      address,
      orderItem,
      additionalInfo,
      userID,
    });

    res.status(201).json(SuccessResponse("order added", 201));
  };
  getAllOrders = async (req: Request, res: Response) => {
    const orders = await this.orderRep.findDocuments(
      {
        deletedByAdmin: false,
      },
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
    const order = await this.orderRep.findOneDocument({ _id: orderId });
    if (!order)
      throw new BadRequestException("there is no such order to delete");

    order.deletedByAdmin = true;
    await order.save();

    res.status(200).json(SuccessResponse("order has been deleted"));
  };
  getUserOrders = async (req: Request, res: Response) => {
    // get user Id
    const { userID } = (req as IAuthRequest).loggedInUser;

    let userOrders = await this.orderRep.findDocuments(
      { userID },
      {
        orderItem: 1,
        createdAt: 1,
      },
      {
        populate: {
          path: "orderItem.productId",
          select: "-createdAt -updatedAt -__v -price -isAvailable",
        },
      }
    );

    userOrders = userOrders.filter((order) => {
      order.orderItem = order.orderItem.filter((item) => {
        return item.productId != null;
      });
      order.save();
      return order.orderItem.length;
    });

    res
      .status(200)
      .json(SuccessResponse("here is your orders", 200, userOrders));
  };
  getSpecificOrder = async (req: Request, res: Response) => {
    // get user and order IDs
    const { userID } = (req as IAuthRequest).loggedInUser;
    const { orderId } = req.params;

    if (!orderId) throw new BadRequestException("please insert order Id");

    const userOrder = await this.orderRep.findOneDocument(
      {
        userID,
        _id: orderId,
      },
      {},
      {
        populate: {
          path: "orderItem.productId",
          select: "-createdAt -updatedAt -__v -price -isAvailable",
        },
      }
    );

    res.status(200).json(SuccessResponse("here is your order", 200, userOrder));
  };
}

export default new OrderService();
