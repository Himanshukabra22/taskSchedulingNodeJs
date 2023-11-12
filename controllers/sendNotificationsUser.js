const schedule = require("node-schedule");
const moment = require("moment-timezone");
const {notifier} = require("./notifier")
const {dayToDigit} = require("./dayToDigit")

const cancelExistingJobs = (user) => {
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
    for (const userTimeIST of timeSlots) {

      const cronExpression = `${userTimeIST.split(":")[1]} ${userTimeIST.split(":")[0]} * * ${dayToDigit(day)}`

      console.log(cronExpression);

      const userEntity = {
        name : user.name,
        email : user.email,
        time : userTimeIST,
        message : "Hello!!"
      }

      // Schedule a job to send a notification at the specified time
      schedule.scheduleJob(
        `user_${user._id}_${day}_${userTimeIST}`, // Unique job name based on user, day, and timeSlot
        cronExpression,
        () => {
          console.log("Scheduler called!!");
          notifier(userEntity);
        }
      );
    }
  }
};

module.exports = { sendNotificationsForUser };
