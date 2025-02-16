# Node Image
FROM node:16

RUN apt-get update && apt-get install -y texlive-latex-base

# Set app directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

# Ensure the output folder exists
RUN mkdir -p output

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "app.js"]
