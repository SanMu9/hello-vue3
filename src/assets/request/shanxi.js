/*
 * @Author: your name
 * @Date: 2021-05-24 10:23:38
 * @LastEditTime: 2021-05-24 10:51:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/assets/request/shanxi.js
 */
import axios from 'axios';

const request = axios.create({
    baseURL: 'http://172.26.10.68:8092/',
    timeout: 100000
})

request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error)
        return Promise.reject(error);
    }
)

/**
 * @description: 
 * @param {*} city 查询条件 所在市
 * @param {*} district 查询条件 所在区县
 * @param {*} name 查询条件 名称
 * @return {*}
 */
export const GetPointsListReq = (city='',district='',name='') => {
    return request({
        url: '/data/showList',
        method: 'post',
        data:{city,district,name}
    })
}
