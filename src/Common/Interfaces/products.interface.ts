import { Document } from "mongoose";
import { categoryEnum } from "../Enums/products.enum";

export interface IProduct extends Document {
  name: string;
  description?: String;
  price: number;
  category: categoryEnum;
  image: string | undefined;
  imagePath: string | undefined;
  weight?: string;
  isAvailable: boolean;
}
