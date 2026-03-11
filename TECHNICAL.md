# IDEA Builder 专利生成器 - 技术实施方案

> 版本：1.0  
> 作者：首架（架构师）  
> 日期：2026-03-10

---

## 1. 系统架构设计

### 1.1 整体架构

采用经典的**前后端分离**架构，通过 RESTful API 进行数据交互。

```
┌─────────────────────────────────────────────────────────────────┐
│                           用户浏览器                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Vue 3 前端 (SPA)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  首页     │  │ 配置页    │  │ 生成页    │  │ 编辑器    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Axios / HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Node.js 后端 (API)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 用户模块     │  │ 专利模块     │  │ AI 服务模块  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  MySQL   │   │  Redis   │   │ MiniMax  │
        │ 数据库   │   │ 缓存/Session │  │  AI API  │
        └──────────┘   └──────────┘   └──────────┘
```

### 1.2 分层设计

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│         (Vue 3 前端组件层)               │
├─────────────────────────────────────────┤
│            API Layer                    │
│        (RESTful API 接口层)              │
├─────────────────────────────────────────┤
│          Service Layer                  │
│         (业务逻辑服务层)                  │
├─────────────────────────────────────────┤
│           Data Access Layer             │
│         (数据访问层 / ORM)               │
├─────────────────────────────────────────┤
│           Database                      │
│         (MySQL + Redis)                 │
└─────────────────────────────────────────┘
```

### 1.3 部署架构

```
                    ┌──────────────────┐
                    │    Nginx         │
                    │  (反向代理/HTTPS) │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ 前端构建 │   │ 后端 API │   │  Worker  │
        │ (静态)  │   │  (Node)  │   │ (异步任务) │
        └──────────┘   └────┬─────┘   └──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  MySQL   │  │  Redis   │  │ MiniMax  │
        │ 主库     │  │ 缓存      │  │  AI API  │
        └──────────┘  └──────────┘  └──────────┘
```

---

## 2. 技术栈选型

### 2.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 核心框架 |
| TypeScript | 5.0+ | 类型安全 |
| Vite | 5.0+ | 构建工具 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Axios | 1.6+ | HTTP 请求 |
| Element Plus | 2.5+ | UI 组件库 |
| VueUse | 10.x | 组合式工具库 |

### 2.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 LTS | 运行时 |
| Koa | 2.14+ | Web 框架 |
| koa-router | 12.x | 路由 |
| koa-bodyparser | 4.x | 请求解析 |
| koa-cors | 3.x | 跨域支持 |
| Sequelize | 6.x | ORM |
| MySQL | 8.0 | 主数据库 |
| Redis | 7.0 | 缓存/Session |
| jsonwebtoken | 9.x | JWT 鉴权 |
| bcrypt | 5.x | 密码加密 |
| MiniMax | - | AI 服务 |

### 2.3 开发工具

| 技术 | 用途 |
|------|------|
| ESLint + Prettier | 代码规范 |
| Husky | Git Hooks |
| Commitlint | 提交规范 |
| Jest / Vitest | 单元测试 |
| PM2 | 进程管理 |

---

## 3. 数据库设计

### 3.1 ER 图概览

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │  patents    │       │   configs    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ user_id (FK) │       │ id (PK)      │
│ username     │       │ id (PK)      │       │ user_id (FK) │
│ email        │       │ title        │       │ api_key      │
│ password     │       │ type         │       │ provider     │
│ created_at   │       │ content      │       │ created_at   │
│ updated_at   │       │ status       │       │ updated_at   │
└──────────────┘       │ claims       │       └──────────────┘
                      │ created_at   │
                      │ updated_at   │
                      └──────────────┘
```

### 3.2 详细表结构

#### 3.2.1 用户表 (users)

```sql
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

#### 3.2.2 专利表 (patents)

```sql
CREATE TABLE `patents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '专利ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '专利名称',
  `type` ENUM('invention', 'utility', 'design') NOT NULL COMMENT '专利类型: invention-发明专利 utility-实用新型 design-外观设计',
  `field` VARCHAR(100) NOT NULL COMMENT '技术领域',
  `description` TEXT NOT NULL COMMENT '发明描述',
  `content` LONGTEXT COMMENT '生成的专利内容(摘要)',
  `claims` LONGTEXT COMMENT '权利要求书',
  `specification` LONGTEXT COMMENT '说明书',
  `abstract` TEXT COMMENT '摘要',
  `status` ENUM('draft', 'generating', 'completed', 'failed') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `ai_model` VARCHAR(50) DEFAULT NULL COMMENT '使用的AI模型',
  `tokens_used` INT UNSIGNED DEFAULT 0 COMMENT '消耗的Token数',
  `error_message` TEXT COMMENT '错误信息',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专利表';
```

#### 3.2.3 API配置表 (api_configs)

```sql
CREATE TABLE `api_configs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `provider` VARCHAR(20) NOT NULL DEFAULT 'minimax' COMMENT 'AI提供商: minimax/openai/ Anthropic',
  `api_key` VARCHAR(255) NOT NULL COMMENT 'API Key(加密存储)',
  `api_secret` VARCHAR(255) DEFAULT NULL COMMENT 'API Secret(加密存储)',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认配置',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  UNIQUE KEY `uk_user_provider` (`user_id`, `provider`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI API配置表';
```

#### 3.2.4 专利版本表 (patent_versions)

```sql
CREATE TABLE `patent_versions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `patent_id` INT UNSIGNED NOT NULL COMMENT '专利ID',
  `version` INT UNSIGNED NOT NULL COMMENT '版本号',
  `content` LONGTEXT COMMENT '专利内容',
  `claims` LONGTEXT COMMENT '权利要求书',
  `change_log` VARCHAR(500) DEFAULT NULL COMMENT '变更说明',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_patent_id` (`patent_id`),
  INDEX `idx_version` (`version`),
  FOREIGN KEY (`patent_id`) REFERENCES `patents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专利版本表';
```

#### 3.2.5 使用统计表 (usage_stats)

```sql
CREATE TABLE `usage_stats` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `patent_id` INT UNSIGNED DEFAULT NULL COMMENT '专利ID',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型: generate/optimize/check',
  `model` VARCHAR(50) DEFAULT NULL COMMENT '使用的模型',
  `tokens` INT UNSIGNED DEFAULT 0 COMMENT '消耗Token',
  `latency_ms` INT UNSIGNED DEFAULT 0 COMMENT '响应时间(毫秒)',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='使用统计表';
```

---

## 4. API 设计规范

### 4.1 RESTful 规范

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户 |
| GET | /api/patents | 获取专利列表 |
| POST | /api/patents | 创建专利 |
| GET | /api/patents/:id | 获取专利详情 |
| PUT | /api/patents/:id | 更新专利 |
| DELETE | /api/patents/:id | 删除专利 |
| POST | /api/patents/:id/generate | 生成专利内容 |
| POST | /api/patents/:id/optimize | 优化专利 |
| POST | /api/patents/:id/check | 专利查重 |
| GET | /api/configs | 获取API配置 |
| POST | /api/configs | 创建API配置 |
| PUT | /api/configs/:id | 更新API配置 |
| DELETE | /api/configs/:id | 删除API配置 |

### 4.2 响应格式

```json
// 成功响应
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "一种智能家居控制系统"
  }
}

// 错误响应
{
  "code": 1001,
  "message": "参数错误",
  "errors": {
    "field": "email",
    "message": "邮箱格式不正确"
  }
}
```

### 4.3 状态码定义

| 状态码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 缺少参数 |
| 1003 | 认证失败 |
| 1004 | 权限不足 |
| 1005 | 资源不存在 |
| 2001 | AI服务错误 |
| 2002 | API配额不足 |
| 3001 | 数据库错误 |

### 4.4 认证方案

- 使用 **JWT** (JSON Web Token) 进行身份认证
- Token 有效期：7 天
- 刷新 Token 有效期：30 天
- 存放位置：`Authorization: Bearer <token>`

### 4.5 接口详细设计

#### 4.5.1 认证模块

```typescript
// POST /api/auth/register
interface RegisterRequest {
  username: string;      // 3-20字符
  email: string;         // 邮箱格式
  password: string;     // 6-20字符
}

interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}
```

#### 4.5.2 专利模块

```typescript
// GET /api/patents
interface PatentListQuery {
  page?: number;        // 默认1
  pageSize?: number;    // 默认10, 最大100
  status?: string;      // draft/generating/completed/failed
  type?: string;        // invention/utility/design
  keyword?: string;     // 搜索关键词
}

interface PatentListResponse {
  list: Patent[];
  total: number;
  page: number;
  pageSize: number;
}

// POST /api/patents
interface CreatePatentRequest {
  title: string;        // 专利名称
  type: 'invention' | 'utility' | 'design';
  field: string;        // 技术领域
  description: string; // 发明描述
}

// POST /api/patents/:id/generate
interface GeneratePatentRequest {
  apiConfigId?: number; // 指定API配置，不填则使用默认
  options?: {
    includeClaims?: boolean;      // 包含权利要求书
    includeSpecification?: boolean; // 包含说明书
    language?: 'zh' | 'en';       // 语言
    detailLevel?: 'brief' | 'normal' | 'detailed'; // 详细程度
  };
}

interface GeneratePatentResponse {
  patent: Patent;
  taskId?: string;      // 异步任务ID
  status: 'completed' | 'processing';
}
```

---

## 5. 目录结构

### 5.1 项目根目录

```
idea-builder-patent/
├── docs/                    # 项目文档
│   ├── README.md           # 产品说明
│   ├── TECHNICAL.md        # 技术方案
│   └── API.md              # API文档
├── frontend/                # 前端项目
├── backend/                 # 后端项目
└── docker/                  # Docker配置
```

### 5.2 前端目录结构

```
frontend/
├── public/                  # 静态资源
│   └── favicon.ico
├── src/
│   ├── assets/             # 资源文件
│   │   ├── styles/         # 全局样式
│   │   └── images/         # 图片
│   ├── components/         # 公共组件
│   │   ├── common/         # 通用组件
│   │   ├── layout/         # 布局组件
│   │   └── patent/        # 专利相关组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 页面布局
│   ├── router/             # 路由配置
│   ├── services/           # API服务
│   │   ├── api/            # API封装
│   │   └── types/          # 类型定义
│   ├── stores/             # Pinia状态管理
│   │   ├── auth.ts         # 认证状态
│   │   ├── patent.ts       # 专利状态
│   │   └── config.ts       # 配置状态
│   ├── utils/              # 工具函数
│   ├── views/              # 页面视图
│   │   ├── Home/           # 首页
│   │   ├── Auth/           # 认证页
│   │   ├── Patent/         # 专利相关
│   │   └── Dashboard/     # 仪表盘
│   ├── App.vue
│   └── main.ts
├── .env                    # 环境变量
├── .env.development
├── .env.production
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 5.3 后端目录结构

```
backend/
├── src/
│   ├── config/             # 配置文件
│   │   ├── database.ts    # 数据库配置
│   │   ├── redis.ts      # Redis配置
│   │   └── ai.ts         # AI服务配置
│   ├── controllers/       # 控制器
│   │   ├── auth.controller.ts
│   │   ├── patent.controller.ts
│   │   └── config.controller.ts
│   ├── middlewares/       # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/            # 数据模型
│   │   ├── User.ts
│   │   ├── Patent.ts
│   │   ├── ApiConfig.ts
│   │   └── index.ts
│   ├── routers/           # 路由
│   │   ├── auth.router.ts
│   │   ├── patent.router.ts
│   │   └── index.ts
│   ├── services/          # 业务服务
│   │   ├── auth.service.ts
│   │   ├── patent.service.ts
│   │   ├── ai.service.ts
│   │   └── email.service.ts
│   ├── utils/             # 工具函数
│   │   ├── crypto.ts      # 加密
│   │   ├── jwt.ts         # JWT
│   │   └── helper.ts      # 辅助函数
│   ├── validators/         # 参数校验
│   │   ├── auth.validator.ts
│   │   └── patent.validator.ts
│   ├── constants/         # 常量
│   │   ├── status.ts
│   │   └── errors.ts
│   ├── types/             # 类型定义
│   │   └── express.d.ts
│   ├── app.ts             # 应用入口
│   └── server.ts          # 服务启动
├── tests/                 # 测试
│   ├── unit/
│   └── integration/
├── .env                   # 环境变量
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. 核心模块设计

### 6.1 用户认证模块

```
┌─────────────────────────────────────────────────────────┐
│                    认证模块架构                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────┐    ┌──────────┐    ┌─────────────────┐  │
│   │ 前端表单 │───►│ 路由验证 │───►│ Controller      │  │
│   └─────────┘    └──────────┘    └────────┬────────┘  │
│                                              │           │
│   ┌──────────────────────────────────────────▼────────┐ │
│   │                   Service Layer               │    │
│   │  ┌─────────────┐  ┌─────────────┐              │    │
│   │  │    │  │ 登录逻辑    │              │    注册逻辑 │
│   │  │ - 验证唯一  │  │ - 密码比对  │              │    │
│   │  │ - 密码加密  │  │ - Token生成 │              │    │
│   │  │ - 创建用户  │  │ - Redis缓存 │              │    │
│   │  └─────────────┘  └─────────────┘              │    │
│   └──────────────────────────────────────────────────┘ │
│                                              │           │
│   ┌──────────────────────────────────────────▼────────┐ │
│   │                   Model Layer                   │    │
│   │                  users 表操作                      │    │
│   └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**核心功能：**
- 用户注册（邮箱 + 密码）
- 用户登录（JWT Token）
- Token 刷新
- 密码重置（邮件验证码）
- Session 管理（Redis）

### 6.2 专利生成模块

```
┌─────────────────────────────────────────────────────────┐
│                   专利生成模块架构                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│   │ 输入发明描述 │───►│ 参数校验   │───►│ Controller │  │
│   └─────────────┘    └─────────────┘    └─────┬─────┘  │
│                                               │         │
│   ┌───────────────────────────────────────────▼───────┐ │
│   │                    Service Layer               │    │
│   │                                             │    │ │
│   │  ┌─────────────────────────────────────────────┐│ │
│   │  │              AI 生成服务                     ││ │
│   │  │                                             ││ │
│   │  │  1. 构建专利提示词模板                        ││ │
│   │  │  2. 调用 MiniMax API                         ││ │
│   │  │  3. 解析AI响应                               ││ │
│   │  │  4. 提取：摘要、权利要求书、说明书            ││ │
│   │  │  5. 保存到数据库                             ││ │
│   │  └─────────────────────────────────────────────┘│ │
│   └───────────────────────────────────────────────────┘ │
│                                               │         │
│   ┌───────────────────────────────────────────▼───────┐ │
│   │                    Model Layer                   │    │
│   │              patents 表 + versions 表             │    │
│   └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**AI 提示词设计：**

```typescript
// 专利生成提示词模板
const PATENT_GENERATION_PROMPT = `
你是一位专业的专利撰写专家。请根据以下信息生成专利文档。

## 专利类型
{{patentType}}

## 技术领域
{{field}}

## 发明描述
{{description}}

请生成以下内容：

1. **专利摘要** (200-300字)
简明概括发明的技术方案、主要用途和创新点。

2. **权利要求书**
- 独立权利要求1项
- 从属权利要求2-4项

3. **说明书**
- 技术领域
- 背景技术
- 发明内容
- 附图说明
- 具体实施方式

请用JSON格式输出：
{
  "abstract": "摘要内容",
  "claims": [...],
  "specification": {...}
}
`;
```

### 6.3 专利优化模块

```typescript
// 优化服务流程
interface OptimizeService {
  // 1. 语义分析
  analyzeContent(content: string): Promise<AnalysisResult>;
  
  // 2. 生成优化建议
  generateSuggestions(analysis: AnalysisResult): Promise<OptimizeSuggestion[]>;
  
  // 3. 执行优化
  optimizePatent(patentId: number, suggestions: string[]): Promise<Patent>;
  
  // 4. 版本管理
  createVersion(patentId: number, changeLog: string): Promise<PatentVersion>;
}
```

### 6.4 API 配置管理

```
┌─────────────────────────────────────────┐
│           API 配置管理                   │
├─────────────────────────────────────────┤
│                                         │
│  支持的 AI 提供商：                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ MiniMax │  │ OpenAI  │  │ Anthropic│ │
│  └─────────┘  └─────────┘  └─────────┘  │
│                                         │
│  配置项：                                │
│  - API Key (加密存储)                   │
│  - API Secret                           │
│  - 模型选择                              │
│  - 默认/备用配置                         │
│                                         │
│  安全措施：                              │
│  - AES-256 加密存储                     │
│  - 仅返回掩码 (sk-****1234)              │
│  - 请求频率限制                          │
└─────────────────────────────────────────┘
```

---

## 7. 安全设计

### 7.1 认证安全

- 密码使用 **bcrypt** 加密（salt rounds: 12）
- JWT Token 签名使用 HS256
- 敏感操作需要重新验证密码
- 同一账号多设备登录管理

### 7.2 接口安全

- 所有 API 需要认证（除公开接口外）
- 请求频率限制：60次/分钟
- CSRF 防护
- XSS 防护
- SQL 注入防护（使用 ORM）

### 7.3 数据安全

- API Key 使用 AES-256 加密存储
- 敏感日志脱敏
- 数据库定期备份
- HTTPS 全站加密

---

## 8. 性能优化

### 8.1 前端优化

- Vite 按需编译
- 路由懒加载
- 组件异步加载
- 图片懒加载
- Pinia 状态持久化

### 8.2 后端优化

- Redis 缓存热点数据
- 数据库查询优化（索引）
- 连接池管理
- 异步任务队列（生成大文档）
- 接口响应压缩

---

## 9. 监控与日志

### 9.1 日志系统

```typescript
// 日志级别
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 日志格式
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: {
    userId?: number;
    action: string;
    params?: any;
    responseTime?: number;
  };
}
```

### 9.2 监控指标

- API 响应时间（P50/P95/P99）
- 错误率
- Token 消耗统计
- 用户活跃度

---

## 10. 开发计划

### Phase 1: 基础功能 (1-2周)
- [ ] 项目初始化
- [ ] 用户认证
- [ ] 基础 API 配置

### Phase 2: 核心功能 (2-3周)
- [ ] 专利创建/编辑
- [ ] AI 生成
- [ ] 专利列表

### Phase 3: 高级功能 (2周)
- [ ] 专利优化
- [ ] 专利查重
- [ ] 导出功能

### Phase 4: 优化与发布 (1周)
- [ ] 性能优化
- [ ] 安全加固
- [ ] 部署上线

---

## 附录

### A. 环境变量配置

```bash
# 后端 .env
NODE_ENV=development
PORT=3000

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_NAME=idea_builder_patent
DB_USER=root
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AI
MINIMAX_API_KEY=your_api_key
MINIMAX_GROUP_ID=your_group_id

# 前端 .env
VITE_API_BASE_URL=http://localhost:3000/api
```

### B. 技术选型理由

| 选型 | 理由 |
|------|------|
| Vue 3 | Composition API 更适合复杂状态管理 |
| Koa | 中间件机制灵活，适合扩展 |
| Sequelize | TypeScript 支持好，文档完善 |
| Redis | Session 存储 + 缓存 |
| MiniMax | 国内可用，性价比高 |

---

**文档版本历史**
- v1.0 (2026-03-10): 初始版本
