import axios from 'axios';

const service = axios.create({
    baseURL:"",// url = base url + request url
    timeout:1000000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        //  在请求发送前做的操作,如添加tokenz至header
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.user(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service;