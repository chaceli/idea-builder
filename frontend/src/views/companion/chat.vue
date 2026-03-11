<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>✨ AI 陪伴</h2>
          <router-link to="/companion/profile" class="profile-btn">👤</router-link>
        </div>
        <div class="sidebar-actions">
          <button class="new-chat-btn" @click="startNewChat">
            <span>+</span> 新对话
          </button>
        </div>
        <div class="chat-list">
          <div 
            v-for="chat in chatList" 
            :key="chat.id" 
            class="chat-item"
            :class="{ active: currentChatId === chat.id }"
            @click="selectChat(chat.id)"
          >
            <span class="chat-icon">💬</span>
            <span class="chat-title">{{ chat.title }}</span>
          </div>
        </div>
      </aside>

      <!-- 聊天区域 -->
      <main class="chat-main">
        <div class="chat-messages" ref="messagesRef">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="message"
            :class="{ 'message-user': msg.role === 'user', 'message-ai': msg.role === 'assistant' }"
          >
            <div class="message-avatar">
              {{ msg.role === 'user' ? '👤' : '✨' }}
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(msg.content)"></div>
              <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
            </div>
          </div>
          <div v-if="isLoading" class="message message-ai">
            <div class="message-avatar">✨</div>
            <div class="message-content">
              <div class="message-text typing">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <textarea 
            v-model="inputText" 
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            @keydown="handleKeyDown"
            :disabled="isLoading"
          ></textarea>
          <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()">
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

interface Chat {
  id: string
  title: string
}

const messages = ref<Message[]>([])
const chatList = ref<Chat[]>([{ id: '1', title: '新对话' }])
const currentChatId = ref('1')
const inputText = ref('')
const isLoading = ref(false)
const messagesRef = ref<HTMLElement>()

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: inputText.value,
    createdAt: new Date()
  }

  messages.value.push(userMessage)
  const question = inputText.value
  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    // TODO: 调用后端 API
    // 模拟 AI 回复
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(question),
      createdAt: new Date()
    }
    messages.value.push(aiMessage)
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '抱歉，我现在有点累，稍后再陪我聊聊天吧~',
      createdAt: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const getAIResponse = (question: string): string => {
  const responses = [
    '我理解你的感受~ 你可以跟我详细说说吗？',
    '这很有趣！让我帮你想想...',
    '我相信你可以做到的！加油~',
    '听起来不错！还有什么想聊的吗？',
    '我一直在你身边，有什么心事可以跟我说说~'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const startNewChat = () => {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: '新对话'
  }
  chatList.value.unshift(newChat)
  currentChatId.value = newChat.id
  messages.value = []
}

const selectChat = (id: string) => {
  currentChatId.value = id
  // TODO: 加载聊天历史
}

onMounted(() => {
  // 欢迎消息
  messages.value.push({
    id: '0',
    role: 'assistant',
    content: '你好呀！我是小桃，你的 AI 陪伴伙伴~ ✨<br>有什么想聊的吗？我会一直陪着你哦~',
    createdAt: new Date()
  })
})
</script>

<style scoped lang="scss">
.chat-page {
  height: 100vh;
  background: #f5f5f5;
}

.chat-container {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;

    h2 {
      font-size: 18px;
      margin: 0;
    }

    .profile-btn {
      font-size: 20px;
      text-decoration: none;
    }
  }

  .sidebar-actions {
    padding: 15px;

    .new-chat-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;

      span {
        margin-right: 8px;
      }

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;

    .chat-item {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: #e8f4ff;
        border-left: 3px solid #667eea;
      }

      .chat-icon {
        margin-right: 10px;
      }

      .chat-title {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  .message {
    display: flex;
    margin-bottom: 20px;

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .message-content {
      max-width: 70%;

      .message-text {
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.6;
      }

      .message-time {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }

    &.message-user {
      flex-direction: row-reverse;

      .message-avatar {
        margin-right: 0;
        margin-left: 12px;
      }

      .message-content {
        .message-text {
          background: #667eea;
          color: #fff;
        }

        .message-time {
          text-align: right;
        }
      }
    }

    &.message-ai {
      .message-avatar {
        background: #f0f0f0;
      }

      .message-text {
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    }

    .typing .dot {
      animation: bounce 1.4s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

.chat-input-area {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  gap: 12px;

  textarea {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    resize: none;
    font-size: 14px;
    font-family: inherit;
    min-height: 44px;
    max-height: 120px;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .send-btn {
    padding: 0 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
}
</style>
