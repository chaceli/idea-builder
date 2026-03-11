// js/config.js - 配置常量和翻译数据

export const STORAGE_KEYS = {
  PROJECTS: 'idea-builder-projects',
  THEME: 'idea-builder-theme',
  LANG: 'idea-builder-lang',
  API_KEY: 'idea-builder-api-key'
};

export const PROJECT_ICONS = [
  '🏠', '🚗', '🏥', '📱', '🔋', '🎮', '🤖', '🛰️', '💊', '🎓', '🌾', '🏭'
];

export const PROJECT_TYPES = {
  invention: { name: 'Invention Patent', class: 'tag-invention', icon: '💡' },
  utility: { name: 'Utility Model', class: 'tag-utility', icon: '🔧' },
  design: { name: 'Design Patent', class: 'tag-design', icon: '🎨' }
};

export const AI_CONFIG = {
  model: 'MiniMax-M2.5',
  maxTokens: 2000,
  apiUrl: 'https://api.minimaxi.com/anthropic/v1/messages'
};

export const translations = {
  zh: {
    // Navigation
    navFeatures: '功能',
    navProjects: '项目',
    navProcess: '流程',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: '让每一个<span>灵机一动</span>的想法都能变成真正可实现的东西',
    heroDesc: 'AI 驱动的创意生成器，帮助你将创意想法快速转化为可实现的项目方案',
    exploreFeatures: '探索功能',
    viewDocs: '查看文档',

    // Features
    coreFeatures: '核心功能',
    featuresDesc: '强大的 AI 工具助你轻松完成创意项目',
    feature1Title: 'AI 提示词生成',
    feature1Desc: '智能分析你的想法，生成高质量的 AI 提示词，让 AI 更好地理解你的需求，提升交互效率',
    feature2Title: 'AI 项目生成',
    feature2Desc: '一键生成符合规范的项目方案，帮助你实现创意',
    feature3Title: 'AI 创意工具',
    feature3Desc: '更多创意工具持续更新，助力你的创新之旅，让每个想法都能得到专业的技术支持',

    // Projects
    myProjects: '我的项目',
    projectsDesc: '管理你的创意项目',
    emptyStateTitle: '还没有项目',
    emptyStateDesc: '点击"创建项目"开始你的创意之旅',
    createFirst: '✨ 创建第一个项目',
    noDesc: '暂无描述',

    // Process
    processTitle: '使用流程',
    processDesc: '简单的四步完成创意项目',
    step1: '输入你的想法',
    step2: 'AI 优化完善',
    step3: '生成项目方案',
    step4: '实现创意',

    // Form
    createProject: '✨ 创建项目',
    projectName: '项目名称',
    projectNamePlaceholder: '请输入项目名称',
    techField: '技术领域',
    techFieldPlaceholder: '请输入技术领域',
    projectType: '项目类型',
    selectType: '请选择项目类型',
    invention: '发明项目',
    utility: '实用项目',
    design: '创意设计',
    projectDesc: '项目描述',
    projectDescPlaceholder: '请描述您的创意想法...',
    create: '创建',
    cancel: '取消',

    // Edit Modal
    editProject: '编辑项目',
    edit: '编辑',
    delete: '删除',
    save: '保存',

    // Detail Modal
    projectDetail: '项目详情',

    // AI Modal
    aiGeneration: 'AI 智能生成',
    promptGeneration: '提示词生成',
    projectPlan: '项目方案生成',
    aiIdeaPlaceholder: '输入你的创意想法，AI 将帮你优化...',
    generatePrompt: '生成提示词',
    generatePlan: '生成项目方案',
    generating: '生成中...',
    saveToProject: '保存到项目',
    apiKeyNotice: '使用 AI 功能需要配置 API Key',
    apiKeySettings: '设置',
    enterApiKey: '请输入 API Key',
    saveApiKey: '保存',

    // Footer
    footerContact: '有问题或建议？联系我们',
    footerCopyright: '© 2024 IDEA Builder. 基于 AI 的创意生成工具。',

    // Messages
    confirmDelete: '确定要删除这个项目吗？',
    fillRequired: '请填写必填字段',
    createSuccess: '项目创建成功！',
    editSuccess: '项目修改成功！',
    deleteSuccess: '删除成功',
    notExist: '项目不存在',
    apiKeySaved: 'API Key 保存成功',
    apiKeyNotConfigured: 'API Key 未配置，请点击"设置"输入您的 MiniMax API Key',
    noResponse: '无响应',
    apiError: 'API 调用错误'
  },

  en: {
    // Navigation
    navFeatures: 'Features',
    navProjects: 'Projects',
    navProcess: 'Process',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: 'Turn Every <span>Great Idea</span> Into Reality',
    heroDesc: 'AI-powered idea generator that transforms your creative ideas into actionable project plans',
    exploreFeatures: 'Explore Features',
    viewDocs: 'View Docs',

    // Features
    coreFeatures: 'Core Features',
    featuresDesc: 'Powerful AI tools to help you complete creative projects with ease',
    feature1Title: 'AI Prompt Generation',
    feature1Desc: 'Intelligently analyze your ideas and generate high-quality AI prompts for better understanding',
    feature2Title: 'AI Project Generation',
    feature2Desc: 'Generate standardized project plans with one click to bring your ideas to life',
    feature3Title: 'AI Creative Tools',
    feature3Desc: 'Continuous updates of creative tools to support your innovation journey',

    // Projects
    myProjects: 'My Projects',
    projectsDesc: 'Manage your creative projects',
    emptyStateTitle: 'No Projects Yet',
    emptyStateDesc: 'Click "Create Project" to start your creative journey',
    createFirst: '✨ Create First Project',
    noDesc: 'No description',

    // Process
    processTitle: 'How It Works',
    processDesc: 'Four simple steps to complete your creative project',
    step1: 'Input Your Idea',
    step2: 'AI Optimization',
    step3: 'Generate Plan',
    step4: 'Make It Real',

    // Form
    createProject: '✨ Create Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    techField: 'Tech Field',
    techFieldPlaceholder: 'Enter tech field',
    projectType: 'Project Type',
    selectType: 'Select type',
    invention: 'Invention Project',
    utility: 'Utility Project',
    design: 'Creative Design',
    projectDesc: 'Description',
    projectDescPlaceholder: 'Describe your creative idea...',
    create: 'Create',
    cancel: 'Cancel',

    // Edit Modal
    editProject: 'Edit Project',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',

    // Detail Modal
    projectDetail: 'Project Details',

    // AI Modal
    aiGeneration: 'AI Generation',
    promptGeneration: 'Prompt Generation',
    projectPlan: 'Project Plan',
    aiIdeaPlaceholder: 'Enter your creative idea, AI will help optimize...',
    generatePrompt: 'Generate Prompt',
    generatePlan: 'Generate Plan',
    generating: 'Generating...',
    saveToProject: 'Save to Project',
    apiKeyNotice: 'AI features require API Key configuration',
    apiKeySettings: 'Settings',
    enterApiKey: 'Enter API Key',
    saveApiKey: 'Save',

    // Footer
    footerContact: 'Questions or suggestions? Contact Us',
    footerCopyright: '© 2024 IDEA Builder. AI-powered Idea Generation Tool.',

    // Messages
    confirmDelete: 'Are you sure you want to delete this project?',
    fillRequired: 'Please fill in required fields',
    createSuccess: 'Project created successfully!',
    editSuccess: 'Project updated successfully!',
    deleteSuccess: 'Deleted successfully',
    notExist: 'Project not found',
    apiKeySaved: 'API Key saved successfully',
    apiKeyNotConfigured: 'API Key not configured. Please click "Settings" to enter your MiniMax API Key.',
    noResponse: 'No response',
    apiError: 'API Error'
  }
};