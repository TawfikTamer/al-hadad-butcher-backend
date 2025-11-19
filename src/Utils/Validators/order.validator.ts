import z from "zod";
import { orderStateEnum } from "../../Common";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const orderItemValidator = z.strictObject({
  productId: objectId,
  quantity: z.number(),
  price: z.number(),
  _id: objectId.optional(),
});

export const createOrderValidator = {
  body: z.strictObject({
    fullName: z.string().trim().min(2, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z.email("البريد الإلكتروني غير صحيح"),
    phoneNumber: z
      .string()
      .regex(/^(010|011|012|015)[0-9]{8}$/, "رقم الهاتف غير صحيح"),
    zone: z.string("لم يتم اخيار منطقة"),
    address: z.string().regex(/[a-zA-Z\u0600-\u06FF]/, "العنوان غير صحيح"),
    orderItem: z.array(orderItemValidator),
    additionalInfo: z.string().optional(),
    orderPrice: z.number().min(0),
    delivieryPrice: z.number().min(0),
    totalPrice: z.number().min(0),
  }),
};
export const changeOrderStateValidator = {
  body: z.strictObject({
    state: z.enum(orderStateEnum, "حالة الاوردر غير صحيحة"),
  }),
};
