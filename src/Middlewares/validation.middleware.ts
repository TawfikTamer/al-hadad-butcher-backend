import fs from "node:fs";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestException } from "../Utils";

type RequestKeyType = keyof Request;
type SchemaType = Partial<Record<RequestKeyType, ZodType>>;
export const validationMiddleware = (Schema: SchemaType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const reqKey: RequestKeyType[] = ["body"];
    for (const key of reqKey) {
      if (Schema[key]) {
        const resault = Schema[key].safeParse(req[key]);

        if (!resault?.success) {
          const issues = resault.error.issues.map((issue) => {
            return {
              path: issue.path[0],
              message: issue.message,
            };
          });
          if (req.file?.path) fs.unlinkSync(req.file?.path);
          throw new BadRequestException("خطأ في التحقق من البيانات", issues);
        }
      }
    }
    next();
  };
};
