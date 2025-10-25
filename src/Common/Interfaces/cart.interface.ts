import mongoose, { Document } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  _id?: mongoose.Types.ObjectId;
}

export interface ICart extends Document {
  userID: string;
  items?: ICartItem[];
  totalItems?: number;
  totalCharge?: number;
}
