FROM node:10.15.0

# Install app dependencies
WORKDIR /install
COPY package.json package-lock.json ./
RUN npm install
ENV NODE_PATH=/install/node_modules

# Bundle app source
WORKDIR /app
COPY . .

# Build js stuff
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "static-file-server" ]
