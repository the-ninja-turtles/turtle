FROM theninjaturtles/iojs

WORKDIR /app

ENV NODE_ENV production
ENV PORT 80

ADD package.json package.json
RUN npm install --production

ADD dist dist

EXPOSE 80
CMD ["npm", "start"]
