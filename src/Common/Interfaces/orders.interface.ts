import mongoose, { Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  _id?: mongoose.Types.ObjectId;
}

export interface IOrders extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  zone: string;
  address: string;
  additionalInfo?: string;
  orderItem: IOrderItem[];
  userID: string;
  deletedByAdmin: boolean;
  totalPrice: Number;
}
