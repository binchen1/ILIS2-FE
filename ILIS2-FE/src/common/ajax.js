import axios from 'axios'
import { loginUrl } from "../../projectConfig/url";
import { message } from "ant-design-vue";

const resCode = {
  "20000": "请求成功",
  "20010": "请求失败",
  "21000": "新增成功",
  "22000": "修改成功",
  "23000": "删除成功"
}

// 创建axios实例
const ajax = axios.create({
  timeout: 15000,
  // headers: {'Content-Type': 'application/json;charset=UTF-8'}
})

// request拦截器
ajax.interceptors.request.use(config => {
  // config.headers['header'] = '111'
  return config
},
error => {
  const { response } = error

  Promise.reject(error)
})

// respone拦截器
ajax.interceptors.response.use(
  response => {
    const res = response.data;

    // 判断是否登陆信息过期，是则跳转到登陆页
    if(typeof res === 'string' && res.match(/<!DOCTYPE html>/g)){
        message.error("用户未登录！");
        top.window.location.href = loginUrl;
    }else{
        
    }

    return response.data
  },
  error => {    
    const { response } = error
    message.error("网络出现问题，请稍后再试");
    return Promise.reject(error)
  }
)

export default ajax