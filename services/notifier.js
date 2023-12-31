const User = require("../models/user");
const admin = require('firebase-admin');

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const notifier = async ({name, email,time,message}) => {
  try {

    const user = await User.findOne({ name });
    // const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const registrationToken = user.fcmToken;
    console.log(registrationToken);
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
