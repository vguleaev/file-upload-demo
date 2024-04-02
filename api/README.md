```
npm install
npm run dev
```

```
open http://localhost:3000
```

# Docker

docker build -f ./api/Dockerfile ./api/. -t file-upload-api

docker run -p 3000:3000 file-upload-api
