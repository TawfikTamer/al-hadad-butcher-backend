import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IAuthRequest extends Request {
  loggedInUser: {
    decodedData?: JwtPayload;
  };
}
