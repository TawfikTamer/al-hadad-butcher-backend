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
    orderItem: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0.25,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    userID: {
      type: String,
      required: true,
    },
    deletedByAdmin: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ordersModel = mongoose.model<IOrders>("Orders", orderSchema);
