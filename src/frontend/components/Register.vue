<template>
  <div class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="box">
            <h2 class="title has-text-centered">用户注册</h2>
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <label class="label">用户名</label>
                <div class="control">
                  <input
                    v-model="form.username"
                    class="input"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">密码</label>
                <div class="control">
                  <input
                    v-model="form.password"
                    class="input"
                    type="password"
                    required
                    minlength="8"
                  />
                </div>
                <p class="help">密码至少8位</p>
              </div>

              <div class="field">
                <label class="label">确认密码</label>
                <div class="control">
                  <input
                    v-model="form.confirmPassword"
                    class="input"
                    type="password"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">邮箱</label>
                <div class="control">
                  <input
                    v-model="form.email"
                    class="input"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">手机号</label>
                <div class="control">
                  <input
                    v-model="form.phone"
                    class="input"
                    type="tel"
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
                    {{ loading ? '注册中...' : '立即注册' }}
                  </button>
                </div>
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
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
      },
      errors: {},
      loading: false
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致';
        return false;
      }

      if (this.form.password.length < 8) {
        this.errors.password = '密码长度至少8位';
        return false;
      }

      return true;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.form.username,
            password: this.form.password,
            email: this.form.email,
            phone: this.form.phone
          })
        });

        const data = await response.json();
        if (response.ok) {
          // 显示成功提示
          const toast = document.createElement('div');
          toast.className = 'success-toast';
          toast.textContent = '注册成功！';
          document.body.appendChild(toast);

          // 500ms后移除提示并跳转
          setTimeout(() => {
            document.body.removeChild(toast);
            this.$router.push('/login');
          }, 500);
        } else {
          throw new Error(data.message || '注册失败');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
