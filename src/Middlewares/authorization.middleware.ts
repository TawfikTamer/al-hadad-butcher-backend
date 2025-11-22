import { NextFunction, Request, Response } from "express";
import { Secret, SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateToken, verifyToken } from "../Utils";
import { IAuthRequest } from "../Common";

export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let guestUserToken = req.cookies?.guestUser;
  let cartDoc;
  let userID;

  if (!guestUserToken) {
    // create new token for the user
    const tokenId = uuidv4();
    userID = `user_${tokenId}`;
    guestUserToken = generateToken(
      {
        userID,
      },
      process.env.JWT_USER_GUEST_KEY as Secret,
      {
        expiresIn: process.env
          .JWT_USER_GUEST_EXPIRES_IN as SignOptions["expiresIn"],
        jwtid: tokenId,
      }
    );
  } else {
    // decode the token
    const decodedData = verifyToken(
      guestUserToken,
      process.env.JWT_USER_GUEST_KEY as string
    );
    userID = decodedData.userID;
  }

  (req as IAuthRequest).loggedInUser = {
    cartDoc,
    token: guestUserToken,
    userID,
  };
  res.cookie("guestUser", guestUserToken, {
    httpOnly: true, // Prevent client-side access
    sameSite: "none",
    secure: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  next();
};
