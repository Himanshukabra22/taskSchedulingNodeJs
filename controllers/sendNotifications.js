const UserModel = require("../models/user")
const schedule = require('node-schedule');

const sendNotificationsAll = async () => {
    try {
      const users = await UserModel.find();
  
      for (const user of users) {
        for (const daySchedule of user.schedule) {
          const { day, timeSlots } = daySchedule;
  
          for (const timeSlot of timeSlots) {
            const cronExpression = `${timeSlot.split(':')[1]} ${timeSlot.split(':')[0]} * * ${day}`;

            schedule.scheduleJob(cronExpression, () => {
              user.sendNotification(`It's time to clean at ${timeSlot}`);
            });
          }
        }
      }

      console.log('Notification jobs scheduled successfully.');
    } catch (error) {
      console.error('Error scheduling notification jobs:', error);
    }
  }
  
module.exports = {sendNotificationsAll};