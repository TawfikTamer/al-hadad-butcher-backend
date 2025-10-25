import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ICart } from "./cart.interface";

export interface IAuthRequest extends Request {
  loggedInUser: {
    decodedData?: JwtPayload;
    cartDoc?: ICart | null;
    token?: string;
  };
}
