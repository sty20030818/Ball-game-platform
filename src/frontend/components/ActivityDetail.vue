<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">加载中...</div>
    <div v-else>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-4">{{ activity.title }}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-gray-600 mb-4">{{ activity.description }}</p>
            <div class="space-y-2 text-sm text-gray-500">
              <p><span class="font-medium">地点:</span> {{ activity.location }}</p>
              <p><span class="font-medium">时间:</span> {{ formatDate(activity.date) }}</p>
              <p><span class="font-medium">类型:</span> {{ activity.type }}</p>
              <p><span class="font-medium">费用:</span> {{ activity.fee }}元</p>
              <p><span class="font-medium">最大人数:</span> {{ activity.maxParticipants }}</p>
              <p><span class="font-medium">组织者:</span> {{ activity.organizer.username }}</p>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">参与者 ({{ activity.participants.length }})</h2>
            <ul class="space-y-2">
              <li v-for="participant in activity.participants" :key="participant._id">
                {{ participant.username }}
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">评论</h2>
          <div class="space-y-4">
            <div v-for="comment in activity.comments" :key="comment._id" class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">{{ comment.content }}</p>
              <p class="text-sm text-gray-400 mt-2">- {{ comment.user.username }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const activity = ref({});
const loading = ref(true);
const route = useRoute();

const fetchActivity = async () => {
  try {
    const response = await axios.get(`/api/activities/${route.params.id}`);
    activity.value = response.data;
  } catch (error) {
    console.error('获取活动详情失败:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchActivity();
});
</script>

<style scoped>
/* 自定义样式 */
</style>
