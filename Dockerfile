# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3011
EXPOSE 3011

# Start the app
CMD ["npm", "start"]
# LOCAL
# docker rm $(docker ps -a -q) -f
# docker image prune -a
# docker container prune
# docker volume prune
# docker builder prune
# docker buildx create --use
# docker buildx build --platform linux/amd64 -t mdnelles/cryptodashlatest --load .
# docker images            # Copy the IMAGE_ID
# docker tag <IMAGE_ID> mdnelles/cryptodashlatest
# DOCKER_MAX_CONCURRENT_UPLOADS=1 docker push mdnelles/cryptodashlatest


# SERVER:
# sudo docker pull mdnelles/cryptodashlatest
# sudo docker ps -a (to get the container id)
# sudo docker stop 0d0c97c8d57f (or whatever the container id is)
# docker run -d   --name realparec_app -p 3011:3011 -e NODE_ENV=production -e --restart unless-stopped mdnelles/cryptodashlatest


# STOP CONTAINER:
# sudo docker ps (to get the container id)
# sudo docker stop 0d0c97c8d57f (or whatever the container id is)
    


# sudo lsof -i -P -n | grep LISTEN
# sudo docker logs 0d0c97c8d57f


# >>> clearing up the server except currently running container "blissful_booth"
#### try running the following command with sudo to stop all containers except blissful_booth:
# sudo docker ps -a --format "{{.Names}}" | grep -v "blissful_booth" | xargs -I {} sudo docker stop {}

#### Similarly, to remove all containers except blissful_booth, run:
# sudo docker ps -a --format "{{.Names}}" | grep -v "blissful_booth" | xargs -I {} sudo docker rm {}


# location / {
# 	proxy_pass http://127.0.0.1:3011/;
# 	proxy_set_header Host $host;
# 	proxy_set_header X-Real-IP $remote_addr;
# 	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
# 	proxy_set_header X-Forwarded-Proto $scheme;
# }