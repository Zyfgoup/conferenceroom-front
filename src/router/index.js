import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import error from '../views/error'
import index from '../views/index'
import department from '../views/department'
import conference_room from "../views/conference_room";
import departmentInfo from "../views/departmentInfo";
import applyConference from "../views/applyConference";
import conferenceRecordByDep from "../views/conferenceRecordByDep";
import conferenceRecordByAdmin from "../views/conferenceRecordByAdmin";
import home from '../views/home';
import applyConferenceByAdmin from "../views/applyConferenceByAdmin";
import device from '../views/device'
import employeeInfo from "../views/employeeInfo";


Vue.use(VueRouter);

  const routes = [

    {
      path: "/",
      name: 'genmulu',
      redirect:{name:'login'}
      // redirect:'/login'

    },
    {
      path:"/login",
      name:'login',
      component:login
    },
    {
      path:"/index",
      name:'index',
      component:index,
      meta:{
        title:'首页',
        requireAuth:true,
      },
      children:[
        {
          path:"/",
          name:'home',
          component:home,
        },

        {
          path:"/department",
          name:'department',
          component:department,
          meta:{
            title:'部门管理',
            requireAuth:true,
            role:['admin']
          }
        },
        {
          path:"/conference_room",
          name:'conference_room',
          component:conference_room,
          meta:{
            title:'会议室管理',
            requireAuth:true,
            role:['admin']
          }
        },
        {
          path:"/departmentInfo",
          name:'departmentInfo',
          component:departmentInfo,
          meta:{
            title:'部门信息',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/employeeInfo",
          name:'employeeInfo',
          component:employeeInfo,
          meta:{
            title:'员工信息',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/applyConference",
          name:'applyConference',
          component:applyConference,
          meta:{
            title:'会议室申请',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/conferenceRecordByDep",
          name:'conferenceRecordByDep',
          component:conferenceRecordByDep,
          meta:{
            title:'查看申请记录',
            requireAuth:true,
            role:['user']
          }
        },
        {
          path:"/conferenceRecordByAdmin",
          name:'conferenceRecordByAdmin',
          component:conferenceRecordByAdmin,
          meta:{
            title:'查看申请记录',
            requireAuth:true,
            role:['admin']
          }
        },
        {
          path:"/applyConferenceByAdmin",
          name:'applyConferenceByAdmin',
          component:applyConferenceByAdmin,
          meta:{
            title:'紧急申请',
            requireAuth:true,
            role:['admin']
          }
        },

        {
          path:"/device",
          name:'device',
          component:device,
          meta:{
            title:'查看设备',
            requireAuth:true,
            role:['admin']
          }
        },

      ]

    },


    {
      path:'*',
      name:'error',
      component:error
    }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
