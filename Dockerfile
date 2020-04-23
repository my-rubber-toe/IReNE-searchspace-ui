FROM node:12.6-alpine as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: NGINX Server Container SETUP ###

FROM nginx:1.16.0-alpine as prod-stage

COPY ./nginx.conf  /etc/nginx/nginx.conf

COPY --from=build-step /app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]