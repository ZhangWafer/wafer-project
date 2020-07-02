// eslint-disable-next-line no-unused-vars
import VueRouter from 'vue-router'
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import one from '../components/one.vue'
import cook from '../components/cookerPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: one
  },
  {
    path: '/cook',
    component: cook
  }
]

const router = new VueRouter({
  routes
})

export default router
