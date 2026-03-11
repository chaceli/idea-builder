// 测试适配器调用
const { AdapterFactory } = require('./dist/ai/adapters/index.js');

async function testAdapters() {
  console.log('=== 测试 AI 适配器 ===\n');

  // 获取支持的模型列表
  const models = AdapterFactory.getSupportedModels();
  console.log('支持的模型列表:');
  models.forEach(m => {
    console.log(`  - ${m.name} (${m.id}) - ${m.provider}`);
  });

  console.log('\n--- 测试 MiniMax 适配器 ---');
  try {
    const miniMaxAdapter = AdapterFactory.getAdapter('MiniMax-M2.5');
    console.log('适配器名称:', miniMaxAdapter.name);
    console.log('模型 ID:', miniMaxAdapter.modelId);
    console.log('✅ MiniMax 适配器创建成功\n');
  } catch (e) {
    console.error('❌ MiniMax 适配器创建失败:', e.message);
  }

  console.log('--- 测试 OpenAI 适配器 ---');
  try {
    const openaiAdapter = AdapterFactory.getAdapter('gpt-4o');
    console.log('适配器名称:', openaiAdapter.name);
    console.log('模型 ID:', openaiAdapter.modelId);
    console.log('✅ OpenAI 适配器创建成功\n');
  } catch (e) {
    console.error('❌ OpenAI 适配器创建失败:', e.message);
  }

  console.log('--- 测试 Claude 适配器 ---');
  try {
    const claudeAdapter = AdapterFactory.getAdapter('claude-sonnet-3.5');
    console.log('适配器名称:', claudeAdapter.name);
    console.log('模型 ID:', claudeAdapter.modelId);
    console.log('✅ Claude 适配器创建成功\n');
  } catch (e) {
    console.error('❌ Claude 适配器创建失败:', e.message);
  }

  console.log('--- 测试 Gemini 适配器 ---');
  try {
    const geminiAdapter = AdapterFactory.getAdapter('gemini-1.5-pro');
    console.log('适配器名称:', geminiAdapter.name);
    console.log('模型 ID:', geminiAdapter.modelId);
    console.log('✅ Gemini 适配器创建成功\n');
  } catch (e) {
    console.error('❌ Gemini 适配器创建失败:', e.message);
  }

  // 测试模型切换
  console.log('--- 测试模型切换 ---');
  const config = { modelId: 'gpt-4o', provider: 'openai', apiKey: 'test-key' };
  const newAdapter = AdapterFactory.getAdapter(config.modelId);
  console.log(`切换到模型: ${config.modelId}`);
  console.log('适配器:', newAdapter.name);
  console.log('✅ 模型切换成功\n');

  console.log('=== 所有测试完成 ===');
}

testAdapters().catch(console.error);
