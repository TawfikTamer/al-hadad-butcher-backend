import "./config";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./DB/db.connection";
import { deleteOrdersCronJob, FailedResponse, HttpException } from "./Utils";
import { adminRouter, productRouter, orderRouter } from "./Modules";

// Initialize the express application
const app = express();

// Establish the database connection
dbConnection();

// // CORS Configuration
// const whitelist = process.env.WHITELIST;
// const corsOptions = {
//   origin: function (origin: any, callback: any) {
//     if (!origin) {
//       callback(null, true);
//       return;
//     }
//     if (whitelist?.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// --- Cron Jobs ---
deleteOrdersCronJob(Number(process.env.ORDER_CLEANUP_MONTHS) || 3);

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static files (e.g., product images)
app.use("/photos", express.static("Uploads/product Images"));

app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// --- 404 Not Found Handler ---
app.use((_req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global Error Handling Middleware
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
    res
      .status(500)
      .json(FailedResponse("Somthing Went Wrong", 500, err?.message));
  }
);

// Server Initialization
app.listen(process.env.PORT, () => {
  console.log(`server running at ${process.env.PORT}`);
});
