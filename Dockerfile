FROM denoland/deno:latest

WORKDIR /app

COPY server/ ./

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable-kv", "main.ts"]