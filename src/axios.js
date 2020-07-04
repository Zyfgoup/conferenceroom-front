import router from './router'
import store from './store'
import axios from 'axios'
import Element from 'element-ui';


//配置基本请求路径 然后在axios中的请求路径都可以写成“/xxx”  = “http://localhost:8082/xxx”
axios.defaults.baseURL="http://localhost:8888"


//前置拦截np,
axios.interceptors.request.use(config=>{
    return config;
})

//后置拦截  发生在axios异步请求的.then(res=>{}）前
axios.interceptors.response.use(response=>{
    let res = response.data;


    //如果返回的状态码是200 则不拦截 继续走
    if(res.code === 200){
        return response
    }else{
        //返回的状态码不是200时
        Element.Message.error(res.msg)

        //返回一个reject告诉请求结束了
        return Promise.reject(response.data.msg)
    }
},

    //如果是异常 就到这里处理 例如用户名不存在 或者 没有认证 后台抛的是异常
    error=>{

        //没有认证 自己在后端定义  需要认证权限没有登录就是401  如果登录了但是不符合角色 就是403
        if(error.response.data.code=== 401 ){
            //清空 token和userinfo
            store.commit("REMOVE_INFO")

            //回到登录页面
            router.push("/login")
        }


        Element.Message.error(error.response.data.msg)
        return Promise.reject(error)
    }

)
