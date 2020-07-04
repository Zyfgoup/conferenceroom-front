<template >
    <div id="app">
        <el-container class="main">
            <el-aside :width="tabWidth+'px'">
                <div>
                    <div class="isClossTab" @click="isClossTabFun">
                        <i :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'" ><span v-if="!isCollapse">会议室管理系统</span></i>
                    </div>
                    <el-menu :class="'menu'"
                             :default-active="activeIndex"
                             class="el-menu-vertical-demo"
                             @open="handleOpen"
                             @close="handleClose"
                             :collapse="isCollapse"
                             background-color="#545c64"
                             text-color="#fff"
                             active-text-color="#ffd04b"
                             :router="true"
                    >


                        <el-submenu index="1" :disabled="!isAdmin">
                            <template slot="title">
                                <i class="iconfont iconshenqing"></i>
                                <span slot="title">会议室申请</span>
                            </template>
                            <el-menu-item index="/applyConference" >申请会议室</el-menu-item>
                            <el-menu-item index="/conferenceRecordByDep">查看记录</el-menu-item>
                        </el-submenu>

                        <el-menu-item index="/department" :disabled="isAdmin">
                            <i class="iconfont iconbumen"></i>
                            <span slot="title">部门管理</span>
                        </el-menu-item>

                        <el-menu-item index="/conference_room" :disabled="isAdmin">
                                <i class="iconfont iconhuiyishi"></i>
                                <span slot="title">会议室管理</span>

                        </el-menu-item>

                        <el-submenu index="4" :disabled="isAdmin">
                            <template slot="title">
                                <i class="iconfont iconmenu-s"></i>
                                <span slot="title">申请管理</span>
                            </template>
                                <el-menu-item index="/conferenceRecordByAdmin">查看申请</el-menu-item>
                                <el-menu-item index="/applyConferenceByAdmin">紧急申请</el-menu-item>

                        </el-submenu>

                    </el-menu>
                </div>
            </el-aside>
            <el-container>
                <el-header class="main-header" >
                    <div style="margin-top: 20px">
                    <el-dropdown @command="dropdown">
                        <i class="el-icon-s-tools" style="margin-right: 10px;"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="isAdmin" command="部门信息">部门信息</el-dropdown-item>
                            <el-dropdown-item command="退出">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>{{this.username}}</span>
                    </div>
                </el-header>
                <el-main>
                    <el-breadcrumb separator="/" class="crumbs">
                        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
                            <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <div>
                        <router-view></router-view>
                    </div>
                </el-main>
                <el-footer class="main-footer" height="50px">
                    <p>@2020 Zyfgoup 企业会议室管理系统</p>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                isCollapse: false,
                tabWidth: 200,
                test1: 1,
                intelval: null,
                levelList: null,
                isAdmin:false,
                username:'王小虎',
                activeIndex:'',

            };
        },
        methods: {

            //data会返回下拉菜单中绑定的额值
            dropdown(data){
                if(data==='退出')
                    this.logout()
                else {
                    this.$router.push("/departmentInfo")
                }
            },

            //退出
            logout(){

                const _this = this;
                this.axios.get("/logout",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("登出成功");
                    _this.$store.commit("REMOVE_INFO");
                    _this.username='';
                    _this.$router.push("/login")
                })
            },

            /**
             * 生成面包屑的方法
             */
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name)

                const first = matched[0];

                if (first && first.name !== 'index') {
                    matched = [{path: '/index', meta: {title: '首页'}}].concat(matched)
                }
                this.levelList = matched;
                if(matched.length>1){
                    this.activeIndex = matched[1].path;
                }else
                    this.activeIndex = matched[0].path;
            },

            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
               // console.log(key, keyPath);
            },

            isClossTabFun() {
                clearInterval(this.intelval);
                if (!this.isCollapse) {
                    this.intelval = setInterval(() => {
                        if (this.tabWidth <= 64)
                            clearInterval(this.intelval);
                        this.tabWidth -= 1;
                    }, 1);
                } else {
                    this.tabWidth = 200;
                }
                this.isCollapse = !this.isCollapse;
            }
        },
        created() {
            //获取面包屑
            this.getBreadcrumb();

           let userInfo = JSON.parse(Cookies.get("userInfo"))
            //获取角色 侧边栏权限
            if(userInfo.role=='user'){
                this.isAdmin = true;
            }
            if(userInfo.username){
                this.username = userInfo.username;
            }
        },
        watch: {
            $route(to, from) {
                this.getBreadcrumb();
            }
        }
    }
</script>

<style>
    *{
        padding: 0;
        margin: 0;
    }

</style>
<style scoped>
    .main {
        height: 100vh;
        min-width: 800px;
        min-height: 600px;
        overflow: hidden;
    }

    aside {
        overflow: visible;
        height: 100%;
        background-color: #545c64;
        color: #FFF;
    }

    .isClossTab{
                width: 100%;
                height: 60px;
                cursor: pointer;
                font-size: 16px;
                text-align: center;
                line-height: 60px;
                font-weight: bold;
                border-right: 1px solid #807c7c;
                box-sizing: border-box;
    }


    .main-header {
        background-color:oldlace;
        color: #FFF;
        text-align: right;
        font-size: 16px;
        color: olivedrab;
    }



    .crumbs {
        margin-bottom: 20px;
    }

    .main-footer{
            text-align: center;
            font-size: 13px;
            line-height: 50px;
        }


</style>