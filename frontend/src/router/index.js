import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/admin/login', component: AdminLogin },
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: (_to, _from, next) => {
      const { isAuthenticated } = useAuth()
      isAuthenticated.value ? next() : next('/admin/login')
    },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
