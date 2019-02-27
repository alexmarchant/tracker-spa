FROM node:10.15.0

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Build js stuff
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "static-file-server" ]
