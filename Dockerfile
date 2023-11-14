# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV MONGO_URI="mongodb://localhost:27017/vysiontech"
ENV PORT=3000
ENV JWT_SECRET="abcdefghijklmnopqrstuvwxyz012345"

# Define the command to run your application
CMD ["npm", "start"]
