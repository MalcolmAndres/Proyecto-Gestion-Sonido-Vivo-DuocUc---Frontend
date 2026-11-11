
# Etapa 1: construir la app con Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_USE_MOCKS=true
ARG VITE_API_URL=http://localhost:8080
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: servir los archivos con Nginx
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
