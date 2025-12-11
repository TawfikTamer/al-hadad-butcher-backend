import z from "zod";
import { categoryEnum } from "../../Common";

export const signInValidator = {
  body: z.strictObject({
    email: z.email("بريد الكتروني غير صحيح"),
    password: z.string(
      "كلمة المرور يجب أن تحتوي على 8 أحرف، حرف، رقم، ورمز خاص"
    ),
  }),
};
export const addProductValidator = {
  body: z.strictObject({
    name: z
      .string("اسم المنتج مطلوب")
      .trim()
      .min(1, "اسم المنتج لا يمكن أن يكون فارغاً"),
    price: z.string().regex(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/, "السعر غير صحيح"),
    description: z
      .string("وصف المنتج مطلوب")
      .trim()
      .min(1, "وصف المنتج لا يمكن أن يكون فارغاً"),
    category: z.enum(categoryEnum, "الفئة غير صحيحة"),
  }),
};

export const updateProductValidator = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "اسم المنتج لا يمكن أن يكون فارغاً")
      .optional(),
    price: z
      .string()
      .regex(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/, "السعر غير صحيح")
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, "وصف المنتج لا يمكن أن يكون فارغاً")
      .optional(),
    category: z.enum(categoryEnum, "الفئة غير صحيحة").optional(),
  }),
};
