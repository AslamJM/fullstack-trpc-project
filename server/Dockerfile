FROM node:16 as development
WORKDIR /home/app
COPY package*.json .
RUN npm install
COPY . ./
RUN npm run build

FROM node:16 as production
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/app
COPY package*.json .
RUN npm install --production
COPY --from=development /home/app/dist ./dist
CMD ["node","dist/index.js"]

