const schedule = require("node-schedule")


function cancelExistingJobs(user) {
    // Iterate through each existing job for the user and cancel it
    schedule.scheduledJobs.forEach((job) => {
      if (job.name.startsWith(`user_${user._id}`)) {
        job.cancel();
      }
    });
  }

async function sendNotificationsForUser(user) {
    // Cancel existing jobs for the user's schedule
    cancelExistingJobs(user);
  
    // Iterate through each day in the user's schedule
    for (const daySchedule of user.schedule) {
      const { day, timeSlots } = daySchedule;
  
      // Iterate through each time slot for the day
      for (const timeSlot of timeSlots) {
        // Create a cron expression for the scheduled time
        const cronExpression = `${timeSlot.split(':')[1]} ${timeSlot.split(':')[0]} * * ${day}`;
  
        // Schedule a job to send a notification at the specified time
        schedule.scheduleJob(
          `user_${user._id}_${day}_${timeSlot}`, // Unique job name based on user, day, and timeSlot
          cronExpression,
          () => {
            user.sendNotification(`It's time to clean at ${timeSlot}`);
          }
        );
      }
    }
  }

  module.exports = {sendNotificationsForUser}
  
  // Route to update an existing user
  
  // ... (remaining code)
  