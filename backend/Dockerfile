FROM node:14
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6000
CMD [ "node", "App.js" ]