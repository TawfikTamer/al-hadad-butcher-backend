import mongoose from "mongoose";
import { IOrders } from "../../Common";

const orderSchema = new mongoose.Schema<IOrders>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "None",
    },
  },
  { timestamps: true }
);

export const ordersModel = mongoose.model<IOrders>("Orders", orderSchema);
