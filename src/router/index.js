import Vue from 'vue'; 
import Router from 'vue-router'; 

import Home from '@/components/home'; 
import Login from '@/components/login'; 
import RegisterPage from '@/components/register'; 
import WxRegister from '@/components/wxRegister'; 
import MyCenter from '@/components/myCenter'; 

import ForgetPwd from '@/components/forgetPwd'; 
import RetrievePwdEmail from '@/components/retrievePwdEmail'; 

import PersonalHome from '@/components/personal/home'; 

import MyTask from '@/components/personal/myTask'; 
import TaskInfo from '@/components/personal/myTask/info'; 
import SetUp from '@/components/personal/myTask/setup'; 
import TaskList from '@/components/personal/myTask/list'; 

import Project from '@/components/personal/project'; 
import ProjectManage from '@/components/personal/project/projectManage'; 
import ProjectTask from '@/components/personal/project/projectTask'; 


import Transmit from '@/components/personal/transmit'; 
import Collect from '@/components/personal/collect'; 

import WorkBench from '@/components/personal/workbench'; 
import WorkBenchList from '@/components/personal/workbench/list'; 

import Friend from '@/components/personal/friend';


Vue.use(Router)

export default new Router( {
routes:[ {
path:'/', 
name:'Home', 
component:Home, 
},  {
path:'/login', 
name:'Login', 
component:Login
    },  {
path:'/register', 
name:'RegisterPage', 
component:RegisterPage
    },  {
path:'/wxRegister', 
name:'WxRegister', 
component:WxRegister
            },  {
path:'/myCenter', 
name:'MyCenter', 
component:MyCenter
         },  {
path:'/forgetPwd', 
name:'ForgetPwd', 
component:ForgetPwd
    },  {
path:'/retrievePwdEmail', 
name:'RetrievePwdEmail', 
component:RetrievePwdEmail
    },  {
path:'/personalHome', 
name:'PersonalHome', 
component:PersonalHome, 
children:[ {
path:'/myTask', 
name:'MyTask', 
component:MyTask

        },  {
path:'/transmit', 
name:'Transmit', 
component:Transmit, 
},  {
path:'/project', 
name:'Project', 
component:Project, 
children:[ {
path:'/project/projectManage', 
name:'ProjectManage', 
component:ProjectManage, 
},  {
path:'/project/projectTask', 
name:'ProjectTask', 
component:ProjectTask, 
}]
        },  {
path:'/collect', 
name:'Collect', 
component:Collect, 
}, {
    path: '/friend',
    name: 'Friend',
    component: Friend
}
]
    }, 

]
})
