// js/config.js - 配置常量和翻译数据

export const STORAGE_KEYS = {
  PROJECTS: 'idea-builder-projects',
  THEME: 'idea-builder-theme',
  LANG: 'idea-builder-lang',
  API_KEY: 'idea-builder-api-key',
  API_PROVIDER: 'idea-builder-api-provider'
};

export const PROJECT_ICONS = [
  '🏠', '🚗', '🏥', '📱', '🔋', '🎮', '🤖', '🛰️', '💊', '🎓', '🌾', '🏭'
];

export const PROJECT_TYPES = {
  invention: { name: 'Invention Patent', class: 'tag-invention', icon: '💡' },
  utility: { name: 'Utility Model', class: 'tag-utility', icon: '🔧' },
  design: { name: 'Design Patent', class: 'tag-design', icon: '🎨' }
};

export const AI_PROVIDERS = {
  minimax: {
    name: 'MiniMax',
    model: 'MiniMax-M2',
    apiUrl: 'https://api.minimax.chat/v1/chat/completions',
    keyPlaceholder: 'Enter your MiniMax API Key'
  },
  openai: {
    name: 'OpenAI',
    model: 'gpt-4o',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: 'Enter your OpenAI API Key (sk-...)'
  }
};

export const translations = {
  zh: {
    // Navigation
    navFeatures: '功能',
    navProjects: '项目',
    navProcess: '流程',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: '让每一个<span>灵感火花</span>，都变成现实',
    heroDesc: 'AI 驱动的创意孵化器，帮你把灵感变成专利、蓝图或提示词',
    exploreFeatures: '探索功能',
    viewDocs: '查看文档',

    // Features
    coreFeatures: '核心功能',
    featuresDesc: '强大的 AI 工具助你轻松完成创意项目',
    feature1Title: 'AI 提示词生成',
    feature1Desc: '智能分析你的想法，生成高质量的提示词模板，可在其他AI平台生成图片、视频等',
    feature2Title: 'AI 蓝图生成',
    feature2Desc: '一键生成完整的项目蓝图，帮你把创意想法转化为可落地的执行方案',
    feature3Title: 'AI 专利生成',
    feature3Desc: '专业专利文档生成，支持发明专利、实用新型、外观设计三种类型',

    // Projects
    myProjects: '我的项目',
    projectsDesc: '管理你的创意项目',
    emptyStateTitle: '还没有项目',
    emptyStateDesc: '点击"创建项目"开始你的创意之旅',
    createFirst: '✨ 创建第一个项目',
    noDesc: '暂无描述',

    // Process
    processTitle: '使用流程',
    processDesc: '简单四步，让灵感变成现实',
    step1: '输入你的灵感',
    step2: 'AI 优化完善',
    step3: '生成成果',
    step4: '付诸实践',

    // Form
    createProject: '✨ 创建项目',
    createModalTitle: '✨ 创建新项目',
    editModalTitle: '✏️ 编辑项目',
    detailModalTitle: '📋 项目详情',
    aiModalTitle: '🤖 AI 智能生成',
    projectName: '项目名称',
    projectNamePlaceholder: '请输入项目名称',
    techField: '技术领域',
    techFieldPlaceholder: '请输入技术领域',
    projectType: '项目类型',
    selectType: '请选择项目类型',
    invention: '发明专利',
    utility: '实用新型',
    design: '外观设计',
    projectDesc: '项目描述',
    projectDescPlaceholder: '请描述您的创意想法...',
    describeIdea: '描述你的灵感想法',
    ideaPlaceholder: '输入你的灵感想法，AI 将帮你优化...',
    apiKeyPlaceholder: '请输入您的 API Key',
    apiKeyLabel: 'API Key',
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
    projectPlan: '蓝图生成',
    aiIdeaPlaceholder: '输入你的灵感想法，AI 将帮你优化...',
    generatePrompt: '生成提示词',
    generatePlan: '生成蓝图',
    generating: '生成中...',
    copy: '复制',
    submit: '提交',
    startGeneration: '开始生成',
    aiThinking: 'AI 正在思考中...',
    generatedResult: '生成结果',
    saveToProject: '保存到项目',
    apiKeyNotice: '使用 AI 功能需要配置 API Key',
    apiKeySettings: '设置',
    enterApiKey: '请输入 API Key',
    saveApiKey: '保存',

    // Footer
    footerContact: '有问题或建议？联系我们',
    footerCopyright: '© 2026 IDEA Builder. 基于 AI 的创意孵化工具',
    keyboardHint: '按 Enter 发送，Shift+Enter 换行',
    copyright: '© 2026 IDEA Builder. 基于 AI 的创意孵化工具',
    promptGenDesc: '生成高质量的提示词模板，可用于其他 AI 平台',
    projectGenDesc: '生成完整的项目蓝图，包含详细的执行方案',

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
    apiError: 'API 调用错误',

    // Demo Mode
    demoMode: '演示模式',
    demoModeDesc: '此为演示输出，<a href="#" id="demoConfigLink">配置 API Key</a> 以使用真实 AI 生成',
    patentGeneration: '专利生成',

    // Form
    requiredField: '此字段为必填项',
    copied: '已复制到剪贴板',
    generatePatent: '生成专利'
  },

  en: {
    // Navigation
    navFeatures: 'Features',
    navProjects: 'Projects',
    navProcess: 'Process',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: 'Turn Every <span>Spark of Inspiration</span> Into Reality',
    heroDesc: 'AI-powered creative incubator that transforms your spark into patents, blueprints, or prompt templates',
    exploreFeatures: 'Explore Features',
    viewDocs: 'View Docs',

    // Features
    coreFeatures: 'Core Features',
    featuresDesc: 'Powerful AI tools to help you complete creative projects with ease',
    feature1Title: 'AI Prompt Template Generator',
    feature1Desc: 'Intelligently analyze your ideas and generate high-quality prompt templates for images, videos, and more on other AI platforms',
    feature2Title: 'AI Blueprint Generator',
    feature2Desc: 'Generate complete project blueprints with one click, transforming creative ideas into actionable plans',
    feature3Title: 'AI Patent Generator',
    feature3Desc: 'Professional patent document generation supporting Invention Patents, Utility Models, and Design Patents',

    // Projects
    myProjects: 'My Projects',
    projectsDesc: 'Manage your creative projects',
    emptyStateTitle: 'No Projects Yet',
    emptyStateDesc: 'Click "Create Project" to start your creative journey',
    createFirst: '✨ Create First Project',
    noDesc: 'No description',

    // Process
    processTitle: 'How It Works',
    processDesc: 'Four simple steps to bring your spark to reality',
    step1: 'Input Your Spark',
    step2: 'AI Refinement',
    step3: 'Generate Output',
    step4: 'Make It Real',

    // Form
    createProject: '✨ Create Project',
    createModalTitle: '✨ Create New Project',
    editModalTitle: '✏️ Edit Project',
    detailModalTitle: '📋 Project Details',
    aiModalTitle: '🤖 AI Generation',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    techField: 'Tech Field',
    techFieldPlaceholder: 'Enter tech field',
    projectType: 'Project Type',
    selectType: 'Select type',
    invention: 'Invention Patent',
    utility: 'Utility Model',
    design: 'Design Patent',
    projectDesc: 'Description',
    projectDescPlaceholder: 'Describe your creative idea...',
    describeIdea: 'Describe Your Spark of Inspiration',
    ideaPlaceholder: 'Enter your spark of inspiration, AI will help refine it...',
    apiKeyPlaceholder: 'Enter your API Key',
    apiKeyLabel: 'API Key',
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
    promptGeneration: 'Generate Prompt Template',
    projectPlan: 'Generate Blueprint',
    aiIdeaPlaceholder: 'Enter your spark of inspiration, AI will help refine it...',
    generatePrompt: 'Generate Prompt Template',
    generatePlan: 'Generate Blueprint',
    generating: 'Generating...',
    copy: 'Copy',
    submit: 'Submit',
    startGeneration: 'Start Generation',
    aiThinking: 'AI is thinking...',
    generatedResult: 'Generated Result',
    saveToProject: 'Save to Project',
    apiKeyNotice: 'AI features require API Key configuration',
    apiKeySettings: 'Settings',
    enterApiKey: 'Enter API Key',
    saveApiKey: 'Save',

    // Footer
    footerContact: 'Questions or suggestions? Contact Us',
    footerCopyright: '© 2026 IDEA Builder. AI-powered Creative Incubator',
    keyboardHint: 'Press Enter to send, Shift+Enter for new line',
    copyright: '© 2026 IDEA Builder. AI-powered Creative Incubator',
    promptGenDesc: 'Generate high-quality prompt templates for other AI platforms',
    projectGenDesc: 'Generate complete project blueprints with detailed execution plans',

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
    apiError: 'API Error',

    // Demo Mode
    demoMode: 'Demo Mode',
    demoModeDesc: 'This is demo output. <a href="#" id="demoConfigLink">Configure API Key</a> for real AI generation.',
    patentGeneration: 'Patent Generation',

    // Form
    requiredField: 'This field is required',
    copied: 'Copied to clipboard',
    generatePatent: 'Generate Patent'
  }
};