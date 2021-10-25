import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/plugins/firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      // Войти
      name: 'Войти',
      path: '/',
      component: () => import('@/views/Login'),
      meta: {
        guest: true,
      },
    },
    // Dashboard
    {
      name: 'Проекты План',
      path: '/projects',
      component: () => import('@/views/dashboard/Dashboard'),
      meta: {
        auth: true,
      },
    },
    {
      name: 'Оплаты',
      path: '/payments',
      component: () => import('@/views/Payments'),
      meta: {
        auth: true,
        manager: true,
      },
    },
    {
      name: 'Поступления',
      path: '/income',
      component: () => import('@/views/Income'),
      meta: {
        auth: true,
      },
    },
    {
      name: 'Затраты HeroIn',
      path: '/heroin',
      component: () => import('@/views/Expenses'),
      meta: {
        auth: true,
      },
    },
    {
      name: 'Настройки',
      path: '/settings',
      component: () => import('@/views/Settings'),
      meta: {
        auth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.auth)
  if (requiresAuth && !currentUser) next('/')
  else if (currentUser) {
    currentUser.getIdTokenResult()
      .then(function ({
        claims,
      }) {
        if (claims.admin) {
          if (to.path === '/') {
            next({
              path: '/projects',
            })
          } else next()
        } else {
          if (to.path !== '/payments') {
            next({
              path: '/payments',
            })
          } else next()
        }
      })
  } else next()
})
export default router
