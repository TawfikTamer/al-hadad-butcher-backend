import fs from "node:fs";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { fileExtensionsEnum, fileTypeEnum } from "../Common";

const CreateFolde = (path: string) => {
  fs.mkdirSync(path, { recursive: true });
};

export const localUpload = ({ path = `sample`, limits = {} }) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const filePath = `Uploads/${path}`;
      CreateFolde(filePath);
      cb(null, filePath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);

      cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
  });

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    const [type, ext] = file.mimetype.split("/");

    if (!(Object.values(fileTypeEnum) as string[]).includes(type)) {
      return cb(new Error("This type is not support"));
    }

    const extenstion = fileExtensionsEnum[type as fileTypeEnum];
    if (!extenstion.includes(ext)) {
      return cb(new Error("This extenstion is not support"));
    }
    cb(null, true);
  };

  return multer({ storage, fileFilter, limits });
};
