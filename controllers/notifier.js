const User = require("../models/user")

const notifier = async (user) => {
    try {
      // Replace this with your actual logic to get the user details based on some identifier
      const { name, email } = user;
  
      // Fetch the user from MongoDB using the provided username or email
      const user = await User.findOne({ name }); // Update this based on your schema
      // const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const registrationToken = user.fcmToken;
  
      const payload = {
        notification: {
          title: 'Notification Title',
          body: 'This is the notification body.',
        },
      };
  
      // Send the notification to the user's device
      await admin.messaging().sendToDevice(registrationToken, payload);
      console.log(`Notification sent successfully to : ${user}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
};

module.exports = {notifier}