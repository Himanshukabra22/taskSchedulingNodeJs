const User = require("../models/user");
const schedule = require("node-schedule");
const { dayToDigit } = require("./dayToDigit");

const sendNotificationsAll = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      for (const daySchedule of user.schedule) {
        const { day, timeSlots } = daySchedule;

        for (const userTimeIST of timeSlots) {
          const cronExpression = `${userTimeIST.split(":")[1]} ${
            userTimeIST.split(":")[0]
          } * * ${dayToDigit(day)}`;
          // console.log(cronExpression);

          const userEntity = {
            name: user.name,
            email: user.email,
            time: userTimeIST,
            message: "Hello!!"
          };

          schedule.scheduleJob(cronExpression, () => {
            notifier(userEntity);
          });
        }
      }
    }

    console.log("Notification jobs scheduled successfully.");
  } catch (error) {
    console.error("Error scheduling notification jobs:", error);
  }
};

module.exports = { sendNotificationsAll };
