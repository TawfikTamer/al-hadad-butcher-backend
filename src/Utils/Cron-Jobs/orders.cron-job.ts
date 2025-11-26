import cron from "node-cron";
import { OrderRepository } from "../../DB/Repositories";
import { DeleteResult } from "mongoose";

const OrderRep = new OrderRepository();
export const deleteOrdersCronJob = async (
  month: number = 3,
  cronSchedule = "0 0 * * *"
) => {
  if (process.env.RUN_DELETE_ORDER_CRON_JOB !== "ON") {
    console.log(`The delete orders cron job is STOPPED`);
    return;
  }
  console.log(`The delete orders cron Job is running`);

  cron.schedule(cronSchedule, async () => {
    const cutOffTime = new Date();
    cutOffTime.setMonth(cutOffTime.getMonth() - month);
    const deletedOrders = await OrderRep.deleteManyDocuments({
      createdAt: { $lt: cutOffTime },
    });
    console.log(`the delete orders cron job is triggered.`);
    if ((deletedOrders as DeleteResult).deletedCount) {
      console.log(
        `The deleted orders are ${(deletedOrders as DeleteResult).deletedCount}`
      );
    }
  });
};
