<template>
  <div class="admin-container">
    <h1>管理员面板</h1>
    <nav class="admin-nav">
      <router-link to="/admin/dashboard">仪表盘</router-link>
      <router-link to="/admin/users">用户管理</router-link>
      <router-link to="/admin/activities">活动管理</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      // 管理员数据
    };
  }
};
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-nav {
  margin: 20px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.admin-nav a {
  margin-right: 15px;
  color: #333;
  text-decoration: none;
}

.admin-nav a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}
</style>
