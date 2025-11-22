import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  dotenv.config({
    path: `.${process.env.NODE_ENV}.env`,
  });
}
