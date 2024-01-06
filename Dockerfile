FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY . /app
WORKDIR /app
RUN npm install -g pnpm tsx
RUN pnpm install
RUN pnpm build
EXPOSE 8080
CMD [ "pnpm","start" ]