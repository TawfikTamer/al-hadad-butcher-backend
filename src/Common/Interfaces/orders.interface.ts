import { Document } from "mongoose";

export interface IOrders extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  zone: string;
  address: string;
  additionalInfo?: string;
}
