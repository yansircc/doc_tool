# 使用官方 Bun 镜像
# FROM oven/bun:latest AS base
FROM node:current-alpine3.20 AS base

# 安装依赖到临时目录以缓存
FROM base AS dev
WORKDIR /app/dev
COPY package.json .
COPY prisma ./prisma
# RUN bun install
RUN npm install

# 安装依赖到临时目录以缓存
FROM base AS prod
WORKDIR /app/prod
COPY package.json .
COPY prisma ./prisma
# RUN bun install --production
RUN npm install --production

# 用于开发的依赖安装并构建
FROM base AS prerelease
WORKDIR /app/prerelease
COPY . .
COPY --from=dev /app/dev/node_modules ./node_modules
ENV DATABASE_URL="file:./db.sqlite"
# RUN bun run build
ENV NODE_ENV=production
RUN npm run build

# 准备最终发布的镜像
FROM base AS release
WORKDIR /app
COPY --from=prod /app/prod/node_modules ./node_modules
COPY --from=prerelease /app/prerelease/public ./public
COPY --from=prerelease /app/prerelease/package.json ./package.json
COPY --from=prerelease /app/prerelease/next.config.js ./next.config.js
COPY --from=prerelease /app/prerelease/.next ./.next
COPY --from=prerelease /app/prerelease/src/env.js ./src/env.js
# COPY --from=prerelease /app/tailwind.config.js ./tailwind.config.js
# COPY --from=prerelease /app/tsconfig.json ./tsconfig.json

# 清理多余文件
RUN rm -rf /app/prerelease /app/prod /app/dev

# 暴露端口
EXPOSE 3000

# 启动应用
# ENTRYPOINT ["bun", "start"]
CMD ["npm", "start"]
