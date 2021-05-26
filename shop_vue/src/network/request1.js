import axios from 'axios'

/* 导入进度条相关的包 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导出一个函数，函数返回一个axios对象
export function request1(config) {
    const instance = axios.create({
        baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
        timeout: 5000
    })
    //在axios发出请求之前拦截
    instance.interceptors.request.use(config => {
        //开启进度条
        NProgress.start()
        //为请求头添加令牌
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config;
    })
    //在axios请求完成后触发
    instance.interceptors.response.use(config => {
        //关闭进度条
        NProgress.done()
        return config;
    })
    return instance(config)
}