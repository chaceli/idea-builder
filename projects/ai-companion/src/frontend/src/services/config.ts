// 开发环境配置
const DEV_API_URL = 'http://10.0.0.16:3000'; // 替换为你的服务器 IP
const PROD_API_URL = 'https://api.ai-companion.com'; // 生产环境域名

// 根据环境选择
const BASE_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;

export { BASE_URL };
