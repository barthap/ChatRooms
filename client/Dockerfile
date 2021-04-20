FROM node:14-alpine as client

# Create app directory
WORKDIR /app/client/

# Copy package.json and yarn.lock
COPY yarn.lock ./
COPY package.json ./

# Install react app dependencies
RUN yarn install --frozen-lockfile --prod

# Bundle client app source
COPY . ./
RUN yarn run build

# STAGE 2
FROM node:14-alpine

WORKDIR /app/
COPY --from=client /app/client/build/  ./build/

WORKDIR /app/server/
COPY server/yarn.lock ./
COPY server/package.json ./
RUN yarn install --frozen-lockfile --prod

COPY server/* /app/server/

ARG EXPOSE_PORT=4123

ENV PORT ${EXPOSE_PORT}}
EXPOSE ${EXPOSE_PORT}

CMD [ "yarn", "start" ]