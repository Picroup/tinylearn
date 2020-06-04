FROM registry.picroup.com:444/container-mirror/node:10.16.3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "release"]
