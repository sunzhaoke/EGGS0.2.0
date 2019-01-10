import Vue from 'vue';
import Router from 'vue-router';

import Enter from '@/components/enter';
import Login from '@/components/login';
// 首页
import Home from '@/components/home';



import RegisterPage from '@/components/register';
import WxRegister from '@/components/wxRegister';
import MyCenter from '@/components/myCenter';

import ForgetPwd from '@/components/forgetPwd';
import RetrievePwdEmail from '@/components/retrievePwdEmail';

// 工作台

// 项目
import Project from '@/components/project';
import Workbench from '@/components/workbench';
import PersonalDocuments from '@/components/personalDocuments'
import ProjectInfo from '@/components/project/ProjectInfo';

// 项目中的任务详情
import TaskDetail from '@/components/project/taskDetail';


import Friend from '@/components/friend';


Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Home',
        component: Home,
        children: [{
            path: '/workbench',
            name: 'Workbench',
            component: Workbench,
        },
        {
            path: '/project',
            name: 'Project',
            component:  Project ,
        }, 
        {
            path:'/project/projectInfo',
            name:'ProjectInfo',
            component:  ProjectInfo ,
        },
        {
            path:'/project/taskDetail',
            name:'TaskDetail',
            component:  TaskDetail ,
        },
        {
            path:'/personalDocuments',
            name: 'PersonalDocuments',
            component:  PersonalDocuments 
        },
        {
            path: '/friend',
            name: 'Friend',
            component: Friend
        }
        ]
    }, {
        path: '/enter',
        name: 'Enter',
        component: Enter,
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage
    }, {
        path: '/wxRegister',
        name: 'WxRegister',
        component: WxRegister
    }, {
        path: '/myCenter',
        name: 'MyCenter',
        component: MyCenter
    }, {
        path: '/forgetPwd',
        name: 'ForgetPwd',
        component: ForgetPwd
    }, {
        path: '/retrievePwdEmail',
        name: 'RetrievePwdEmail',
        component: RetrievePwdEmail
    }, 
    ]
})
