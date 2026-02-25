# Используйте официальный образ Node.js в качестве базового образа
FROM node:latest AS builder
# FROM node:14-alpine AS builder

# Добавляем build args
ARG APP_LLM_MODEL

ENV NODE_ENV production
ENV APP_LLM_MODEL=$APP_LLM_MODEL

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
# COPY package-lock.json .
RUN npm install --production
RUN npm install --dev

# Copy app files
COPY . .
# Build the app
RUN npm run build-anonymizer

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add your nginx.conf template for environment variable substitution
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY /nginx/cert /etc/letsencrypt/
# Expose port
EXPOSE 80
EXPOSE 443
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
