import axios from 'axios'
import {BASE_URL} from './url.js'
import {getToken,setToken, removeToken} from './anth'

//请求配置项
 const API= axios.create({
    baseURL:BASE_URL
})

//添加请求拦截器
//能吊起请求拦截器说明已经发起请求了 
//需要拿到请求的url做判断 是不是/user开头  如果是添加请求头 对登录和注册放行

//吊起拦截器
API.interceptors.request.use(config=>{
    // console.log(config)
    const {url}=config
    if(url.startsWith('/user')&&!url.startsWith('/user/login')&&!url.startsWith('/user/registered')){
//对以上几种情况添加请求头
config.headers.Authoriztion=getToken()
    }
    return config
})

//添加响应拦截器
//判断返回的状态码是不是400
API.interceptors.response.use(response=>{
    const{status}=response.data
    if(status===400){
        removeToken()
    }
    return response
})

export  {API}