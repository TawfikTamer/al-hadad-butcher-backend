import mongoose from "mongoose";
import { categoryEnum, IProduct } from "../../Common";

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: categoryEnum,
      required: true,
    },
    image: String,
    imagePath: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    weight: String,
  },
  { timestamps: true }
);

export const productsModel = mongoose.model<IProduct>(
  "Products",
  productSchema
);
