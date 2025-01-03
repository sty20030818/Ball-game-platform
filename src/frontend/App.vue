<template>
  <div class="min-h-screen">
<nav class="navbar is-white has-shadow">
  <div class="container">
    <div class="navbar-brand">
      <router-link
        to="/"
        class="navbar-item is-size-4 has-text-weight-bold has-text-primary"
      >
        约球平台
      </router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <router-link
          to="/register"
          class="navbar-item has-text-grey has-text-primary-hover"
        >
          注册
        </router-link>
        <router-link
          to="/login"
          class="navbar-item has-text-grey has-text-primary-hover"
        >
          登录
        </router-link>
      </div>
    </div>
  </div>
</nav>

<main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
