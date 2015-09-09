FROM theninjaturtles/iojs

WORKDIR /app

ENV NODE_ENV production
ENV PORT_EXT 80
ENV PORT_INT 90

ADD package.json package.json
RUN npm install --production

ADD dist dist

EXPOSE 80
EXPOSE 90
CMD ["npm", "start"]
