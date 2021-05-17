/*
 * @Author: your name
 * @Date: 2021-05-17 10:17:58
 * @LastEditTime: 2021-05-17 10:57:03
 * @LastEditors: Please set LastEditors
 * 
 * @Description: zhitongborui 接口
 * 参考网站
 * 地址：http://city.ztbory.com/#/
 * 账号：sheshichu
 * 密码：admin123
 * 
 * @FilePath: /hello-vue3/src/assets/request/zhitongborui.js
 */
import axios from 'axios';

const request = axios.create({
    baseURL: 'http://114.118.7.20:8094/',
    timeout: 100000
})


request.interceptors.request.use(
    config => {
        const token = "a67885ab7990ec22c2d2988d18d6b6c6bf96c289";
        config.headers['Authorization'] = 'token ' + token;

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)

export const GetCityOrgPointsReq = (params) => {
    return request({
        url: '/v1/city/management/org_point/',
        method:'get',
        params:params
    })
}