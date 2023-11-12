const User = require("../models/user");

const notifier = async (user) => {
  try {
    const { name, email } = user;

    const user = await User.findOne({ name });
    // const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const registrationToken = user.fcmToken;

    const payload = {
      notification: {
        title: "Notification Title",
        body: "This is the notification body.",
      },
    };

    // Send the notification to the user's device
    await admin.messaging().sendToDevice(registrationToken, payload);
    console.log(`Notification sent successfully to : ${user}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { notifier };
