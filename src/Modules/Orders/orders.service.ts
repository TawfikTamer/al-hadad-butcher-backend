import { Request, Response } from "express";
import TelegramBot, { ChatId } from "node-telegram-bot-api";
import { OrderRepository } from "../../DB/Repositories/order.repository";
import { IAuthRequest, IOrders } from "../../Common";
import {
  BadRequestException,
  emitter,
  newOrderContent,
  orderItemsContet,
  SuccessResponse,
} from "../../Utils";
import { ProductRepository } from "../../DB/Repositories";
import { pagination } from "../../Utils/Pagination/pagination.utils";

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
      orderPrice,
      delivieryPrice,
      totalPrice,
    } = req.body as IOrders;
    // get user Id
    const { userID } = (req as IAuthRequest).loggedInUser;

    if (!fullName || !email || !phoneNumber || !zone || !address || !orderItem)
      throw new BadRequestException("يجب توفير جميع الحقول المطلوبة");

    if (!orderItem.length)
      throw new BadRequestException("هذا الطلب لا يحتوي على أي طلبيات");

    const productsId = orderItem.map((product) => {
      return product.productId;
    });

    const products = await this.productsRep.findDocuments({
      _id: productsId,
      isAvailable: true,
      isDeleted: false,
    });

    if (products.length !== orderItem.length)
      throw new BadRequestException("المنتجات غير متاحة");

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
      orderPrice,
      delivieryPrice,
      totalPrice,
    });

    // send notifications to the admin
    let orderItemsHtml = ``;
    let orderItemsTelegram = [];
    if (
      process.env.TELEGRAM_BOT_ACTIVATE == "ON" ||
      process.env.NODEMAILER_ACTIVAE == "ON"
    ) {
      for (let i = 0; i < orderItem.length; i++) {
        orderItemsTelegram.push({
          name: products[i].name,
          quantity: orderItem[i].quantity,
          unit: "كجم",
          price: products[i].price,
          total: orderItem[i].quantity * products[i].price,
        });
        orderItemsHtml =
          orderItemsHtml +
          orderItemsContet(
            products[i].name,
            orderItem[i].quantity,
            products[i].price,
            orderItem[i].quantity * products[i].price
          );
      }
    }

    // send mail
    if (process.env.NODEMAILER_ACTIVAE == "ON") {
      emitter.emit("sendEmail", {
        to: process.env.ORDER_RECEIVER_EMAIL,
        subject: "new order",
        content: newOrderContent({
          fullName,
          email,
          phoneNumber,
          zone,
          address,
          orderItemsHtml,
          additionalInfo: additionalInfo || `لا يوجد`,
          orderDate: new Date().toLocaleString(),
          orderPrice,
          delivieryPrice,
          totalPrice,
        }),
      });
    }

    // send telegram message
    if (process.env.TELEGRAM_BOT_ACTIVATE == "ON") {
      const telegramMessage = `
🛒 *طلب جديد*
━━━━━━━━━━━━━━━

👤 *بيانات العميل:*
• الاسم: ${fullName}
• الهاتف: ${phoneNumber}
• الإيميل: ${email}
• المنطقة: ${zone}
• العنوان: ${address}

📦 *تفاصيل الطلب:*
${orderItemsTelegram
  .map(
    (item) =>
      `• ${item.name} --> ${item.quantity} ${item.unit} × ${item.price} ج.م = ${item.total} ج.م`
  )
  .join("\n")}

💬 *ملاحظات إضافية:*
${additionalInfo || "لا يوجد"}

💰 *الحساب:*
• سعر الطلب: ${orderPrice} ج.م

🕐 ${new Date().toLocaleString("ar-EG")}
━━━━━━━━━━━━━━━
`;
      const token = process.env.TELEGRAM_BOT_TOKEN || "";
      // Create a bot that uses 'polling' to fetch new updates
      const bot = new TelegramBot(token);
      bot.sendMessage(
        process.env.TELEGRAM_BOT_CHATID as ChatId,
        telegramMessage,
        { parse_mode: "Markdown" }
      );
    }

    res.status(201).json(SuccessResponse("تمت إضافة الطلب", 201));
  };
  getAllOrders = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const { limit: currentLimit } = pagination({
      page: Number(page),
      limit: Number(limit),
    });

    const orders = await this.orderRep.orderPagination(
      {
        deletedByAdmin: false,
      },
      {
        limit: currentLimit,
        page: Number(page),
        populate: {
          path: "orderItem.productId",
          select: "-createdAt -__v -price -isAvailable",
        },
      }
    );

    res.status(200).json({ orders: orders.docs });
  };
  deleteOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await this.orderRep.findOneDocument({ _id: orderId });
    if (!order)
      throw new BadRequestException("لا توجد طلبية بهذا الرقم لحذفها");

    order.deletedByAdmin = true;
    await order.save();

    res.status(200).json(SuccessResponse("تم حذف الطلب بنجاح"));
  };
  changeOrderState = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { state } = req.body;

    const order = await this.orderRep.findOneDocument({ _id: orderId });
    if (!order)
      throw new BadRequestException("لا توجد طلبية بهذا الرقم لتعديلها");

    order.orderState = state;
    await order.save();

    res.status(200).json(SuccessResponse("تم تغير حالة الاوردر بنجاح"));
  };
  getUserOrders = async (req: Request, res: Response) => {
    // get user Id
    const { userID } = (req as IAuthRequest).loggedInUser;

    let userOrders = await this.orderRep.findDocuments(
      { userID },
      {
        orderItem: 1,
        createdAt: 1,
        totalPrice: 1,
        orderState: 1,
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
        if (!item.productId) {
          order.totalPrice =
            Number(order.totalPrice || 0) -
            Number(item.quantity) * Number(item.price);
        }

        return item.productId != null;
      });
      order.save();
      return order.orderItem.length;
    });

    res.status(200).json(SuccessResponse("هنا طلباتك", 200, userOrders));
  };
  getSpecificOrder = async (req: Request, res: Response) => {
    // get user and order IDs
    const { userID } = (req as IAuthRequest).loggedInUser;
    const { orderId } = req.params;

    if (!orderId) throw new BadRequestException("يرجى إدراج رقم الطلبية");

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

    res.status(200).json(SuccessResponse("هنا طلبتك", 200, userOrder));
  };
}

export default new OrderService();
