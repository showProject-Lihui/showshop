const Login = () => import("@/views/Login"),
      Home = () => import("@/views/Home"),
      Hello = () => import("@/views/Hello"),
      Users = () => import("@/components/user/Users"),
      Rights = () => import("@/components/power/Rights"),
      Roles = () => import("@/components/power/Roles"),
      Cate = () => import("@/components/goods/Cate"),
      Goods = () => import("@/components/goods/Goods"),
      Params = () => import("@/components/goods/Params"),
      Add = () => import('@/components/goods/Add'),
      Orders = () => import('@/components/orders/Orders'),
      Echarts = () => import('@/components/echarts/Echarts')

const routes = [
    { path: '/', redirect: "/Login" },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/hello', children:[
        { path: '/hello', component: Hello },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles},
        { path: '/categories', component: Cate},
        { path: '/goods', component: Goods},
        { path: '/params', component: Params},
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Orders},
        { path: '/reports', component: Echarts}
    ]}
]

export default routes;
