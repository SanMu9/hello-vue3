/*
 * @Author: your name
 * @Date: 2021-05-17 10:17:58
 * @LastEditTime: 2021-05-18 18:21:41
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
        const token = "40ba4f7bc83356d0e2a33cd0db92b8ef8cb1ac17";
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

export const GetCoordsReq = params => {
    return  request({
        url:'/v1/city/coding/',
        method:'get',
        params:params
    })
}

export const GetRegionsReq = params => {
    return request({
        url:'/v1/city/non_resident/',
        method:'get',
        params:params
    })
}
// export const GetCarRouteReq = (params) => {

// }