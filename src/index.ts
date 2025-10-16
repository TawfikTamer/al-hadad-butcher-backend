import "dotenv/config";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import { dbConnection } from "./DB/db.connection";
import { FailedResponse, HttpException } from "./Utils";
import { adminRouter, productRouter } from "./Modules";

import cookieParser from "cookie-parser";

const app = express();

dbConnection();

// // // Handle CORS
// const whitelist = process.env.WHITELIST;
// const corsOptions = {
//   origin: function (origin: any, callback: any) {
//     if (whitelist?.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);

app.use((_req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(
  (
    err: HttpException | Error | null,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof HttpException) {
      return res
        .status(err.statusCode)
        .json(FailedResponse(err.message, err.statusCode, err.error));
    }
    console.log(err);
    res.status(500).json(FailedResponse("Somthing Went Wrong", 500, err));
  }
);

app.listen(process.env.PORT, () => {
  console.log(`server running at ${process.env.PORT}`);
});
