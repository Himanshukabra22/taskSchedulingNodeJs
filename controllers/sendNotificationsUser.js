const schedule = require("node-schedule");

const cancelExistingJobs = (user) => {
  // Iterate through each existing job for the user and cancel it
  Object.values(schedule.scheduledJobs).forEach((job) => {
    console.log(job);
    if (job.name.startsWith(`user_${user._id}`)) {
      job.cancel();
    }
  });
};

const sendNotificationsForUser = async (user) => {
  // Cancel existing jobs for the user's schedule
  cancelExistingJobs(user);

  // Iterate through each day in the user's schedule
  for (const daySchedule of user.schedule) {
    const { day, timeSlots } = daySchedule;

    // Iterate through each time slot for the day
    for (const timeSlot of timeSlots) {
      // Create a cron expression for the scheduled time
      const cronExpression = `${timeSlot.split(":")[1]} ${
        timeSlot.split(":")[0]
      } * * ${day}`;

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
};

module.exports = { sendNotificationsForUser };
