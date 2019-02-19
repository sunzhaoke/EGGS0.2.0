import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex); 

const state =  {
    newProjectPop:false, //点击新建项目弹框 
    blankProjectPop:false, //点击空白项目弹框 填写详细信息
    addPeoPlePop:false, //点击添加成员 人员添加列表弹框
    itemRecord:'', //项目记录

    // yun
    details: false, // 任务详情是否展开
    taskTitle: '', // 当前编辑的任务标题
    taskStar: false, // 当前编辑的任务的标星收藏状态
    taskRemind: false, // 当前编辑的任务的提醒状态
    taskItem: null, // 当前选中/编辑的任务
    taskList: [], // 任务列表
    taskIndex: [undefined, undefined], // 当前选择任务的下标
    taskTimeState: '', // 当前任务时间
    taskTimeDate: '', // 当前任务的时间
    taskDelChange: false, // 在任务详情中删除任务

    projectItem: null, // 当前选择的项目

    // new_yun
    stageInfos: {}, // 当前操作的任务-阶段的所有信息
    checkedFileList: [], // 已选文件的列表
    fileLength: 0, // 文件的总数
    taskIds: {}, // 当前操作的任务的ID集合
    power: 1, // 权限管理 0--未参加阶段任务 1--参加了阶段任务
    unreadNum: 0, // 未读通知数量
}



export default new Vuex.Store( {
    state, 
    getters, 
    actions, 
    mutations
}); 
