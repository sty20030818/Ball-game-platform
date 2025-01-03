<template>
  <div class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <!-- 用户登录 -->
          <div class="box">
            <h2 class="title has-text-centered">用户登录</h2>
            <form @submit.prevent="handleUserLogin">
              <div class="field">
                <label class="label">邮箱</label>
                <div class="control">
                  <input
                    v-model="userForm.email"
                    class="input"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">密码</label>
                <div class="control">
                  <input
                    v-model="userForm.password"
                    class="input"
                    type="password"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button
                    :disabled="loading"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': loading }"
                  >
                    {{ loading ? '登录中...' : '立即登录' }}
                  </button>
                </div>
              </div>

              <div class="has-text-centered mt-4">
                <router-link to="/register" class="is-size-7">
                  还没有账号？立即注册
                </router-link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUserLogin: true,
      userForm: {
        email: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    switchMode(isUser) {
      this.isUserLogin = isUser;
      this.userForm = { username: '', password: '' };
    },
    async handleUserLogin() {
      this.loading = true;
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.userForm)
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.user.role);

          // 显示成功提示
          const toast = document.createElement('div');
          toast.className = 'success-toast';
          toast.textContent = '登录成功！';
          document.body.appendChild(toast);

          // 500ms后移除提示并跳转
          setTimeout(() => {
            document.body.removeChild(toast);
            if (data.user && data.user.role === 'admin') {
              this.$router.push('/admin');
            } else {
              this.$router.push('/activities');
            }
          }, 500);
        } else {
          throw new Error(data.message || '登录失败');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style>
/* 全局样式 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<style scoped>
.tabs ul {
  margin-bottom: 1.5rem;
}
</style>
