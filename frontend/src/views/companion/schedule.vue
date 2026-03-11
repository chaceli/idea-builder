<template>
  <div class="schedule-page">
    <div class="schedule-container">
      <div class="schedule-header">
        <h1>📅 日程提醒</h1>
        <button class="add-btn" @click="showAddModal = true">+ 添加提醒</button>
      </div>

      <div class="schedule-tabs">
        <button 
          :class="{ active: activeTab === 'today' }" 
          @click="activeTab = 'today'"
        >
          今天
        </button>
        <button 
          :class="{ active: activeTab === 'all' }" 
          @click="activeTab = 'all'"
        >
          全部
        </button>
      </div>

      <div class="schedule-list">
        <div v-if="schedules.length === 0" class="empty-state">
          <span class="empty-icon">📝</span>
          <p>还没有日程哦~</p>
          <button @click="showAddModal = true">添加第一个日程</button>
        </div>

        <div 
          v-for="schedule in schedules" 
          :key="schedule.id" 
          class="schedule-item"
          :class="{ completed: schedule.completed }"
        >
          <div class="schedule-checkbox">
            <input 
              type="checkbox" 
              :checked="schedule.completed"
              @change="toggleComplete(schedule.id)"
            />
          </div>
          <div class="schedule-content">
            <div class="schedule-title">{{ schedule.title }}</div>
            <div class="schedule-time">{{ schedule.time }}</div>
          </div>
          <button class="delete-btn" @click="deleteSchedule(schedule.id)">🗑️</button>
        </div>
      </div>

      <!-- 添加日程弹窗 -->
      <div v-if="showAddModal" class="modal-mask" @click="showAddModal = false">
        <div class="modal" @click.stop>
          <h3>添加日程</h3>
          <input 
            v-model="newSchedule.title" 
            placeholder="日程标题" 
            class="modal-input"
          />
          <input 
            v-model="newSchedule.time" 
            type="datetime-local" 
            class="modal-input"
          />
          <div class="modal-actions">
            <button @click="showAddModal = false">取消</button>
            <button class="primary" @click="addSchedule">添加</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Schedule {
  id: string
  title: string
  time: string
  completed: boolean
}

const activeTab = ref('today')
const showAddModal = ref(false)
const schedules = ref<Schedule[]>([
  { id: '1', title: '喝水提醒', time: '09:00', completed: false },
  { id: '2', title: '运动时间', time: '18:00', completed: true },
])

const newSchedule = ref({
  title: '',
  time: ''
})

const addSchedule = () => {
  if (!newSchedule.value.title) return
  
  schedules.value.push({
    id: Date.now().toString(),
    title: newSchedule.value.title,
    time: newSchedule.value.time || '00:00',
    completed: false
  })
  
  newSchedule.value = { title: '', time: '' }
  showAddModal.value = false
}

const toggleComplete = (id: string) => {
  const schedule = schedules.value.find(s => s.id === id)
  if (schedule) {
    schedule.completed = !schedule.completed
  }
}

const deleteSchedule = (id: string) => {
  schedules.value = schedules.value.filter(s => s.id !== id)
}
</script>

<style scoped lang="scss">
.schedule-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.schedule-container {
  max-width: 600px;
  margin: 0 auto;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    margin: 0;
  }

  .add-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
}

.schedule-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 8px 20px;
    border: none;
    background: #fff;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: #667eea;
      color: #fff;
    }
  }
}

.schedule-list {
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border-radius: 12px;

    .empty-icon {
      font-size: 48px;
    }

    p {
      color: #999;
      margin: 20px 0;
    }

    button {
      padding: 10px 24px;
      background: #667eea;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  }
}

.schedule-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;

  &.completed {
    opacity: 0.6;

    .schedule-title {
      text-decoration: line-through;
    }
  }

  .schedule-checkbox {
    margin-right: 12px;
  }

  .schedule-content {
    flex: 1;

    .schedule-title {
      font-size: 16px;
      margin-bottom: 4px;
    }

    .schedule-time {
      font-size: 14px;
      color: #999;
    }
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;

  h3 {
    margin: 0 0 20px;
  }

  .modal-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    margin-bottom: 12px;
    box-sizing: border-box;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;

      &.primary {
        background: #667eea;
        color: #fff;
      }
    }
  }
}
</style>
