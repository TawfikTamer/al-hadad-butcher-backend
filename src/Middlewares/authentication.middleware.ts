import { NextFunction, Request, Response } from "express";
import { BadRequestException, verifyToken } from "../Utils";
import { IAuthRequest } from "../Common";

export const authenticationMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const accesstoken = req.cookies?.accesstoken || undefined;

  if (!accesstoken) throw new BadRequestException("يرجى إدراج التوكن");

  const decodedData = verifyToken(
    accesstoken,
    process.env.JWT_ACCESS_KEY as string
  );
  if (!decodedData.jti) throw new BadRequestException("التوكن غير صحيح");

  (req as IAuthRequest).loggedInUser = { decodedData };

  next();
};
