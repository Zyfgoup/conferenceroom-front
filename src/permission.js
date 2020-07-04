import router from './router'
import Cookies from 'js-cookie'
import Element from 'element-ui';

// 路由跳转之前执行 根据路由配置文件的参数
router.beforeEach((to, from, next) => {


    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限

        const token = localStorage.getItem("token")

        if (token) { // 判断当前的token是否存在 ； 登录存入的token
            if (to.path === '/login') {
                //登录了 还访问login 放行
            } else {
                //访问别的路径
                if(to.meta.role){
                    //有角色限制
                    if(JSON.parse(Cookies.get("userInfo")).role === to.meta.role[0]){
                        next();
                    }else{
                       Element.Message.error("没有权限 禁止访问");
                        next({
                            path:from.path
                        });
                    }
                }else{
                    //没有角色限制
                    next() //放行
                }
            }
        } else {
            //没有token  去登录路由
            next({
                path: '/login'
            })
        }
    } else { //不需要登录权限的路由路径 放行
        next()
    }



})
