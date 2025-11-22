import cron from "node-cron";
import { OrderRepository } from "../../DB/Repositories";

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
    await OrderRep.deleteManyDocuments({
      createdAt: { $lt: cutOffTime },
    });
  });
};
