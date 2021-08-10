FROM node:14-alpine as builder
RUN npm install
RUN npm run build

FROM node:14-alpine
RUN mkdir -p /service
WORKDIR /service
COPY --from=builder config package.json ./
RUN npm install --production
CMD [ "npm", "run", "start:prod" ]