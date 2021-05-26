import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './result'

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})

//配置路由守卫导航
router.beforeEach((to, from, next) => {
    
    if(to.path === '/login') return next()
    
    const tokenStr = window.sessionStorage.getItem('token');
    
    if(!tokenStr) return next('/login')

    next();

})

export default router;


