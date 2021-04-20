# FROM node:14-alpine as client

# # Create app directory
# WORKDIR /app/client/
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install --only=production
# # If you are building your code for production, use
# # RUN npm ci --only=production

# # Bundle app source
# COPY . ./
# RUN npm run build

# STAGE 2
FROM node:14-alpine

# WORKDIR /app/
# COPY --from=client /app/client/build/  ./build/

WORKDIR /app/server/
COPY server/package.json ./
COPY server/yarn.lock ./
RUN yarn install --frozen-lockfile --prod

COPY server/* /app/server/

ARG EXPOSE_PORT=4123

ENV PORT ${EXPOSE_PORT}}
EXPOSE ${EXPOSE_PORT}

CMD [ "yarn", "start" ]