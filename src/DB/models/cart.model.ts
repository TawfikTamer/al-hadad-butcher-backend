import mongoose from "mongoose";
import { ICart } from "../../Common";

const cartSchema = new mongoose.Schema<ICart>(
  {
    userID: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prodects",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function () {
  if (this.items?.length) {
    this.totalItems = this.items.length;
    this.totalCharge = 0;
    this.items.forEach((Element) => {
      this.totalCharge! += Element.quantity * Element.price;
    });
  }
});

export const cartModel = mongoose.model<ICart>("Cart", cartSchema);
