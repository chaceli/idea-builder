import type { MiniMaxRequest, MiniMaxResponse, PatentType } from '@/types'

// MiniMax API 配置
const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1'

export class MiniMaxService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // 生成专利标题
  async generateTitle(
    type: PatentType,
    description: string,
    field: string
  ): Promise<string> {
    const prompt = this.buildTitlePrompt(type, description, field)
    return this.callAPI(prompt)
  }

  // 生成专利摘要
  async generateAbstract(
    type: PatentType,
    title: string,
    description: string
  ): Promise<string> {
    const prompt = this.buildAbstractPrompt(type, title, description)
    return this.callAPI(prompt)
  }

  // 生成权利要求书
  async generateClaims(
    type: PatentType,
    title: string,
    abstract: string,
    description: string
  ): Promise<string> {
    const prompt = this.buildClaimsPrompt(type, title, abstract, description)
    return this.callAPI(prompt)
  }

  // 生成说明书
  async generateSpecification(
    type: PatentType,
    title: string,
    abstract: string,
    description: string,
    background?: string
  ): Promise<string> {
    const prompt = this.buildSpecificationPrompt(type, title, abstract, description, background)
    return this.callAPI(prompt)
  }

  // 生成完整专利
  async generateFullPatent(
    type: PatentType,
    title: string,
    description: string,
    field: string,
    background?: string
  ): Promise<{
    title: string
    abstract: string
    claims: string
    specification: string
  }> {
    // 1. 生成标题
    const generatedTitle = await this.generateTitle(type, description, field)
    
    // 2. 生成摘要
    const abstract = await this.generateAbstract(type, generatedTitle, description)
    
    // 3. 生成权利要求书
    const claims = await this.generateClaims(type, generatedTitle, abstract, description)
    
    // 4. 生成说明书
    const specification = await this.generateSpecification(
      type,
      generatedTitle,
      abstract,
      description,
      background
    )

    return {
      title: generatedTitle,
      abstract,
      claims,
      specification
    }
  }

  private async callAPI(prompt: string): Promise<string> {
    const request: MiniMaxRequest = {
      model: 'abab6.5s-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的专利撰写专家，精通中国专利法及相关法规。你撰写的专利文档专业、严谨、完整，符合国家知识产权局的要求。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    }

    const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'MiniMax API 调用失败')
    }

    const data: MiniMaxResponse = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('API 返回内容为空')
    }

    return data.choices[0].message.content
  }

  private buildTitlePrompt(type: PatentType, description: string, field: string): string {
    const typeName = {
      invention: '发明',
      utility: '实用新型',
      design: '外观设计'
    }[type]

    return `请为以下${typeName}专利生成一个简洁、准确、专业的专利名称（不超过30个字）：

技术领域：${field}
发明创意：${description}

要求：
1. 体现发明点和技术方案
2. 用词专业、准确
3. 符合专利命名规范
4. 直接输出专利名称，不要其他内容`
  }

  private buildAbstractPrompt(type: PatentType, title: string, description: string): string {
    const typeName = {
      invention: '发明',
      utility: '实用新型',
      design: '外观设计'
    }[type]

    return `请为以下${typeName}专利生成摘要（200-300字）：

专利名称：${title}
发明创意：${description}

要求：
1. 简要说明发明名称、技术领域
2. 明确发明的技术问题
3. 概述技术方案要点
4. 说明主要用途和效果
5. 符合专利摘要撰写规范`
  }

  private buildClaimsPrompt(type: PatentType, title: string, abstract: string, description: string): string {
    const typeName = {
      invention: '发明',
      utility: '实用新型',
      design: '外观设计'
    }[type]

    return `请为以下${typeName}专利撰写权利要求书：

专利名称：${title}
摘要：${abstract}
发明创意：${description}

要求：
1. 独立权利要求应概括发明的主要技术特征
2. 从属权利要求对独立权利要求进行进一步限定
3. 权利要求应当以说明书为依据，清楚、简要地限定要求保护的范围
4. 符合中国专利法对权利要求的规定
5. 包含至少1项独立权利要求和2-3项从属权利要求
6. 使用专利法律术语`
  }

  private buildSpecificationPrompt(
    type: PatentType,
    title: string,
    abstract: string,
    description: string,
    background?: string
  ): string {
    const typeName = {
      invention: '发明',
      utility: '实用新型',
      design: '外观设计'
    }[type]

    return `请为以下${typeName}专利撰写说明书：

专利名称：${title}
摘要：${abstract}
发明创意：${description}
背景技术：${background || '暂无'}

要求：
1. 技术领域：明确本发明所属技术领域
2. 背景技术：客观描述现有技术的状况及存在的问题
3. 发明内容：清楚说明要解决的技术问题及技术方案
4. 附图说明（如有）：描述附图
5. 具体实施方式：详细说明本发明的最佳实施方式
6. 有益效果：说明本发明带来的技术效果
7. 符合专利说明书撰写规范
8. 内容完整、专业`
  }
}

export default MiniMaxService
