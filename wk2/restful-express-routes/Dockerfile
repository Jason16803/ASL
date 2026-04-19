FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @jworkman-fs/wdv-cli

COPY . .

EXPOSE 8080

CMD ["npm", "start"]