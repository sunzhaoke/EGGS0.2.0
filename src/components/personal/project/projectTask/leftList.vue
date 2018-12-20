<template>
  <div class="project_task_list fl"
       id="taskList">
    <div class="list_top">
      <button class="main_button_bg"
              @click="newTask()">新建任务</button>
      <button class="main_button"
              @click="createPartition">新建分区</button>
      <p class="task_del_none">{{this.taskDelChanges}}</p>

      <div class="filter fr">
        <i class="iconfont icon-shaixuan"
           @click="clickFilters"
           :class="filters ? 'selected_color' : ''"></i>
        <span class="line"></span>
        <ul class="fr">
          <li class="filter_type fl"
              v-for="(item, index) in filterTypes"
              :key="item.type">
            <span :class="selectedFilter === item.type ? 'selected_color filter_name' : 'filter_name'"
                  @click="filterClick(index)">{{item.label}}{{selectedFilter === item.type ? '('+filterNumbers+')' : null}}</span>
            <span v-if="index < filterTypes.length - 1 "
                  class="point"></span>

          </li>
        </ul>
        <task-filter v-if="filters"
                     :filtersObj="filtersObj"
                     @cancelFilters="cancelFilters" />
      </div>

    </div>

    <div class="center">
      <draggable v-if="!taskEmptyFlag"
                 v-model="tasksList"
                 :options="{group: 'parths', ghostClass: 'ghost_class_parths', dragClass: 'drag_class_parths'}"
                 :move="dragMove"
                 @start="dragStartParth($event, 'out')"
                 @end="dragEndParth($event, 'out')">
        <transition-group>
          <div class="parths"
               v-for="(item, index1) in tasksList"
               :key="item.pkid">
            <div class="every_box1"
                 v-if="item.pkid != 0"
                 @mouseenter="enterMouse(index1, undefined, $event)"
                 @mouseleave="leaveMouse(index1, undefined, $event)">
              <div class="parth_top"
                   :class="taskIndex && taskIndex[0] == index1 && taskIndex[1] == undefined ? 'selected_task' : ''">
                <template v-if="item.pkid != 'new'">
                  <i class="iconfont icon-Shapex"></i>
                  <i class="iconfont icon-unfold"
                     :class="item.extend ? '' : 'icon-unfold_rotate'"
                     @click="parthExtend(index1, item.extend)"></i>
                  <input class="input_title"
                         type="text"
                         placeholder="请输入分区标题"
                         v-model="item.groupName"
                         @focus="parthsFocus(item, index1)"
                         @blur="parthsBlur(item)"
                         @keyup.enter="parthsEnter(item)">
                  <el-dropdown class="parth_el_dropdown fr"
                               @click.native.stop="parthCommand()"
                               @visible-change="visibleChange">
                    <i class="iconfont icon-gengduo"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="share"
                                        @click.native="parthCommand(index1, item.taskList, 'share')"
                                        @mouseenter.native="otherMouseEnter">分享</el-dropdown-item>
                      <el-dropdown-item v-if="tasksList.length - 2"
                                        class="parth_el_dropdown_move"
                                        command="move"
                                        @click.native="parthCommand(index1, item.taskList, 'move')"
                                        @mouseenter.native="moveMouseEnter">
                        <span class="parth_el_dropdown_span">移动分区</span>
                        <i class="iconfont icon-enter"></i>
                        <ul v-if="moveParthShow"
                            class="move_parths"
                            :class="details ? 'move_parths1' : ''">
                          <draggable element="ul"
                                     v-model="parthsList"
                                     @end="dragEndParth"
                                     @start="dragStartParth">
                            <li v-for="ele in parthsList"
                                :key="ele.pkid">
                              <span>{{ele.groupName}}</span>
                              <i class="iconfont icon-Shapex"></i>
                            </li>
                          </draggable>

                        </ul>

                      </el-dropdown-item>
                      <el-dropdown-item command="delete"
                                        @click.native="parthCommand(index1, item.taskList, 'delete')"
                                        @mouseenter.native="otherMouseEnter">删除分区</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template v-if="item.pkid == 'new'">
                  <input class="input_title created_input"
                         id="createdParth"
                         type="text"
                         autofocus
                         v-model="item.groupName"
                         @blur="createdTaskBlur"
                         @keyup.enter="createdParth(index1, item.groupName)"
                         placeholder="请输入分区标题">
                  <button class="main_button_bg created_but fr"
                          @click.stop="createdParth(index1, item.groupName)">创建</button>
                  <button class="main_button_ created_but fr"
                          @click.stop="cancelCreatedParth(index1)">取消</button>
                </template>
              </div>
            </div>

            <draggable v-model="item.taskList"
                       :options="{group: 'task', ghostClass: 'ghost_class', dragClass: 'drag_class'}"
                       :move="dragMove"
                       @start="dragStart"
                       @end="dragEnd"
                       class="draggable"
                       :class="item.taskList.length ? '' : 'draggable_empty'"
                       :index="index1">
              <transition-group>
                <div class="every_box2"
                     v-for="(task, index2) in item.taskList"
                     :key="task.pkid"
                     @mouseenter="enterMouse(index1, index2, $event)"
                     @mouseleave="leaveMouse(index1, index2, $event)">
                  <div class="every_list"
                       :class="taskIndex && taskIndex[0] == index1 && taskIndex[1] == index2 ? 'selected_task' : ''"
                       @click="enterDetails(index1, index2, task, $event)">
                    <template v-if="task.pkid != 'new'">
                      <i class="iconfont icon-Shapex"></i>
                      <img class="task_created_header header"
                           :src="task.Images"
                           alt="">
                      <input class="task_title"
                             type="text"
                             v-model="task.title"
                             @input="editTitle"
                             @focus="taskFocus(index1, index2, task)"
                             @blur="taskBlur(task)"
                             @keyup.enter="taskEnter">
                      <i v-if="task.isStar"
                         class="iconfont icon-star"
                         @click="changeStar(task)"></i>
                      <i v-else
                         class="iconfont icon-shoucang"
                         @click="changeStar(task)"></i>
                      <div class="operate fr">
                        <i v-if="task.pre"
                           class="iconfont icon-qianzhirenwu"></i>
                        <el-tooltip class="item"
                                    effect="dark"
                                    :content="task.remind ? '提醒未读人员' : '已发送过提醒'"
                                    placement="top">
                          <i v-if="task.unreadNum"
                             class="iconfont icon-tongzhi1"
                             :class="task.remind ? 'unread' : 'unread_dis'"
                             @click="unread(task)"></i>
                        </el-tooltip>
                        <button v-if="task.state === 1"
                                class="task_state task_state1">已完成</button>
                        <button v-else-if="task.state === 2"
                                class="task_state task_state2">{{task.date}}</button>
                        <button v-else-if="task.state === 3"
                                class="task_state task_state3">{{task.date}}</button>
                        <button v-else-if="task.state === 4"
                                class="task_state task_state4">{{task.date}}</button>
                        <button v-else
                                class="task_state"></button>
                        <el-dropdown class="task_el_dropdown"
                                     trigger="hover"
                                     @click.native.stop="taskCommand()">
                          <i class="iconfont icon-gengduo"></i>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="preTask"
                                              @click.native="taskCommand([index1, index2], task, 'preTask')">{{task.pre ? '取消前置任务' : '设置前置任务'}}</el-dropdown-item>
                            <el-dropdown-item command="share"
                                              @click.native="taskCommand([index1, index2], task, 'share')">分享</el-dropdown-item>
                            <el-dropdown-item command="delete"
                                              @click.native="taskCommand([index1, index2], task, 'delete')">删除任务</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </template>
                    <template v-else>
                      <div class="every_list created"
                           id="createdTaskBox">
                        <i class="iconfont icon-Shapex"></i>
                        <img class="task_created_header header"
                             :src="loginUser.pic"
                             alt="">
                        <input id="createdTitle"
                               class="task_title"
                               type="text"
                               autofocus
                               v-model="createTaskTitles"
                               @blur="createdTaskBlur"
                               @keyup.enter="createdTaskEnter(index1, index2, $event)">
                        <button class="main_button_bg created_but fr"
                                @click.stop="createdTask(index1, index2)">创建</button>
                        <button class="main_button_ created_but fr"
                                @click.stop="cancelCreatedTask(index1, index2)">取消</button>
                      </div>
                    </template>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
        </transition-group>
      </draggable>

      <div v-else
           class="task_empty">
        <img src="../../../../assets/img/task_empty.png"
             alt="">
        <p>千里之行，始于足下</p>
        <p>
          <span class="mainColor_text"
                @click="newTask()">新建任务</span>
          或者
          <span class="mainColor_text"
                @click="createPartition">新建分区</span>
          ，推动项目迈出第一步
        </p>
      </div>

      <!-- 消息提醒====删除任务 -->
      <transition name="fade1">
        <Reminder2 v-if="reminder2Flag"
                   :type="1"
                   :text="reminderText"
                   @handleCancle="reminderCancel"
                   @handleSure="reminderSure" />
      </transition>

      <!-- 消息提醒====删除分区 -->
      <transition name="fade1">
        <Reminder2 v-if="reminder2ParthFlag"
                   :type="1"
                   :text="reminderText"
                   :selectList="selectList"
                   @handleCancle="reminderCancelParth"
                   @handleSure="reminderSureParth" />
      </transition>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import Reminder2 from "../../../common/reminder2";
import TaskFilter from "../../common/taskFilter";
import { task, task1 } from './data.js';
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    draggable,
    Reminder2,
    TaskFilter
  },

  data() {
    return {
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      loginUser: JSON.parse(localStorage.getItem('staffInfo')), // 当前登录者的信息
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      filterTypes: [
        { type: 0, label: "已超时" },
        { type: 1, label: "未完成" },
        { type: 2, label: "已完成" },
        { type: 3, label: "全部" }
      ], // 过滤列表
      selectedFilter: 3, // 当前选择的过滤类型
      filterNumbers: 123, // 筛选粗来的个数
      tasksList: [],
      filters: false, // 高级筛选
      filtersObj: {
        startTime: '',
        endTime: '',
        state: 3,
        selectedCreated: '',
        selectedAdd: '',
      },

      createTaskTitles: '', // 新建任务的标题
      taskMore: [], // 任务的更多操作
      reminderText: '', // 温馨提示的内容
      reminder2Flag: false, // 任务删除是的提示标识
      reminder2ParthFlag: false,  // 分区删除是的提示标识
      taskCommandItem: null, // 要删除的任务的详情
      parthCommandItem: null, // 当前操作的分区
      insertIndex: [0, 0], // 插入任务的index
      moveStartInedx: [0, 0], // 任务移动前的位置
      moveEndInedx: [0, 0], // 任务移动后的位置
      nowIndex: [0, undefined], // 当前点击分区/任务的两层ID
      parthsList: [], // 分区列表
      moveParthShow: false, // 是否显示移动分区列表
      dragFlag: false, // 现在是否处于拖拽状态
      selectList: [], // 选择分区的分区列表
      taskTitle: '', // 当前正在编辑的任务标题
      blurTime: '', // 失去焦点时的时间
      createTime: '', // 创建任务/分区时的时间
      taskEmptyFlag: false, // 项目任务列表是否为空
      nowDragItem: null, // 当前正在移动的分区/任务
      parthMoveId: 1, // 移动分区的ID
      checkGropIndex: 0,
      checkTaskIndex: 0,
    };
  },
  computed: {
    ...mapState(['details', 'taskItem', 'taskIndex', 'taskDelChange']),
    taskDelChanges: {
      get() {
        if (this.taskDelChange) {
          let id = this.taskItem.pkid;
          for (let x of this.tasksList) {
            for (let i in x.taskList) {
              if (x.taskList[i].pkid == id) {
                x.taskList.splice(i, 1);
                return;
              }
            }
          }
          // this.tasksList[this.taskIndex[0]].taskList.splice(this.taskIndex[1], 1);
        }
        return this.taskDelChange
      },
      set(val) {

      }
    }
  },
  watch: {
    nowIndex: {
      deep: true,
      handler(val) {
        this.TASK_INDEX(val);
      }
    },
    tasksList: {
      deep: true,
      handler(val) {
        if (val.length === 1 && val[0].pkid === 0 && val[0].taskList.length === 0) {
          this.taskEmptyFlag = true;
        } else {
          this.taskEmptyFlag = false;
        }
      },
    },
    taskItem(val, old) {
      if (val) {

        this.tasksList[this.checkGropIndex].taskList.splice(this.checkTaskIndex, 1, val)
      }
    }
  },
  methods: {
    ...mapMutations([
      'TASKTITLE_CHANGE',
      'TASKSTAR_CHANGE',
      'TASKREMIND_CHANGE',
      'TASKITEM_CHANGE',
      'TASK_LIST',
      'TASK_INDEX'
    ]),

    // 点击新建任务
    newTask(index) {
      // 首先判断现在是否有正在创建的任务
      // let finds = this.findCreated();
      let finds = $('#createdTaskBox').length;

      if (finds) {
        this.$message({
          center: true,
          message: '尚有未创建完成的任务！',
          type: 'warning'
        });
        $('#createdTitle').focus();
        // this.$message.warning('尚有未创建完成的任务！');
        return;
      }


      let obj = {
        pkid: "new",
        title: "",
        isStar: false,
        pre: false,
        remind: false,
        state: -1,
        unreadNum: 0,
        taskPeopleNum: 0
      }

      this.createTime = (new Date()).getTime();
      let x = this.createTime - this.blurTime;
      if (x < 1000) { // 是否是刚失焦
        index = [...this.nowIndex];
        let extend = this.tasksList[index[0]].extend;
        let length = this.tasksList[index[0]].taskList.length;
        if (!extend) { // 分区是否展开
          this.tasksList[index[0]].extend = true;
          this.tasksList = this.tasksList.concat();
          $('.draggable').eq(index[0]).slideDown(400);
          if (length) { // 分区内是否有任务
            index[1] = length - 1;
            this.nowIndex = index.concat();

          }
        }
      }
      if (index) { // 插入新建
        if (index[1] == undefined) {
          this.tasksList[index[0]].taskList.unshift(obj);
        } else {
          this.tasksList[index[0]].taskList.splice(index[1] + 1, 0, obj);
        }

      } else { // 直接新建
        this.tasksList[0].taskList.push(obj);

      }
      this.$nextTick(() => {
        $('#createdTitle').focus();
      });


    },

    // 新建任务的创建失焦
    createdTaskBlur(e) {

      if (this.createTaskTitles) {

      } else {
        // this.$message.warning('请输入任务标题');
        // $('#createdTitle').focus();
      }

    },
    // 新建任务点击创建完成任务创建
    createdTask(index1, index2) {
      return new Promise((resolve, reject) => {
        if (this.createTaskTitles == '') {
          this.$message.warning('请输入任务标题');
          $('#createdTitle').focus();
          resolve(false);
          return;
        }

        // 发送请求
        let obj = {
          myUserId: this.userPkid,
          projectId: this.projectItem.projectid,
          partitionId: this.tasksList[index1].pkid,
          title: this.createTaskTitles,
          iSort: index2
        }
        this.$HTTP('post', '/task_add', obj).then(res => {
          let returns = res.result;
          returns.pre = false;
          returns.remind = true;
          this.tasksList[index1].taskList.splice(index2, 1, returns);
          this.TASKITEM_CHANGE(returns);
          this.$emit("handleDetails", 1, returns.pkid);
          this.createTaskTitles = "";
          resolve(true);

        }).catch(err => {
          console.log('添加任务失败', err);
          this.$message.error('添加任务失败，请检查网络');
          resolve(false);

        });
      });


    },

    // 创建任务enter后先提交后再创建一个任务
    async createdTaskEnter(index1, index2, e) {
      let returns = await this.createdTask(index1, index2);
      if (returns) {
        $('#createdTaskBox').remove();
        $(e.target).blur();
        this.$nextTick(() => {
          this.newTask([index1, index2])
        });

      }

    },

    // 取消创建任务
    cancelCreatedTask(index1, index2) {
      let finds = this.findCreated();
      this.tasksList[index1].taskList.splice(index2, 1);
      this.$emit("handleDetails", 0);
      this.createTaskTitles = "";
    },

    // 检查现在是否有正在创建的任务
    findCreated() {
      let finds = this.tasksList.findIndex(ele => {
        return ele.pkid && ele.pkid == 'new';
      });
      return finds;
    },

    // 点击新建分区
    createPartition() {
      let finds = $('#createdParth').length;
      if (finds) {
        this.$message({
          center: true,
          message: '尚有未创建完成的分区！',
          type: 'warning'
        });
        $('#createdParth').focus();
        return;
      }
      let obj = {
        pkid: "new",
        groupName: "",
        extend: true,
        taskList: []
      }
      this.createTime = (new Date()).getTime();
      let x = this.createTime - this.blurTime;
      let i = this.nowIndex;
      if (x < 1000) {
        this.tasksList.splice(i[0] + 1, 0, obj);
      } else {
        this.tasksList.push(obj);
      }
      this.$nextTick(() => {
        $('#createdParth').focus();
      });
    },

    // 点击新建分区--确定创建
    createdParth(index, title) {
      let id = '#createdParth' + index;
      if (title == '') {
        this.$message.warning('请输入任务标题');
        $(id).focus();
        return;
      }

      let obj = {
        myUserId: this.userPkid,
        projectId: this.projectItem.projectid,
        title: title
      }
      this.$HTTP('post', '/partition_add', obj).then(res => {
        console.log('添加分区', res);
        this.tasksList[index].pkid = index + 1;
        this.tasksList[index].groupName = title;
      }).catch(err => {
        console.log('添加分区失败', err);
        this.$message.error('添加分区失败，请检查网络');

      });
    },

    // 点击新建分区--取消创建
    cancelCreatedParth(index) {
      this.tasksList.splice(index, 1);

    },


    // 点击过滤
    filterClick(index) {
      this.selectedFilter = index;
      this.filtersObj.state = index;
    },

    // 鼠标移入
    enterMouse(index1, index2, e) {
      this.$nextTick(() => {
        if (e) {
          let x = $(e.target).siblings('.draggable_empty').eq(0);
          if (x.length) {
            x.css('zIndex', 0);
          }
        }
      });


      let finds = $('#createdTaskBox').length;
      if (finds) {
        $('#createdTitle').focus();
        return;
      }
      if (this.dragFlag) { return }
      if ($('#addTask').length) { $('#addTask').remove(); }

      let html = '<div class="task_add_box" id="addTask"><div class="task_add_circle"><i class="iconfont icon-jia1"></i></div></div>';

      if (index2 == undefined) {
        this.insertIndex = [index1, undefined];
        $('.parths').eq(index1).find('.every_box1').eq(0).append(html);

      } else {
        this.insertIndex = [index1, index2]
        $('.parths').eq(index1).find('.every_box2').eq(index2).append(html);

      }

    },

    // 鼠标离开
    leaveMouse(index1, index2, e) {
      this.$nextTick(() => {
        if (e) {
          let x = $(e.target).siblings('.draggable_empty').eq(0);
          if (x.length) {
            x.css('zIndex', 4);
          }
        }

      });
      $('#addTask').remove();
    },

    // 拖拽过程中遇到目标区域
    dragMove(e) {
      $('#addTask').remove();
      this.dragFlag = true;

      // console.log(e.target);

    },

    // 开始拖拽
    dragStart(e) {
      let parthIndex = $(e.to).parent().attr('index');
      let taskIndex = e.oldIndex;
      this.nowDragItem = this.tasksList[parthIndex].taskList[taskIndex];
      console.log('from---', $(e.from).parent().attr('index'), e.oldIndex, this.nowDragItem);

      ;    },


    // 拖拽结束
    dragEnd(e) {
      console.log('to---', $(e.to).parent().attr('index'), e.newIndex);
      let parthIndex = $(e.to).parent().attr('index');
      let parthId = this.tasksList[parthIndex].pkid;

      this.dragFlag = false;
      if (this.taskItem) {
        this.judgeIndex(this.tasksList, this.taskItem);
      }
      let obj = {
        taskId: this.nowDragItem.pkid,
        partitionId: parthId,
        isSort: e.newIndex
      }
      this.$HTTP('post', '/task_group_update_isSort', obj).then(res => {
        console.log('移动任务成功', res);

      }).catch(err => {
        console.log('移动任务失败', err);
        this.$message.error('移动任务失败，请检查网络');

      });

    },

    // 判断当前选择的任务index是否有变化
    judgeIndex(list, obj) {
      for (let x = 0; x < list.length; x++) {
        let item = list[x];
        for (let y = 0; y < item.taskList.length; y++) {
          let _item = item.taskList[y];
          if (_item.pkid == obj.pkid) {
            this.nowIndex = [x, y];
            return;
          }
        }
      }
    },


    // 点击进入详情
    enterDetails(index1, index2, task, e) {
      this.checkGropIndex = index1;
      this.checkTaskIndex = index2;
      this.nowIndex = [index1, index2];
      this.$emit("handleDetails", 1, task.pkid);
      this.TASKITEM_CHANGE(task);
      $('.parths').eq(index1).find('.task_title').eq(index2).focus();
    },

    // 编辑任务标题
    editTitle(e) {
      let val = e.target.value;
      this.TASKTITLE_CHANGE(val);

    },

    // 改变任务标星收藏状态
    changeStar(task) {
      task.isStar = !task.isStar;
      this.TASKSTAR_CHANGE(task.isStar);

      // 发送请求
      // 修改标星 发送请求
      let obj = {
        taskId: task.pkid
      }
      this.$HTTP('post', '/task_update_isStar', obj).then(res => {
        console.log('修改标星收藏', res);
      }).catch(err => {
        console.log('修改标星收藏失败', err);
        this.$message.error('修改收藏失败，请检查网络');

      });
    },

    // 点击未读铃铛
    unread(task) {
      task.remind = false;
      this.TASKREMIND_CHANGE(task.remind);
    },
    // 点击高级筛选漏斗
    clickFilters() {
      this.filters = true;
      this.$nextTick(() => {
        $("#taskFilter").animate({ height: "200px", padding: '10px 24px' });
      });



    },

    // 鼠标移入移动分区
    moveMouseEnter() {
      this.moveParthShow = true;
      this.parthsList = [];
      for (let x of this.tasksList) {
        (x.pkid != 0) && this.parthsList.push(x);
      }
    },

    // 鼠标移入除移动分区
    otherMouseEnter() {
      this.moveParthShow = false;
    },

    // 移动分区开始
    dragStartParth(e, flag) {
      let _ = this;
      $('.draggable').each(function () {
        let index = Number($(this).attr('index'));
        if (index > 0) {
          _.tasksList[index].extend = false;
          $(this).slideUp(100);
        }
      });
      if (flag) {
        this.parthMoveId = this.tasksList[e.oldIndex].pkid;
      } else {
        this.parthMoveId = this.tasksList[e.oldIndex + 1].pkid;

      }
      console.log('from---', e.oldIndex);

    },

    // 移动分区结束
    dragEndParth(e, flag) {
      console.log('parth---to---', e.newIndex);

      this.dragFlag = false;
      let obj = {
        partitionId: this.parthMoveId,
        isSort: flag ? e.newIndex - 1 : e.newIndex
      }
      this.$HTTP('post', '/partition_update_isSort', obj).then(res => {
        console.log('移动分区成功', res);

        if (flag) { // 直接在外面移动
          return;
        } else { // 在更多操作中移动
          this.tasksList = this.tasksList.splice(0, 1);
          this.tasksList = this.tasksList.concat(this.parthsList);

        }

      }).catch(err => {
        console.log('移动分区失败', err);
        this.$message.error('移动分区失败，请检查网络');

      });

    },

    // 展开折叠分区
    parthExtend(index, flag) {
      this.tasksList[index].extend = !this.tasksList[index].extend;
      this.tasksList = this.tasksList.concat();
      $('.draggable').eq(index).slideToggle(400);
    },

    // 分区获取焦点
    parthsFocus(item, index1) {
      item.groupNameCopy = item.groupName;
      this.nowIndex[0] = index1;
      this.nowIndex[1] = undefined;
      this.nowIndex = this.nowIndex.concat();

    },

    // 分区失焦
    parthsBlur(item) {
      this.blurTime = (new Date()).getTime();
      if (item.groupNameCopy != item.groupName) {
        // 修改标题 发送请求
        let obj = {
          partitionId: item.pkid,
          title: item.groupName
        }
        this.$HTTP('post', '/partition_update', obj).then(res => {
          console.log('修改分区标题', res);
        }).catch(err => {
          console.log('修改分区标题失败', err);
          this.$message.error('修改分区标题失败，请检查网络');

        });
      }

    },

    // enter创建任务
    parthsEnter(item) {
      this.nowIndex[1] = -1;
      this.newTask(this.nowIndex);

    },

    // 任务获取焦点
    taskFocus(index1, index2, task) {
      task.titleCopy = task.title;
    },

    // 任务失焦
    taskBlur(task) {
      this.blurTime = (new Date()).getTime();
      if (task.titleCopy !== task.title) {
        // 修改标题 发送请求
        let obj = {
          taskId: task.pkid,
          title: task.title
        }
        this.$HTTP('post', '/task_update_title', obj).then(res => {
          console.log('修改任务标题', res);
        }).catch(err => {
          console.log('修改任务标题失败', err);
          this.$message.error('修改任务标题失败，请检查网络');

        });
      }

    },

    // enter 新建任务
    taskEnter(e) {
      $(e.target).blur();
      this.newTask(this.nowIndex);
    },

    // 分区更多操作下拉框出现/隐藏时触发
    visibleChange(val) {
      this.moveParthShow = false;
    },

    // 分区的更多操作
    parthCommand(index, item, command) {
      if (!command) return;
      this.parthCommandItem = {
        index,
      }
      if (command === 'share') { // 分享
        console.log('分享');
      } else if (command === 'move') { // 移动分区
        console.log('移动分区');
      } else if (command === 'delete') { // 删除
        console.log('删除');
        this.reminder2ParthFlag = true;
        this.selectList = [];
        if (item.length) {
          this.reminderText = "该分区已有任务，在删除该分区前，请选择将任务移动到其他分区";
          for (let x of this.tasksList) {
            this.selectList.push({
              value: x.pkid,
              label: x.groupName,
              disabled: false
            });
          }
          this.selectList[index].disabled = true;
        } else {
          this.reminderText = "您是否确认删除该分区？删除后不可恢复";
        }
      }

    },


    // 分区删除的提示----确认删除
    reminderSureParth(val) {
      let index = this.parthCommandItem.index;
      let list = [...this.tasksList];
      let obj = {};
      // 发送请求删除分区

      if (val.toString()) {
        val = Number(val);
        let arr = [];
        for (let x of list[index].taskList) {
          arr.push(x.pkid);
        }
        obj = {
          vals: arr,
          type: val
        };
        this.$HTTP('post', '/partition_updateType', obj).then(res => {
          console.log('分区 批量移动', res);
        }).catch(err => {
          console.log('分区 批量移动失败', err);
          this.$message.error('批量移动失败，请检查网络');

        });
      }

      obj = {
        partitionId: this.tasksList[index].pkid
      };
      this.$HTTP('post', '/partition_delete', obj).then(res => {
        console.log('分区删除', res);
        if (val.toString()) {
          val = Number(val);
          list[val].taskList = list[val].taskList.concat(list[index].taskList);
        }
        list.splice(index, 1);
        this.tasksList = [...list];
        this.reminder2ParthFlag = false;

      }).catch(err => {
        console.log('分区删除失败', err);
        this.$message.error('分区删除失败，请检查网络');

      });

    },

    // 分区删除的提示----取消删除
    reminderCancelParth() {
      this.reminder2ParthFlag = false;
    },


    // 任务的更多操作
    taskCommand(index, item, command) {
      if (!command) return;
      if (command === 'preTask') { // 设置前置任务
        console.log('设置前置任务');
        item.pre = !item.pre;


      } else if (command === 'share') { // 分享
        console.log('分享');

      } else if (command === 'delete') { // 删除
        console.log('删除');
        this.reminder2Flag = true;
        this.reminderText = "您是否确认删除该任务？删除后不可恢复";
        this.taskCommandItem = {
          index,
          item
        }

      }
    },

    // 任务删除的提示----确认删除
    reminderSure() {
      console.log(this.taskCommandItem);
      let index = this.taskCommandItem.index;
      // 发送请求删除这项任务
      let obj = {
        taskId: this.taskCommandItem.item.pkid
      }
      this.$HTTP('post', '/task_del', obj).then(res => {
        this.reminder2Flag = false;
        this.tasksList[index[0]].taskList.splice(index[1], 1);
        console.log(this.taskItem.pkid, this.taskCommandItem.item.pkid);
        if (this.taskItem.pkid == this.taskCommandItem.item.pkid) {
          this.$emit('handleDetails', 0);
        }
        console.log('删除任务', res);
        this.$message.success('删除任务成功');
      }).catch(err => {
        console.log('删除任务失败', err);
        this.$message.error('删除任务失败，请检查网络');
      });

    },

    // 任务删除的提示----取消删除
    reminderCancel() {
      this.reminder2Flag = false;
    },

    // 关闭高级筛选漏斗
    cancelFilters(obj) {
      let returns = this.cmp(this.filtersObj, obj);

      if (returns) {
        console.log('yes---相同 不需要重新发送请求');
      } else {
        //发送异步请求
        console.log('no---不同 需要重新发送请求');
        this.filtersObj = Object.assign({}, obj);
        this.selectedFilter = obj.state;
      }

      $("#taskFilter").animate({ height: "0", padding: '0 24px' }, () => {
        this.filters = false;

      });

    },
    cmp(x, y) {
      let xx = JSON.stringify(x).toString();
      let yy = JSON.stringify(y).toString();
      if (xx === yy) {
        return true;
      } else {
        return false;
      }
    },

    // 获取任务列表
    getTaskList() {
      this.TASK_LIST(this.tasksList);
      let obj = {
        projectId: this.projectItem.projectid,
      }
      this.$HTTP('post', '/task_getList', obj, $('#app')[0]).then(res => {
        this.tasksList = [...res.result];
        for (let y of this.tasksList) {
          y.extend = true;
          for (let x of y.taskList) {
            let returnTime = this.timeDiff(x.endTime);
            x = Object.assign(x, returnTime);
            if (x.pkid % 2 === 0) {
              x.finish = true;
              x.pre = true;
              x.remind = true;
              // x.isStar = true;
            } else {
              x.finish = false;
              x.pre = false;
              x.remind = false;
            }
          }
        }

        console.log('获取任务列表', this.tasksList);
      }).catch(err => {
        console.log('获取任务列表失败', err);
        this.$message.error('获取任务列表失败，请检查网络');
      });
    },


  },
  created() {
    this.getTaskList(); // 获取任务列表

  },
  mounted() {
    let _ = this;
    $('#taskList').on('click', '#addTask', (e) => {
      // e.stopPropagation();
      let x = _.insertIndex;
      let extend = _.tasksList[x[0]].extend;
      let length = _.tasksList[x[0]].taskList.length;
      if (!extend) { // 分区是否展开
        _.tasksList[x[0]].extend = true;
        _.tasksList = _.tasksList.concat();
        $('.draggable').eq(x[0]).slideDown(400);
        if (length) { // 分区内是否有任务
          x[1] = length - 1;
          _.insertIndex = x.concat();

        }
      }
      _.newTask(_.insertIndex);
      _.leaveMouse();

    });
  }
};
</script>

<style lang="less">
@import "../../../../assets/css/base.less";
.project_task_list {
  overflow: hidden;
  width: 100%;
  height: calc(~"100vh - 50px - 51px");

  //  @media screen and (max-width: 1366px) {
  //   width: calc(~ '100% - 600px');

  // }
  //  @media screen and (min-width: 1367px) {
  //   width: calc(~ '100% - 780px');

  // }

  .list_top {
    height: 53px;
    line-height: 54px;
    border-bottom: 1px solid @bg-f2f2f2;
    padding: 0 24px;
    .box_sizing;

    .main_button {
      margin-left: 10px;
    }
    button {
      vertical-align: initial;
    }
    .selected_color {
      color: @mainColor;
    }

    .filter {
      color: @graySix;
      height: 54px;
      position: relative;
      .icon-shaixuan {
        vertical-align: middle;
        font-size: 18px;
        &:hover {
          color: @mainHover;
        }
      }
      .line {
        .dis-in-bl;
        width: 1px;
        height: 20px;
        background: @bg-f2f2f2;
        margin: 0 10px;
        vertical-align: middle;
      }
      ul {
        li {
          .cur;

          .point {
            .dis-in-bl;
            width: 4px;
            height: 4px;
            .border_radius(@br: 50%;);
            background: #d0d0d0;
            margin: 0 7px;
            vertical-align: middle;
          }
        }
      }
    }

    .task_del_none {
      display: inline-block;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  }

  .center {
    width: 100%;
    height: calc(~"100vh - 50px - 51px - 54px - 50px");
    padding-bottom: 20px;
    overflow-y: auto;

    .parths {
      width: 100%;
      position: relative;
      .iconfont {
        color: @graySix;
        &:hover {
          // color: @mainColor;
        }
      }

      .parth_top {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid @bg-f2f2f2;
        .box_sizing;
        .icon-Shapex {
          .dis-in-bl;
          visibility: hidden;
          width: 24px;
          text-align: center;
        }

        .input_title {
          width: 80%;
          .word_over;
          font-size: 16px;
          font-weight: bold;
        }

        .icon-unfold {
          .dis-in-bl;
          -webkit-transition: transform 0.25s linear;
          -moz-transition: transform 0.25s linear;
          -o-transition: transform 0.25s linear;
          transition: transform 0.25s linear;
        }
        .icon-unfold_rotate {
          transform: rotate(-180deg);
          -webkit-transition: transform 0.25s linear;
          -moz-transition: transform 0.25s linear;
          -o-transition: transform 0.25s linear;
          transition: transform 0.25s linear;
        }

        .parth_el_dropdown {
          width: 20px;
          height: 20px;
          margin-right: 24px;
        }
        .icon-gengduo {
          visibility: hidden;
        }

        .created_input {
          margin-left: 50px;
          width: calc(~"100% - 220px") !important;
        }

        .created_but {
          margin-right: 24px;
          margin: 5px 24px 5px 0;
        }
        .main_button_ {
          .main_button_unfixed(@grayNight, #fff, #fff);
          margin-right: 0;
        }

        &:hover {
          background: #fbfbfb;
          .icon-Shapex,
          .icon-gengduo {
            visibility: visible;
          }
          .main_button_ {
            .main_button_unfixed(@grayNight, #fbfbfb, #fbfbfb);
          }
        }
      }

      .draggable_empty {
        height: 10px;
        margin-top: -12px;
        position: absolute;
        width: 100%;
        z-index: 4;
      }
      .draggable_empty > span {
        .dis-in-bl;
        width: 100%;
        height: 2px;
      }
      .every_list {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid @bg-f2f2f2;
        .box_sizing;
        .icon-Shapex {
          .dis-in-bl;
          visibility: hidden;
          width: 44px;
          text-align: center;
        }

        .task_created_header {
          .dis-in-bl;
          width: 20px;
          height: 20px;
          .border_radius(@br: 2px;);
          vertical-align: middle;
        }

        .icon-star {
          color: @starColor;
          padding: 0 10px;
        }

        .icon-shoucang {
          visibility: hidden;
          padding: 0 10px;
        }

        .task_title {
          width: calc(~"100% - 350px");
          .word_over;
        }

        .operate {
          height: 40px;
          line-height: 40px;
          .iconfont {
            margin: 0 7px;
          }
          .icon-qianzhirenwu {
            color: @mainColor;
          }

          .unread {
            color: @mainColor;
          }
          .unread_dis {
            color: @grayNight;
          }
          .task_state {
            font-size: 12px;
            padding: 0 !important;
            width: 90px;
            text-align: center;
            margin: 0 7px;
            .word_over;
            vertical-align: baseline !important;
          }
          .task_state1 {
            .main_button_unfixed(#169a19, #ECFFED, #ECFFED);
          }
          .task_state2 {
            .main_button_unfixed(#EA3F33, #F7F7F7, #F7F7F7);
          }
          .task_state3 {
            .main_button_unfixed(#EA3F33, #FFE8E6, #FFE8E6);
          }
          .task_state4 {
            .main_button_unfixed(#999999, #F7F7F7, #F7F7F7);
          }

          .icon-gengduo {
            visibility: hidden;
            // padding-right: 24px;
            margin-right: 0;
          }

          .task_el_dropdown {
            width: 20px;
            height: 20px;
            margin-right: 24px;
          }
        }

        .created_but {
          margin-right: 24px;
          margin: 5px 24px 5px 0;
        }
        .main_button_ {
          .main_button_unfixed(@grayNight, #fff, #fff);
          margin-right: 0;
        }
        &:hover {
          background: #fbfbfb;
          .icon-Shapex,
          .icon-shoucang,
          .icon-gengduo {
            visibility: visible;
          }
          .main_button_ {
            .main_button_unfixed(@grayNight, #fbfbfb, #fbfbfb);
          }
        }
      }
      .selected_task {
        background: #fbfbfb;
        border-bottom: 1px solid @mainColor;
      }

      .every_list .created {
        .task_title {
          width: calc(~"100% - 250px");
        }
      }

      .every_box1,
      .every_box2 {
        position: relative;
        // background: #fff;
      }

      .task_add_box {
        // display: none;
        position: absolute;
        width: 100px;
        height: 14px;
        overflow: hidden;
        line-height: 20px;
        left: 50%;
        margin-left: -50px;
        top: 40px;

        z-index: 2;
        .task_add_circle {
          position: absolute;
          width: 32px;
          height: 26px;
          .border_radius(@br: 50%;);
          left: 50%;
          margin-left: -16px;
          bottom: 0;
          background: #fbfbfb;
          border: 1px solid @bg-f2f2f2;
          .box_sizing;
          text-align: center;
        }
        .cur;
        .iconfont {
          font-size: 12px;
          font-weight: bold;
          color: @grayNight;
          .dis-in-bl;
          margin-top: 7px;
        }
        &:hover {
          .task_add_circle {
            background: @mainColor;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
    }

    .ghost_class {
      .every_list {
        border-top: 1px solid @mainColor;
        height: 1px;
        overflow: hidden;
      }
    }

    .drag_class {
      .task_add_box {
        display: none;
      }
    }
    .ghost_class_parths {
      .parth_top {
        border-top: 1px solid @mainColor;
        height: 1px;
        overflow: hidden;
      }
    }
    .drag_class_parths {
      .draggable {
        display: none;
      }
      .task_add_box {
        display: none;
      }
    }

    .task_empty {
      text-align: center;
      margin: 0 auto;
      img {
        margin: 50px 0;
      }
      p {
        line-height: 24px;
      }
    }
  }
}
</style>


