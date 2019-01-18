import { timeDiff } from './api.js';
import {
    SHOW_NEWPREJECTPOP,
    ENTER_NEWPOP,


    // yun
    PROJECT_CHANGE,
    DETAILS_CHANGE,
    TASKTITLE_CHANGE,
    TASKITEM_CHANGE,
    TASKREMIND_CHANGE,
    TASKSTAR_CHANGE,
    TASK_LIST,
    TASK_POSITION,
    TASK_INDEX,
    TASKTIME_CHANGE,
    TASKDELCHANGE,

    // new_yun
    STAGEINFO_CHANGE,
    CHECKEDLIST_CHANGE,
    FILELENGTH_CHANGE,
    TASKIDS_CHANGE,
    POWER_CHANGE

} from './mutation-types';
import Vue from '../../node_modules/vue';


export default {

    [SHOW_NEWPREJECTPOP](state, newProjectPop) {
        state.newProjectPop = newProjectPop;
    },

    // yun
    // 展开收起详情页
    [DETAILS_CHANGE](state, flag) {
        state.details = flag;
    },

    // 改变当前选择的项目
    [PROJECT_CHANGE](state, item) {
        state.projectItem = item;
    },

    // 改变标题
    [TASKTITLE_CHANGE](state, val) {
        state.taskTitle = val;
        state.taskItem.title = val;

    },

    // 改变收藏标星
    [TASKSTAR_CHANGE](state, val) {
        state.taskStar = val;
        state.taskItem.isStar = val;

    },

    // 改变一键提醒
    [TASKREMIND_CHANGE](state, val) {
        state.taskRemind = val;
        state.taskItem.remind = val;

    },

    // 改变当前编辑的任务项
    [TASKITEM_CHANGE](state, item) {
        state.taskItem = item;
        state.taskTitle = item.title;
        state.taskStar = item.isStar;
        state.taskRemind = item.remind;
        state.taskTimeState = item.state;
        state.taskTimeDate = item.date;
        state.taskDelChange = false;

    },

    // 任务列表赋值
    [TASK_LIST](state, list) {
        state.taskList = list;
    },

    // 任务列表赋值
    [TASK_POSITION](state, id) {
        let _states = JSON.parse(JSON.stringify(state));
        for (let x = 0; x < _states.tasksList.length; x++) {
            let item = _states.tasksList[x];
            for (let y = 0; y < item.taskList.length; y++) {
                let _item = item.taskList[y];
                if (_item.pkid == id) {
                    let ele = $('.parths').eq(x).find('.every_list').eq(y);
                    ele[0].scrollIntoView({
                        behavior: "smooth"
                    });
                    ele.find('.task_title').eq(0).focus();
                    this.commit('TASKITEM_CHANGE', _item);
                    this.commit('TASK_INDEX', [x, y]);
                    return;
                }
            }
        }
    },


    // 当前选择任务的index
    [TASK_INDEX](state, index) {
        state.taskIndex = index;

    },


    // 改变时间
    [TASKTIME_CHANGE](state, obj) {

        if (obj) {
            let returnTime = timeDiff(obj);
            state.taskItem = { ...state.taskItem, returnTime };
            state.taskItem.state = returnTime.state;
            state.taskItem.date = returnTime.date;
            state.taskTimeState = returnTime.state;
            state.taskTimeDate = returnTime.date;
        } else {
            state.taskItem = { ...state.taskItem, returnTime }
            state.taskTimeState = '';
            state.taskTimeDate = '';
        }
        console.log(state.taskItem);
    },

    // 在任务详情中删除此任务，左侧任务列表的变化
    [TASKDELCHANGE](state) {
        state.taskDelChange = true;
    },

    // new_yun
    [STAGEINFO_CHANGE](state, info) {
        state.stageInfos = info;
    },
    [CHECKEDLIST_CHANGE](state, list) {
        state.checkedFileList = list;
    },
    [FILELENGTH_CHANGE](state, length) {
        state.fileLength = length;
    },
    [TASKIDS_CHANGE](state, ids) {
        state.taskIds = ids;
    },
    [POWER_CHANGE](state, power) {
        state.power = power;
        // state.power = 1;
    },

    




}