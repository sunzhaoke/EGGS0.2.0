<template>
  <div class="project_task">
    <div class="project_task_top">
      <el-select v-model="selectedProject"
                 placeholder="请选择">
        <el-option v-for="item in projectList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   @change="projectChange">
        </el-option>
      </el-select>
      <i class="iconfont project_star"
         :class="starFlag ? 'icon-star' : 'icon-shoucang'"></i>
      <i class="iconfont icon-shuxingliebiaoxiangqing"
         @click="itemInformationShow=true"></i>
      <i class="iconfont icon-rili fr"></i>
      <div class="project_search fr">
        <el-input placeholder="请输入搜索的任务标题"
                  clearable
                  prefix-icon="el-icon-search"
                  size="small"
                  v-model="searchValue"
                  @input="searchChange">
        </el-input>
        <i class="iconfont icon-19daoru"></i>
        <i class="iconfont icon-haoyou"></i>
        <i class="iconfont icon-gengduo"></i>
        <el-collapse-transition>
          <div v-if="searchLists && searchLists.length"
               class="search_list">
            <ul class="search_list_ul">
              <li class="search_list_li"
                  v-for="(item, index) in searchLists"
                  :key="index"
                  @click="goTo(item)">
                <img :src="item.Images"
                     alt=""
                     class="header">
                <span class="title">{{item.titles}}</span>
                <i class="iconfont icon-star"></i>
                <button v-if="item.state === 1"
                        class="task_state task_state1">已完成</button>
                <button v-else-if="item.state === 2"
                        class="task_state task_state2">今日截止</button>
                <button v-else-if="item.state === 3"
                        class="task_state task_state3">已超时99+天</button>
                <button v-else
                        class="task_state task_state4">11月12日截止</button>
                <span v-if="item.fromParth"
                      class="from_parth">{{item.fromParth}}</span>
              </li>
            </ul>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <div class="project_task_list fl"
         id="taskList">
      <div class="tableBox">
        <div :class="isFixed?'topTableFixed':'topTable'">
          <div class="topBar">
            <div :class="leftFixed?'stageHeader':'stageListBox'"
                 class="clearfix">
              <div class="label ">分区</div>
              <div class="label ">任务/阶段</div>
            </div>
            <div :class="leftFixed ?'stageRight':'stageListBox'"
                 class=" clearfix ">
              <div v-for="element in stageList"
                   :key="element.pkid"
                   class="stageLists">
                {{element.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="mainContent"
             :class="{'mainContentFixed':isFixed}">
          <draggable v-model="partitionsList"
                     :move="getdata"
                     @update="datadragEnd"
                     @start='starDrag'
                     :options="{ghostClass: 'ghost_file', dragClass: 'drag_file'}">
            <transition-group class="hhah">
              <div v-for="(element,index) in partitionsList"
                   :key="element.partitionId"
                   class="partitionsMain"
                   :data-partitionid='element.partitionId'>
                <transition name="fade">
                  <div class="partitionsAndStages"
                       v-if="!element.autoExpand">
                    <div ref='partitions'
                         class="cur"
                         style="heigth:100px;"
                         :class="leftFixed?'partitionsLabelFixed':'partitionsLabel'"
                         :style="'height:'+ ((element.taskList.length )* 72) +'px;'">
                      <span class="iconBox">
                        <span class="icon"
                              @click="move">
                          <i class="iconfont icon-pailie cur"
                             @click="movePartitions"></i>
                        </span>
                        <span class="icon"
                              @click="addPartition(element,index)">
                          <i class="iconfont icon-jia1 cur"></i>
                        </span>
                        <span class="icon"
                              @click="delPartition(element,index)">
                          <i class="iconfont icon-delete cur"></i>
                        </span>
                      </span>
                      <i class="iconfont cur unfold"
                         :class="!element.autoExpand?'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                      <textarea type="text"
                                class="stageTittle"
                                v-model="element.partitionTitle"
                                style="resize:none"
                                @blur="stageBlur(element.partitionTitle,element,index)"></textarea>
                    </div>
                    <draggable v-model="element.taskList"
                               :move='getdata2'
                               @update="datadragEnd2"
                               :options="{
                                 group: 'file', 
                                 ghostClass: 'ghost_file', 
                                 dragClass: 'drag_file',
                                 draggable: '.dragging'
                                 }">
                      <transition-group class="taskLists">
                        <li v-for="(item,index) in element.taskList"
                            :key="item.taskId"
                            v-if="item.taskId"
                            :class="{'stageBox':!leftFixed,'stageBoxFixed':leftFixed,'dragging':item.taskId!==''}">
                          <span class="stageLists cur">
                            <span class="iconBox_">
                              <span class="icon"
                                    @click="move">
                                <i class="iconfont icon-pailie cur"
                                   @click="movePartitions"></i>
                              </span>
                              <span class="icon"
                                    @click="addStage(element.taskList,index)">
                                <i class="iconfont icon-jia1 cur"></i>
                              </span>
                              <span class="icon"
                                    @click="delStage(element.taskList,index)">
                                <i class="iconfont icon-delete cur"></i>
                              </span>
                            </span>
                            <textarea v-model="item.taskTitle"
                                      class="stageName"
                                      style="resize:none"
                                      @blur="stageNameBlur(item.taskTitle,element,index)">
                            </textarea>
                          </span>
                          <div class="stageListsBox">
                            <div class="stage cur"
                                 v-for="(lists,index) in  item.stageTaskList"
                                 :key="lists.stageId">
                              <div class="stageBg"></div>
                              <div class="stageInfo cur">
                                <span class="participantImg">
                                  <span class="img">
                                    <img src=""
                                         alt="">
                                  </span>
                                  <span class="img">
                                    <img src=""
                                         alt="">
                                  </span>
                                  <span class="img">
                                    <img src=""
                                         alt="">
                                  </span>
                                </span>
                                <div class="participantMain">
                                  <span class="pieChart"></span>
                                  <span class="">12/21 23:37 - 06/22 24:36</span>
                                  <i class="iconfont icon-wenjian1">2</i>
                                  <span></span>
                                </div>
                              </div>
                              <div class="stageHover">
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="参与任务"
                                            placement="top-start">
                                  <el-button>
                                    <span class="iconBg">
                                      <i class="iconfont icon-jiaru-1"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="取消参与"
                                            placement="top-start">
                                  <el-button>
                                    <span class="iconBg">
                                      <i class="iconfont icon-tuichu-"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="进入详情"
                                            placement="top-start">
                                  <el-button>
                                    <span class="iconBg">
                                      <i class="iconfont icon-xiangqing"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="添加时间"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-rili1 otherColor "></i>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="添加成员"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-tianjiarenyuan otherColor"></i>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="上传文件"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-shangchuan otherColor"></i>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="关闭阶段"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-jinzhi otherColor"></i>
                                  </el-button>
                                </el-tooltip>
                              </div>

                            </div>
                          </div>
                        </li>
                        {{element}}
                        <li v-if='element.taskList[0]'>
                          <span class="stageLists cur">
                            <span class="iconBox_">
                              <span class="icon"
                                    @click="move">
                                <i class="iconfont icon-pailie cur"
                                   @click="movePartitions"></i>
                              </span>
                              <span class="icon"
                                    @click="addStage(element.taskList,index)">
                                <i class="iconfont icon-jia1 cur"></i>
                              </span>
                              <span class="icon"
                                    @click="delStage(element.taskList,index)">
                                <i class="iconfont icon-delete cur"></i>
                              </span>
                            </span>
                            <textarea 
                                      class="stageName"
                                      style="resize:none"
                                      @blur="stageNameBlur(item.taskTitle,element,index)">
                            </textarea>
                          </span>
                          <div class="stageListsBox">
                            hehehe
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </div>
                </transition>
                <!-- 缩略列表 -->
                <div class="thumbnailList"
                     v-if="element.autoExpand">
                  <div class="iconBox_">
                    <span class="icon"
                          @click="move">
                      <i class="iconfont icon-pailie cur"
                         @click="movePartitions"></i>
                    </span>
                    <span class="icon"
                          @click="addPartition(element,index)">
                      <i class="iconfont icon-jia1 cur"></i>
                    </span>
                    <span class="icon"
                          @click="delPartition(element,index)">
                      <i class="iconfont icon-delete cur"></i>
                    </span>
                  </div>
                  <li class="">
                    <transition name="flodRotate">
                      <i class="iconfont"
                         :class="!element.autoExpand ? 'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                    </transition>
                    <span>
                      {{element.partitionTitle}}
                    </span>
                  </li>
                </div>
              </div>
            </transition-group>
          </draggable>

          <div>
          </div>
        </div>
      </div>

    </div>
    <transition name="fade1">
      <Info v-if="itemInformationShow"
            @closePop='closeInfo'
            num='itemInformation'
            :projectId='projectId'
            :classify='classify'></Info>
    </transition>
    <transition name="fade1">
      <Reminder2 v-if="reminder2Flag"
                 :type="1"
                 :text="errMessage"
                 :sureText="buttonMes"
                 @handleCancle="reminderCancel"
                 @handleSure="reminderSure" />
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Info from "../common/info";
import Reminder2 from "../../common/reminder2";

// import { searchList } from './data.js';/ 
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
    Info,
    Reminder2
  },
  data() {
    return {
      reminder2Flag: false, //确认删除弹框
      errMessage: 'hahh',
      buttonMes: '确认',
      itemInformationShow: false, //INFO是否显示
      projectId: JSON.parse(localStorage.getItem('projectItem')).projectid,
      classify: "", //点击进入 是我负责的还是 我参与 权限修改
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      projectList: [
        {
          value: "选项1",
          label: "Eggs0.1.1"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
      ],
      selectedProject: "选项1",
      starFlag: true,
      detailsShow: false,
      taskId: '',
      searchLists: [],
      searchValue: '',
      //  表格选项
      isFixed: false,
      leftFixed: false,
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      loginUser: JSON.parse(localStorage.getItem('staffInfo')), // 当前登录者的信息
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      stageList: '',
      partitionsList: [],
      EmptyData: {        'partitionTitle': '', 'partitionId': '', 'autoExpand': false,
        taskList: [
          {
            taskTitle: '', taskId: '', isnew: true,
            stageTaskList: [
              { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
              { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
              { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
              { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
            ]
          },
        ]
      },
      // 添加任务
      newTask: {
        taskTitle: '', taskId: '',
        stageTaskList: [
          { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
          { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
          { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
          { enabled: '', endTime: '', fileCont: '', stageTaskId: '' },
        ]      },
    };
  },
  watch: {

  },
  methods: {
    ...mapMutations(['DETAILS_CHANGE', 'TASKITEM_CHANGE', 'TASK_POSITION', 'PROJECT_CHANGE']),
    // 展开详情
    // 取消
    reminderCancel() {
      this.reminder2Flag = false;
    },
    //  确认
    reminderSure() {
      this.delPartition();
    },



    projectChange(val) {
      // this.PROJECT_CHANGE(val);
    },

    searchChange(val) {
      if (val) {
        this.searchLists = [...searchList];
      } else {
        this.searchLists = [];
      }
    },

    goTo(item) {
      this.searchChange('');
      this.TASK_POSITION(item.id);
    },

    // 关闭
    closeInfo() {
      this.itemInformationShow = false;
    },
    // 添加分区
    addPartition(el, index) {
      this.partitionsList.splice(index + 1, 0, this.EmptyData);
      this.$nextTick(res => {
        $('.hhah').children().eq(index + 1).find('.stageTittle').focus()
      })
    },

    // 删除分区
    delPartition(element, index) {
      let taskIds = [];
      for (let list of element.taskList) {
        // taskId=='' 时 说明没有任务 可以直接删除 不用移动
        if (list.taskId !== '') {
          taskIds.push(list.taskId);
        }
      }

      // this.partitionsList.splice(index, 1);

      console.log(taskIds)
      return
      this.reminder2Flag = true;

      let obj = { 'partitionId': element.partitionId }
      this.$HTTP('post', '/partition_delete', obj).then(res => {
        this.partitionsList.splice(index, 1);

      })

      let arr = { 'vals': taskIds.join(','), 'type': 0 }
      this.$HTTP('post', '/partition_updateType', arr).then(res => {
        this.partitionsList.splice(index, 1);

      })

    },
    // 分区移动
    getdata(evt) {
      // console.log(evt.draggedContext.element.id)
    },
    // 分区移动
    datadragEnd(evt) {

      let obj = { partitionId: evt.item.dataset.partitionid, isSort: evt.newIndex }
      this.$HTTP('post', '/partition_update_isSort', obj).then(res => {
      })
      // console.log('拖动后的索引 :' + evt.newIndex)
    },
    // 添加分区 判断是否有内容
    stageBlur(name, el, index) {
      // 旧的
      console.log(el.isnew)
      if (el.isnew === false) {
        // 旧的 空的
        if (name == '') {
          return
        } else {
          // 判断 名字是否需要修改 
          this.modifyPartitionName(el.partitionId, name);
        }
        // 新建的
      } else {
        if (name == '') {
          this.partitionsList.splice(index, 1);
        } else {
          console.log('执行了，创建新的一条')
          let obj = { 'myUserId': this.userPkid, 'projectId': this.projectItem.projectid, title: name }
          this.$HTTP('post', '/partition_add', obj).then(res => {
            this.EmptyData.partitionId = res.result.partitionId;
          })
        }
      }
    },

    // 修改分区名字
    modifyPartitionName(partitionId, title) {
      let data = { 'partitionId': partitionId, 'title': title }
      this.$HTTP('post', '/partition_update', data).then(res => {
        console.log(res)
      })
    },

    // 修改任务名字
    ModifyTaskName(taskId, title) {
      let data = { 'taskId': taskId, 'title': title }
      this.$HTTP('post', '/task_update_title', data).then(res => {
        console.log(res)
      })
    },
    // 添加任务
    addStage(el, index) {
      el.splice(index + 1, 0, this.newTask)
      this.$nextTick(res => {
        $('.taskLists').children().eq(index + 1).find('.stageName').focus()
      })
    },
    // 添加项目 光标离开判断
    stageNameBlur(name, el, index) {
      if (el.isnew === false) {
        // 旧的 空的
        if (name == '') {
          return
        } else {
          // 判断 名字是否需要修改 
          this.ModifyTaskName(el.taskId, name);
        }
        // 新建的
      } else {
        if (name == '') {
          el.taskList.splice(index, 1);
        } else {
          console.log('执行了，创建新的一条')
          let obj = { 'myUserId': this.userPkid, 'projectId': this.projectItem.projectid, partitionId: el.partitionId, 'title': name, 'iSort': index }
          this.$HTTP('post', '/task_add', obj).then(res => {
            // el.taskList.taskId = res.result.taskId;
            console.log(res)
          })
        }
      }
    },
    // 删除任务
    delStage(el, index) {
      console.log(el, index, '888');
      el.splice(index, 1)
      let obj = { 'taskId': '' }
      this.$HTTP('post', '/task_del', obj).then(res => {

      })
    },

    starDrag() {
      for (let item of this.partitionsList) {
        item.autoExpand = true;
      }
    },
    movePartitions() {
      console.log('ceshi ')
    },

    move() { },

    startDrag(data) {
      console.log('startDrag: ', data)
    },
    endDrag(data) {
      console.log('endDrag: ', data)
    },
    goFlod(el) {
      el.autoExpand = !el.autoExpand;

      let obj = { 'myUserId': this.userPkid, 'projectId': this.projectItem.projectid, 'partitionId': el.partitionId, 'isState': !el.autoExpand }
      this.$HTTP('post', '/partition_operation', obj).then(res => {

      })


    },
    handleScroll() {
      var scrollTop = parseInt($('.tableBox')[0].scrollTop);
      var scrollLeft = parseInt($('.tableBox')[0].scrollLeft);
      // console.log(scrollLeft);
      if (scrollTop >= 40) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      if (scrollLeft >= 224) {
        this.leftFixed = true;
      } else {
        this.leftFixed = false;
      }
    },



    getdata2(evt) {
      evt.preventDefault();
      console.log(evt.draggedContext.element.id, 'element.id')
    },
    datadragEnd2(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
    },
    // 获取阶段列表
    getstageList() {
      let data = { 'projectId': this.projectItem.projectid, 'state': 0 };
      this.$HTTP('post', '/stage_list_get', data).then(res => {
        this.stageList = res.result;
      
      })
    },
    // 获取项目所有列表
    getProjectAll() {
      let data = { project: this.projectItem.projectid, 'myUserId': this.userPkid }
      this.$HTTP('post', '/project_get_info', data).then(res => {
              console.log(res.result)
        
        this.partitionsList = res.result;

        for (let list of this.partitionsList) {
              console.log(list)
          
          list.isnew = false;
          if (list.taskList !== '') {
            for (let i of list.taskList) {
              i.isnews = false;
            }
          }
        }
      })
    },

  },
  created() {
    this.getstageList(); //获取阶段列表 
    this.getProjectAll();
  },
  mounted() {
    let _ = this;
    $('.tableBox')[0].addEventListener('scroll', _.handleScroll);
    // window.onresize = () => {
    //   return (() => {
    //     if (this.detailsShow) {
    //       var docEl = document.documentElement,
    //         resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    //         clientWidth = docEl.clientWidth;
    //       let W = $('.project_task').eq(0).width();
    //       $("#taskList").width(clientWidth > 1600 ? W - 780 : W - 600);
    //       $("#taskDetails").width(clientWidth > 1600 ? 779 : 599);
    //     }
    //   })();
    // };

  }
};
</script>

<style lang="less">
@import "../../../assets/css/base.less";
@import "vue-easytable/libs/themes-base/index.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.flodRotate-enter-active {
  animation: bounce-in 0.1s;
}
.flodRotate-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

.project_task {
  width: 100%;
  height: 100%;
  // height: calc(~ '100% - 50px');
  overflow: hidden;
  .project_task_top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @bg-f2f2f2;
    padding: 0 25px;
    .box_sizing;
    .iconfont {
      padding: 5px;
      &:not(.project_star) {
        color: @grayNight;
      }
    }

    .project_star {
      color: @starColor;
    }

    .el-select {
      .el-input__inner {
        padding: 0;
        border: none;
        &:focus {
          border: none;
        }
      }
    }
    .project_search {
      position: relative;
      .el-input {
        width: 290px;
      }
      .search_list {
        position: absolute;
        top: 42px;
        left: 0;
        width: 520px;
        max-height: 330px;
        overflow: auto;
        border: 1px solid #e5e5e5;
        background: #fff;
        .border_radius(@br: 4px;);
        z-index: 10;

        .search_list_ul {
          .search_list_li {
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            .cur;
            img,
            span,
            button,
            .iconfont {
              vertical-align: middle;
            }
            img {
              margin-left: 25px;
            }

            .title {
              .dis-in-bl;
              margin-left: 10px;
              width: 160px;
              .word_over;
            }

            .icon-star {
              margin-left: 22px;
              color: @starColor;
            }
            .task_state {
              font-size: 12px;
              padding: 0 !important;
              width: 90px;
              text-align: center;
              margin: 0 7px;
              margin-left: 24px;
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

            .from_parth {
              .dis-in-bl;
              margin-left: 10px;
              width: 95px;
              font-weight: bold;
              .word_over;
            }

            &:hover {
              background: @bg-f2f2f2;
            }
          }
        }
      }
    }

    .icon-rili {
      padding: 0 5px;
      margin-right: 19px;
      .box_sizing;
    }
  }
  .project_task_list {
    width: 100%;
    height: calc(~"100vh - 50px - 51px");
    overflow-x: auto;
    .tableBox {
      width: 100%;
      height: 100%;
      color: #333333;
      font-size: 14px;
      overflow-x: auto;
      .topTable {
        height: 40px;
        background: #fff;
        border-bottom: 1px solid #eeeeee;
        z-index: 100;
        .topBar {
          display: flex;
          flex-direction: row;
          .stageHeader {
            display: flex;
            flex-direction: row;
            position: fixed;
          }
          .stageRight {
            padding-left: 224px;
            display: flex;
            flex-direction: row;
          }
        }
        .label {
          width: 112px;
          height: 40px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          background: #fff;
          text-align: center;
          line-height: 40px;
        }
        .stageListBox {
          display: flex;
          flex-direction: row;
        }
        // 阶段标题内容
        .stageLists {
          z-index: 99;
          width: 252px;
          height: 40px;
          line-height: 40px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          background: #fff;
          text-align: center;
          line-height: 40px;
        }
      }
      .topTableFixed {
        height: 40px;
        background: #fff;
        border-bottom: 1px solid #eeeeee;
        position: fixed;
        // box-shadow:
        z-index: 99;
        box-shadow: 0px 2px 4px 0px rgba(153, 153, 153, 0.4);
        .topBar {
          display: flex;
          flex-direction: row;
          .stageHeader {
            display: flex;
            flex-direction: row;
            position: fixed;
          }
          .stageRight {
            padding-left: 224px;
            display: flex;
            flex-direction: row;
          }
        }

        .label {
          width: 112px;
          height: 40px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          background: #fff;
          text-align: center;
          line-height: 40px;
        }
        .stageListBox {
          display: flex;
          flex-direction: row;
        }
        // 阶段（标题）内容
        .stageLists {
          z-index: 99;
          width: 252px;
          height: 40px;
          line-height: 40px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          background: #fff;
          text-align: center;
          line-height: 40px;
        }
      }

      .mainContentFixed {
        padding-top: 40px;
      }
      .mainContent {
        display: flex;
        flex-direction: column;
        z-index: 1;
        .partitionsMain {
          display: flex;
          flex-direction: row;
          min-height: 72px;
          background: #fff;
          .partitionsAndStages {
            display: flex;
            flex-direction: row;
            // position: fixed;
          }
          .defaultMainBox {
            display: flex;
            flex-direction: column;
            .defaultStage {
              display: flex;
              flex-direction: row;
            }
            .stage {
              width: 253px;
              height: 72px;
              border-right: 1px solid #eeeeee;
              border-bottom: 1px solid #eeeeee;
            }
          }
          // 折叠样式
          .thumbnailList {
            height: 72px;
            width: 100%;
            line-height: 72px;
            padding: 0 14px;
            .box_sizing;
            background: #fff;
            border-bottom: 1px solid #eeeeee;
            position: relative;
            .iconBox_ {
              position: absolute;
              height: 30px;
              line-height: 30px;
              left: 14px;
              opacity: 0;
              // top: 10px;
              .icon {
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                background: rgba(246, 250, 255, 1);
                border-radius: 4px;
                margin: 2px;
                i {
                  font-size: 12px;
                }
              }
            }
            .iconBox_:hover {
              opacity: 1;
            }
          }
        }

        // .
        // 阶段 定位样式
        .stageBoxFixed {
          padding-left: 112px;
          display: flex;
          flex-direction: row;
          .iconBox_ {
            position: absolute;
            height: 30px;
            line-height: 30px;
            left: 14px;
            opacity: 0;
            // top: 10px;
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              background: rgba(246, 250, 255, 1);
              border-radius: 4px;
              margin: 2px;
              i {
                font-size: 12px;
              }
            }
          }
          .iconBox_:hover {
            opacity: 1;
          }
          .stageListsBox {
            display: flex;
            flex-direction: row;
            padding-left: 112px;
            z-index: 1;
            .stage {
              position: relative;
              .stageBg {
                position: absolute;
                display: inline-block;
                height: 52px;
                width: 100%;
                background: rgba(171, 204, 255, 0.1);
                top: 10px;
                border-left: 2px solid #3684ff;
                z-index: 1;
              }
              .stageHover {
                position: absolute;
                display: inline-block;
                height: 100%;
                width: 100%;
                z-index: 3;
                padding: 25px 35px;
                .box_sizing;
                opacity: 0;
                .el-button {
                  background: none;
                  border: none;
                  padding: 0;
                  i {
                    color: #fff;
                    font-size: 14px;
                  }
                  .otherColor {
                    color: #666666;
                  }
                }
                .iconBg {
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                  text-align: center;
                  line-height: 24px;
                  background: rgba(54, 132, 255, 1);
                  border-radius: 4px;
                }
              }

              .stageInfo {
                position: absolute;
                padding: 7px 0;
                .box_sizing;
                top: 10px;
                display: inline-block;
                height: 52px;
                z-index: 2;
                width: 100%;
                text-align: center;
                // margin: 0 auto;

                .participantImg {
                  height: 20px;
                  .img {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: red;
                    border-radius: 3px;
                    overflow: hidden;
                    img {
                      width: 20px;
                      height: 20px;
                    }
                  }
                }
                .participantMain {
                  color: #666666;
                  .pieChart {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: yellow;
                  }
                  span {
                    font-size: 12px;
                  }
                  i {
                    font-size: 12px;
                  }
                }
              }
            }
            .stage:hover {
              .stageHover {
                position: absolute;
                display: inline-block;
                height: 100%;
                width: 100%;
                background: #ffffff;
                z-index: 3;
                opacity: 1;
                padding: 25px 35px;
                .box_sizing;
              }
            }
          }
          // 阶段（内容）样式
          .stageLists {
            z-index: 99;
            height: 72px;
            width: 112px;
            line-height: 72px;
            position: fixed;
            background: #fff;
            border-left: 1px solid rgba(153, 153, 153, 0);
            border-top: 1px solid rgba(153, 153, 153, 0);
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            text-align: center;
            box-shadow: 1px 2px 4px 0px rgba(153, 153, 153, 0.4);
            .stageName {
              padding: 20px 0;
              width: 100px;
              border: none;
            }
          }
          .stageMain {
            padding-left: 112px;
          }
          .stage {
            width: 252px;
            height: 72px;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
          }
        }
        // 正常样式
        .stageBox {
          display: flex;
          flex-direction: row;
          .stageListsBox {
            display: flex;
            flex-direction: row;
            z-index: 1;
            .stage {
              position: relative;
              .stageBg {
                position: absolute;
                display: inline-block;
                height: 52px;
                width: 100%;
                background: rgba(171, 204, 255, 0.1);
                top: 10px;
                border-left: 2px solid #3684ff;
                z-index: 1;
              }
              .stageHover {
                position: absolute;
                display: inline-block;
                height: 100%;
                width: 100%;
                z-index: 3;
                padding: 25px 35px;
                .box_sizing;
                opacity: 0;
                .el-button {
                  background: none;
                  border: none;
                  padding: 0;
                  i {
                    color: #fff;
                    font-size: 14px;
                  }
                  .otherColor {
                    color: #666666;
                  }
                }
                .iconBg {
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                  text-align: center;
                  line-height: 24px;
                  background: rgba(54, 132, 255, 1);
                  border-radius: 4px;
                }
              }

              .stageInfo {
                position: absolute;
                padding: 7px 0;
                .box_sizing;
                top: 10px;
                display: inline-block;
                height: 52px;
                z-index: 2;
                width: 100%;
                text-align: center;

                .participantImg {
                  height: 20px;
                  .img {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    overflow: hidden;
                    background: red;
                    img {
                      width: 20px;
                      height: 20px;
                    }
                  }
                }
                .participantMain {
                  color: #666666;
                  .pieChart {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: yellow;
                  }
                  span {
                    font-size: 12px;
                  }
                  i {
                    font-size: 12px;
                  }
                }
              }
            }
            .stage:hover {
              .stageHover {
                position: absolute;
                display: inline-block;
                height: 100%;
                width: 100%;
                background: #ffffff;
                z-index: 3;
                opacity: 1;
                padding: 25px 35px;
                .box_sizing;
              }
            }
          }
          // 阶段（内容）样式
          .stageLists {
            height: 72px;
            width: 112px;
            line-height: 72px;
            background: #fff;
            border-left: 1px solid rgba(153, 153, 153, 0);
            border-top: 1px solid rgba(153, 153, 153, 0);
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            text-align: center;
            position: relative;
            .stageName {
              padding: 20px 0;
              width: 100px;
              border: none;
            }
            .iconBox_ {
              position: absolute;
              height: 30px;
              line-height: 30px;
              left: 0px;
              .icon {
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                background: rgba(246, 250, 255, 1);
                border-radius: 4px;
                margin: 2px;
                opacity: 0;
                i {
                  font-size: 12px;
                }
              }
            }
          }
          .stageLists:hover {
            height: 72px;
            width: 112px;
            line-height: 72px;
            background: #fff;
            border: 1px solid #c4c4c4;
            .box_sizing;
            text-align: center;
            position: relative;
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              background: rgba(246, 250, 255, 1);
              border-radius: 4px;
              margin: 2px;
              opacity: 1;
              i {
                font-size: 12px;
              }
            }
          }
          .stageMain {
            padding-left: 112px;
          }
          .stage {
            width: 252px;
            height: 72px;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
          }
        }
        .partitionsLabel {
          display: block;
          width: 112px;
          min-height: 72px;
          background: #fff;
          border-right: 1px solid #eeeeee;
          border-left: 1px solid rgba(153, 153, 153, 0);
          border-top: 1px solid rgba(153, 153, 153, 0);
          border-bottom: 1px solid #eeeeee;
          text-align: center;
          position: relative;
          .unfold {
            position: absolute;
            left: 14px;
            top: 50%;
            margin-top: -10px;
          }
          .box_sizing;
          .iconBox {
            position: absolute;
            opacity: 0;
            top: 7px;
            left: 14px;
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              background: rgba(246, 250, 255, 1);
              border-radius: 4px;
              i {
                font-size: 12px;
              }
            }
          }
        }

        .partitionsLabel:hover {
          display: block;
          width: 112px;
          min-height: 72px;
          background: #fff;
          border: 1px solid #c4c4c4;
          .box_sizing;
          text-align: center;
          position: relative;
          .iconBox {
            opacity: 1;
          }
        }

        .stageTittle {
          width: 55px;
          max-height: 57px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          position: absolute;
          right: 14px;
          top: 50%;
          margin-top: -10px;
          border: none;
          i {
            position: absolute;
          }
        }

        .partitionsLabelFixed {
          z-index: 99;
          position: fixed;
          display: block;
          width: 112px;
          min-height: 72px;
          background: #fff;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          text-align: center;
          .unfold {
            position: absolute;
            left: 14px;
            top: 50%;
            margin-top: -10px;
          }
          .iconBox {
            position: absolute;
            opacity: 0;
            top: 7px;
            left: 14px;
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              background: rgba(246, 250, 255, 1);
              border-radius: 4px;
              i {
                font-size: 12px;
              }
            }
          }
        }
        .partitionsLabelFixed:hover {
          position: fixed;
          display: block;
          width: 112px;
          min-height: 72px;
          background: #fff;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          text-align: center;
          .iconBox {
            opacity: 1;
          }
        }
      }
    }
  }
  .ghost_file {
    // 折叠样式
    .thumbnailList {
      background: rgba(255, 255, 255, 0.2) !important;
      border-bottom: 1px solid #3684ff !important;
    }
  }
  .drag_file {
    // background: pink !important;
    .thumbnailList {
      background: -webkit-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Firefox 3.6 - 15 */
      background: linear-gradient(#ffffff, #ffffff) !important; /* 标准的语法 */
      border: 1px solid rgba(196, 196, 196, 1) !important;
      box-shadow: 1px 1px 14px 0px rgba(153, 153, 153, 1) !important;
      z-index: 99 !important;
    }
  }
}
</style>


