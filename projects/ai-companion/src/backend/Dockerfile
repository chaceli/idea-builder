# Dockerfile

FROM node:18-alpine

# 安装依赖
RUN apk add --no-cache tini

# 创建应用目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 使用 tini 作为 init 进程
ENTRYPOINT ["/sbin/tini", "--"]

# 启动应用
CMD ["node", "dist/app.js"]

# 暴露端口
EXPOSE 3000
