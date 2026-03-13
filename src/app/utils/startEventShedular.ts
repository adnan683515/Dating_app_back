import cron from "node-cron";
import { Event } from "../modules/Events/event.model";
import { EStatus } from "../modules/Events/event.interface";

export function startEventScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    const nowUTC = new Date(); // already UTC internally
    console.log("Cron running at UTC:", nowUTC.toISOString());

    try {

      // Step 1: NOSTART → OPPENDOOR
      const res1 = await Event.updateMany(
        {
          status: EStatus.NOSTART,
          openDoor: { $lte: nowUTC },
        },
        {
          $set: { status: EStatus.OPPENDOOR },
        }
      );

      console.log(
        "NOSTART → OPPENDOOR:",
        res1.matchedCount,
        res1.modifiedCount
      );

      // Step 2: OPPENDOOR → GOING (start_date_time)
      const res2 = await Event.updateMany(
        {
          status: EStatus.OPPENDOOR,
          start_date_time: { $lte: nowUTC },
        },
        {
          $set: { status: EStatus.GOING },
        }
      );

      console.log(
        "OPPENDOOR → GOING:",
        res2.matchedCount,
        res2.modifiedCount
      );

      // Step 3: GOING → END (end_date_time)
      const res3 = await Event.updateMany(
        {
          status: EStatus.GOING,
          end_date_time: { $lte: nowUTC },
        },
        {
          $set: { status: EStatus.END },
        }
      );

      console.log(
        "GOING → END:",
        res3.matchedCount,
        res3.modifiedCount
      );

    } catch (err) {
      console.error("Error updating event statuses:", err);
    }
  });
}