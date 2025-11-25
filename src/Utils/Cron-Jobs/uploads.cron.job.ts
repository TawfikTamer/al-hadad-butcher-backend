// import fs from "node:fs";
import cron from "node-cron";
import { ProductRepository } from "../../DB/Repositories";
import fs from "node:fs";
import path from "node:path";

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
    const imagesFromDB = await productRepo.findDocuments({}, "imagePath -_id");
    const paths = imagesFromDB.map((image) =>
      path.basename(image.imagePath || ``)
    );
    let storedImagas = fs.readdirSync("Uploads/product Images");
    let filter = storedImagas.filter((image) => {
      if (!paths.includes(image)) return image;
    });
    if (filter.length !== storedImagas.length) {
      filter.forEach((pic) => {
        fs.unlinkSync(`Uploads/product Images/${pic}`);
        console.log(`unlinked photos have been deleted`);
      });
    }
  });
};
