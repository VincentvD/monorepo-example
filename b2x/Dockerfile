###############################################################################

FROM node:10-alpine AS builder

WORKDIR /home/node/app
COPY . .

RUN npm install && npm run build

###############################################################################

FROM node:10-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

COPY ./package* ./
RUN npm install && \
    npm cache clean --force

COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD npm run start:prod