# File Upload Demo

This is a monorepo

Apps:

- ui - Vite + React + TS
- api - Hono + TS

Both apps have Dockerfiles

# Docker

docker build -f ./ui/Dockerfile . -t file-upload-ui

docker run -p 3010:3010 -e VITE_API_URL=http://localhost:3020 file-upload-ui
