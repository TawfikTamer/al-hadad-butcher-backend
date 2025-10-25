import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({}, { timestamps: true });

export const orderModel = mongoose.model("Orders", orderSchema);

/**
 *
 * add to cart
 * get cart
 * delete from cart
 * update
 *
 *
 *
 *
 */
