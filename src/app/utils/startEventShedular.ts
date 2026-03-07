import cron from 'node-cron';
import { Event } from '../modules/Events/event.model';
import { EStatus } from '../modules/Events/event.interface';

export function startEventScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    const nowUTC = new Date(new Date().toISOString()); // force UTC
    console.log("Cron running at UTC:", nowUTC.toISOString());

    console.log(nowUTC)
    try {
      // Step 1: NOSTART → OPPENDOOR at openDoor
      const res1 = await Event.updateMany(
        { status: EStatus.NOSTART, openDoor: { $lte: nowUTC } },
        { $set: { status: EStatus.OPPENDOOR } }
      );
      console.log("NOSTART → OPPENDOOR:", res1.matchedCount, res1.modifiedCount);

      // Step 2: OPPENDOOR → GOING at startTime
      const res2 = await Event.updateMany(
        { status: EStatus.OPPENDOOR, startTime: { $lte: nowUTC } },
        { $set: { status: EStatus.GOING } }
      );
      console.log("OPPENDOOR → GOING:", res2.matchedCount, res2.modifiedCount);

      // Step 3: GOING → END at endTime
      const res3 = await Event.updateMany(
        { status: EStatus.GOING, endTime: { $lte: nowUTC } },
        { $set: { status: EStatus.END } }
      );
      console.log("GOING → END:", res3.matchedCount, res3.modifiedCount);

      // Step 4: CANCELLED → handled manually, no cron logic needed
    } catch (err) {
      console.error("Error updating event statuses:", err);
    }
  });
}