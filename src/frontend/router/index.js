import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/activities',
    name: 'ActivityList',
    component: () => import('../components/ActivityList.vue')
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetail',
    component: () => import('../components/ActivityDetail.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../components/Admin.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.path.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      next('/login');
      return;
    }
  }

  next();
});

export default router;
