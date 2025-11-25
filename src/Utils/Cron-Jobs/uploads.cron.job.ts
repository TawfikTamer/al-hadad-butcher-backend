// import fs from "node:fs";
import cron from "node-cron";
import { ProductRepository } from "../../DB/Repositories";
import fs from "node:fs";

const productRepo = new ProductRepository();
export const deleteUnlinkedPhotosCronJob = async (
  cronSchedule = "0 0 * * *"
) => {
  if (process.env.RUN_DELETE_PHOTOS_CRON_JOB !== "ON") {
    console.log(`The delete photos cron job is STOPPED`);
    return;
  }
  console.log(`The delete photos cron Job is running`);

  cron.schedule(cronSchedule, async () => {
    const images = await productRepo.findDocuments({}, "imagePath -_id");
    const paths = images.map((image) => image.imagePath);

    console.log(paths);

    let dic = fs.readdirSync("Uploads/Uploads");
    console.log(dic);
  });
};

// delete photo with no products
