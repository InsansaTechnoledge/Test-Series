import cron from "node-cron";
// import { getOrganizationModel } from "../models/FirstDB/organization.model.js";
const { Organization } = import ("../models/FirstDB/organization.model.js")

const AutoInactive = async () => {

// const Organization = getOrganizationModel();

  cron.schedule('0 0 * * *', async () => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 3); 
  
      const result = await Organization.updateMany(
        {
          'subscription.endDate': { $lt: cutoffDate },
          'subscription.status': { $ne: 'inactive' }
        },
        {
          $set: {
            'subscription.status': 'inactive'
          }
        }
      );
  
      console.log(`[Scheduler] Updated ${result.modifiedCount} organizations to 'inactive'`);
    } catch (e) {
      console.error('[Scheduler Error] Failed to auto-deactivate organizations:', e.message);
    }
  });

  console.log('[Scheduler] Cron job scheduled for midnight daily');
};

export default AutoInactive;
