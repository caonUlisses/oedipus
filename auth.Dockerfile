FROM keymetrics/pm2:8
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "yarn.lock", "pm2.json","./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["pm2-docker", "start", "pm2.json"]