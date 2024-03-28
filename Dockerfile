FROM node:20.11.0-alpine

# Set environment variables
ENV PORT=4500
ENV MONGO_URL="mongodb+srv://ajaysonere786:2JRN5rUOYYAMvnKm@cluster0.5u9pb3p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV JWT_SECRET="ajks534578413sdfsdfgdfjlksafd"
ENV EMAIL_USER="ajaysonere472@gmail.com"
ENV PASSWORD="lyvb ipkf dalg wzrs"
ENV MONGO_PASSWORD="S54gCTurtfJH7AfY"

RUN npm install -g nodemon 

WORKDIR /usr/src/app

COPY  package*.json .

RUN npm ci

COPY . .

EXPOSE 4500

CMD [ "npm", "run" , "dev"]
