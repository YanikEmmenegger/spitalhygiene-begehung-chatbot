# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the internal port
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "start"]
