//对token进行处理
const TOKEN_NAME='zf_token'

//获取token
const getToken=()=>localStorage.getItem(TOKEN_NAME)

//设置token
const setToken=(value)=>localStorage.setItem(TOKEN_NAME,value)

//删除token
const removeToken=()=>localStorage.removeItem(TOKEN_NAME)

//检测是否登录
//检查本地是否有token 如果有（true）取两遍反还是true 如果没有（undefined）取两边反是false保证不会暴露出undefined
const isAuth=()=>!!getToken()

export {getToken,setToken,removeToken,isAuth}