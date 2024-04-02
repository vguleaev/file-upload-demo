# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Docker

docker build -f ./ui/Dockerfile ./ui/. -t file-upload-ui

docker run -p 5173:5173 file-upload-ui

docker run -p 5173:5173 -e VITE_API_URL=http://localhost:3000 file-upload-ui
