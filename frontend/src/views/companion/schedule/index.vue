<!-- src/frontend/src/pages/schedule/index.vue -->
<template>
  <view class="schedule-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">日程提醒</text>
      <view class="add-btn" @click="showAddModal = true">
        <text>+</text>
      </view>
    </view>

    <!-- 今日日程 -->
    <view class="section">
      <text class="section-title">今天</text>
      <view v-if="todaySchedules.length === 0" class="empty">
        <text>今天没有日程哦~</text>
      </view>
      <view v-else class="schedule-list">
        <view v-for="item in todaySchedules" :key="item.id" class="schedule-item">
          <view class="schedule-content">
            <text class="schedule-title">{{ item.title }}</text>
            <text class="schedule-time">{{ formatTime(item.remindAt) }}</text>
          </view>
          <view class="schedule-actions">
            <view v-if="!item.completed" class="check-btn" @click="completeSchedule(item.id)">
              <text>✓</text>
            </view>
            <view class="delete-btn" @click="deleteSchedule(item.id)">
              <text>✕</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 未来日程 -->
    <view class="section">
      <text class="section-title">未来</text>
      <view v-if="futureSchedules.length === 0" class="empty">
        <text>没有未来的日程~</text>
      </view>
      <view v-else class="schedule-list">
        <view v-for="item in futureSchedules" :key="item.id" class="schedule-item">
          <view class="schedule-content">
            <text class="schedule-title">{{ item.title }}</text>
            <text class="schedule-time">{{ formatDateTime(item.remindAt) }}</text>
          </view>
          <view class="schedule-actions">
            <view class="delete-btn" @click="deleteSchedule(item.id)">
              <text>✕</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加日程弹窗 -->
    <view v-if="showAddModal" class="modal-mask" @click="showAddModal = false">
      <view class="modal" @click.stop>
        <text class="modal-title">添加日程</text>
        <input v-model="newSchedule.title" class="modal-input" placeholder="日程标题" />
        <input v-model="newSchedule.content" class="modal-input" placeholder="备注（可选）" />
        <view class="modal-time">
          <text>提醒时间：</text>
          <picker mode="time" :value="newSchedule.time" @change="onTimeChange">
            <text>{{ newSchedule.time || '选择时间' }}</text>
          </picker>
        </view>
        <view class="modal-actions">
          <view class="cancel-btn" @click="showAddModal = false">取消</view>
          <view class="confirm-btn" @click="addSchedule">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getScheduleListApi, addScheduleApi, completeScheduleApi, deleteScheduleApi } from '@/services/api';

interface Schedule {
  id: string;
  title: string;
  content?: string;
  remindAt: string;
  completed: boolean;
}

const schedules = ref<Schedule[]>([]);
const showAddModal = ref(false);
const newSchedule = ref({
  title: '',
  content: '',
  date: '',
  time: '',
});

const todaySchedules = computed(() =>
  schedules.value.filter((s) => {
    const today = new Date().toDateString();
    return new Date(s.remindAt).toDateString() === today && !s.completed;
  })
);

const futureSchedules = computed(() =>
  schedules.value.filter((s) => {
    const today = new Date().toDateString();
    return new Date(s.remindAt).toDateString() !== today && !s.completed;
  })
);

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(dateStr)}`;
};

const loadSchedules = async () => {
  try {
    const res = await getScheduleListApi();
    schedules.value = res.schedules;
  } catch (error) {
    console.error('加载日程失败:', error);
  }
};

const addSchedule = async () => {
  if (!newSchedule.value.title || !newSchedule.value.time) {
    uni.showToast({ title: '请填写完整', icon: 'none' });
    return;
  }

  const today = new Date();
  const [hours, minutes] = newSchedule.value.time.split(':');
  const remindAt = new Date(today.setHours(parseInt(hours), parseInt(minutes)));

  try {
    await addScheduleApi({
      title: newSchedule.value.title,
      content: newSchedule.value.content,
      remindAt: remindAt.toISOString(),
    });
    showAddModal.value = false;
    newSchedule.value = { title: '', content: '', date: '', time: '' };
    await loadSchedules();
    uni.showToast({ title: '添加成功', icon: 'success' });
  } catch (error) {
    console.error('添加失败:', error);
  }
};

const completeSchedule = async (id: string) => {
  try {
    await completeScheduleApi(id);
    await loadSchedules();
  } catch (error) {
    console.error('完成失败:', error);
  }
};

const deleteSchedule = async (id: string) => {
  try {
    await deleteScheduleApi(id);
    await loadSchedules();
  } catch (error) {
    console.error('删除失败:', error);
  }
};

const onTimeChange = (e: any) => {
  newSchedule.value.time = e.detail.value;
};

onMounted(() => {
  loadSchedules();
});
</script>

<style lang="scss" scoped>
.schedule-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
  }

  .add-btn {
    width: 60rpx;
    height: 60rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 40rpx;
  }
}

.section {
  margin-bottom: 40rpx;

  .section-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
    display: block;
  }
}

.empty {
  text-align: center;
  color: #999;
  padding: 40rpx;
}

.schedule-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .schedule-title {
    font-size: 30rpx;
    color: #333;
  }

  .schedule-time {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    display: block;
  }

  .schedule-actions {
    display: flex;
    gap: 20rpx;
  }

  .check-btn,
  .delete-btn {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
  }

  .check-btn {
    background-color: #4facfe;
    color: #fff;
  }

  .delete-btn {
    background-color: #ff6b6b;
    color: #fff;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;

  .modal-title {
    font-size: 32rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 30rpx;
  }

  .modal-input {
    border: 1rpx solid #eee;
    border-radius: 10rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
  }

  .modal-time {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    color: #333;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .cancel-btn,
    .confirm-btn {
      padding: 15rpx 40rpx;
      border-radius: 30rpx;
      font-size: 28rpx;
    }

    .cancel-btn {
      background-color: #f5f5f5;
      color: #666;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
  }
}
</style>
