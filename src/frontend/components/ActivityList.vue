<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">活动列表</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="activity in activities" :key="activity._id"
           class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 class="text-xl font-semibold mb-2">{{ activity.title }}</h2>
        <p class="text-gray-600 mb-2">{{ activity.description }}</p>
        <div class="text-sm text-gray-500 mb-4">
          <p>地点: {{ activity.location }}</p>
          <p>时间: {{ formatDate(activity.date) }}</p>
          <p>类型: {{ activity.type }}</p>
          <p>费用: {{ activity.fee }}元</p>
        </div>
        <router-link
          :to="`/activities/${activity._id}`"
          class="text-blue-500 hover:text-blue-700 font-medium"
        >
          查看详情
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const activities = ref([]);
const router = useRouter();

const fetchActivities = async () => {
  try {
    const response = await axios.get('/api/activities');
    activities.value = response.data;
  } catch (error) {
    console.error('获取活动列表失败:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>
/* 自定义样式 */
</style>
