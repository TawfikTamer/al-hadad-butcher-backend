import jwt, { JwtPayload, Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

// generate token
export const generateToken = (
  payload: string | object | Buffer,
  key: Secret,
  options?: SignOptions
): string => {
  return jwt.sign(payload, key, options);
};

// verify token
export const verifyToken = (token: string, key: Secret, options?: VerifyOptions): JwtPayload => {
  return jwt.verify(token, key, options) as JwtPayload;
};
