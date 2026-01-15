# Docker Build and Deployment Guide

## Building the Docker Image

Build the image with:

```bash
docker build -t eznetmon:latest .
```

Or with a specific version tag:

```bash
docker build -t eznetmon:1.0.0 .
```

## Running the Docker Container

Run the container with:

```bash
docker run -p 3000:3000 --name eznetmon eznetmon:latest
```

Or with environment variables:

```bash
docker run -p 3000:3000 \
  --env NODE_ENV=production \
  --name eznetmon \
  eznetmon:latest
```

## Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

Then run:

```bash
docker-compose up
```

## Multi-Architecture Builds

To build for multiple architectures (useful for ARM64 on Apple Silicon, AWS Graviton, etc.):

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t eznetmon:latest \
  --push \
  .
```

## Dockerfile Optimization

The Dockerfile uses several optimization techniques:

1. **Multistage Build**: Reduces final image size by ~80%
   - Builder stage: Contains all build dependencies
   - Runtime stage: Only contains necessary files to run the app

2. **Alpine Linux**: Uses minimal base image (~5MB vs ~900MB for full Node.js)

3. **Non-root User**: Runs as `nextjs` user for security

4. **Layer Caching**: Optimized order of commands for Docker layer caching

5. **Health Check**: Monitors container health

6. **Production Dependencies**: Only installs production packages in final image

## Image Size Comparison

- **Builder Stage**: ~500MB (not included in final image)
- **Runtime Stage**: ~150-200MB (actual image size)
- **Without Optimization**: ~900MB+

## Environment Variables

Common environment variables for Next.js:

```bash
NODE_ENV=production          # Optimize for production
NEXT_PUBLIC_API_URL=http://localhost:3000  # API base URL
```

## Networking

When running Docker, the app listens on:
- **Inside Container**: `http://0.0.0.0:3000`
- **From Host**: `http://localhost:3000`
- **From Other Containers**: `http://app:3000`

## Troubleshooting

### Container exits immediately

Check logs:
```bash
docker logs <container_id>
```

### Health check failing

Ensure port 3000 is correctly exposed:
```bash
docker port <container_id>
```

### Permission issues

Make sure the `nextjs` user has proper permissions:
```bash
docker exec <container_id> ls -la /app
```

## Security Considerations

1. **Non-root User**: Container runs as `nextjs` user, not root
2. **Read-only Filesystem**: Can be enforced with `--read-only` flag (requires volume for `.next`)
3. **Resource Limits**: Set with `--memory` and `--cpus` flags
4. **Network**: Use custom Docker networks instead of host network

Example with security best practices:

```bash
docker run \
  -p 3000:3000 \
  --read-only \
  --tmpfs /app/.next \
  --memory 512m \
  --cpus 1 \
  --security-opt no-new-privileges:true \
  eznetmon:latest
```

## Publishing to Registry

Push to Docker Hub:

```bash
docker tag eznetmon:latest yourusername/eznetmon:latest
docker push yourusername/eznetmon:latest
```

Push to other registries (e.g., AWS ECR):

```bash
docker tag eznetmon:latest <account>.dkr.ecr.<region>.amazonaws.com/eznetmon:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/eznetmon:latest
```
