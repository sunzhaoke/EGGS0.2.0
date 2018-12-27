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
                   :data-partitionId='element.partitionId'>
                <transition name="fade">
                  <div class="partitionsAndStages"
                       v-if="element.autoExpand">
                    <div ref='partitions'
                         class="cur"
                         style="heigth:100px;"
                         :class="leftFixed?'partitionsLabelFixed':'partitionsLabel'"
                         :style="'height:'+ ((element.stage.length )* 72) +'px;'">
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
                         :class="element.autoExpand?'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                      <textarea type="text"
                                class="stageTittle"
                                v-model="element.title"
                                @blur="stageBlur(element.title,index)"></textarea>
                    </div>
                    <draggable v-model="element.stage"
                               :move='getdata2'
                               @update="datadragEnd2"
                               :options="{group: 'file', ghostClass: 'ghost_file', dragClass: 'drag_file'}">
                      <transition-group class="taskLists">
                        <li v-for="(item,index) in element.stage"
                            :key="item.taskId"
                            :class="leftFixed?'stageBoxFixed':'stageBox'">
                          <span class="stageLists cur">
                            <span class="iconBox_">
                              <span class="icon"
                                    @click="move">
                                <i class="iconfont icon-pailie cur"
                                   @click="movePartitions"></i>
                              </span>
                              <span class="icon"
                                    @click="addStage(element.stage,index)">
                                <i class="iconfont icon-jia1 cur"></i>
                              </span>
                              <span class="icon"
                                    @click="delStage(element.stage,index)">
                                <i class="iconfont icon-delete cur"></i>
                              </span>
                            </span>
                            <textarea v-model="item.name"
                                      class="stageName"
                                      @blur="stageNameBlur(item.name,element,index)">
                            </textarea>
                          </span>
                          <div class="stageListsBox">
                            <span class="stage"
                                  v-for="(lists,index) in  item.stageMain"
                                  :key="index">
                              {{lists.name}}
                            </span>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </div>
                </transition>
                <!-- 缩略列表 -->
                <div class="thumbnailList"
                     v-if="!element.autoExpand">
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
                         :class="element.autoExpand ? 'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                    </transition>
                    <span>
                      {{element.title}}
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
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Info from "../projectManage/info";
import { searchList } from './data.js';
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
    Info
  },
  data() {
    return {
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
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      selectedProject: "选项1",
      starFlag: true,
      detailsShow: false,
      taskId: '',
      searchLists: [],
      searchValue: '',

      isFixed: false,
      leftFixed: false,
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      loginUser: JSON.parse(localStorage.getItem('staffInfo')), // 当前登录者的信息
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      stageList: '',
      partitionsList: [
        {          title: '分区1', partitionId: 1, autoExpand: true,
          stage: [
            {              name: '阶段1', id: 1, taskId: 1, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段2', id: 2, taskId: 2, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段3', id: 3, taskId: 3, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段4', id: 4, taskId: 4, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
          ]
        }, {          title: '分区2', partitionId: 2, autoExpand: true,
          stage: [
            {              name: '阶段1', id: 1, taskId: 1, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段2', id: 2, taskId: 2, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段3', id: 3, taskId: 3, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段4', id: 4, taskId: 4, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
          ]
        },
      ],
      EmptyData: {        'title': '', 'partitionId': '', 'autoExpand': true,
        stage: [
          {
            name: '2', id: '', taskId: '',
            stageMain: [
              { name: '', id: '', pkid: '' },
              { name: '', id: '', pkid: '' },
              { name: '', id: '', pkid: '' },
              { name: '', id: '', pkid: '' }
            ]          },
        ]
      },
      // 添加任务
      newTask: {
        name: '', id: 11, taskId: 11,
        stageMain: [
          { name: '2', id: 12, pkid: 12 },
          { name: '3', id: 13, pkid: 13 },
          { name: '', id: 14, pkid: 14 },
          { name: '', id: 15, pkid: 15 }
        ]      },
    };
  },

  methods: {
    ...mapMutations(['DETAILS_CHANGE', 'TASKITEM_CHANGE', 'TASK_POSITION', 'PROJECT_CHANGE']),
    // 展开详情
    extendDetails(flag, id) {
      if (id) {
        this.taskId = id;
        this.$refs.details.changeTask(this.taskId);
      }
      var docEl = document.documentElement,
        resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        clientWidth = docEl.clientWidth;
      let W = $('.project_task').eq(0).width();
      // 1进入详情 0关闭详情
      if (flag) {
        this.detailsShow = true;
        this.$nextTick(() => {
          $("#taskList").animate({
            width: clientWidth > 1600 ? W - 780 : W - 600
          });
          $("#taskDetails").show();
          $("#taskDetails").animate({
            width: clientWidth > 1600 ? 779 : 599
          });
        });

        this.DETAILS_CHANGE(true);

      } else {
        this.DETAILS_CHANGE(false);

        $("#taskList").animate({
          width: "100%"
        });
        $("#taskDetails").hide();
        $("#taskDetails").animate({
          width: "0"
        }, () => {
          this.detailsShow = false;
        });
      }

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
      this.extendDetails(1, item.id);
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
        console.log()
      })
    },

    // 删除分区
    delPartition(element, index) {
      let obj = { 'partitionId': element.partitionId }
      this.$HTTP('post', '/partition_delete', obj).then(res => {
        this.partitionsList.splice(index, 1);
      })
    },
    // 分区移动
    getdata(evt) {
      console.log('异动前')
      console.log(evt.draggedContext.element.id)
    },
    // 分区移动
    datadragEnd(evt) {
      let obj = { partitionId: evt.item.dataset.partitionid, isSort: evt.newIndex }
      this.$HTTP('post', '/partition_update_isSort', obj).then(res => {
      })
      console.log('拖动后的索引 :' + evt.newIndex)
    },
    // 添加分区 判断是否有内容
    stageBlur(name, index) {
      if (name == '') {
        this.partitionsList.splice(index, 1);
      } else {
        let obj = { 'myUserId': this.userPkid, 'projectId': this.projectItem.projectid, title: name }
        this.$HTTP('post', '/partition_add', obj).then(res => {
          this.EmptyData.partitionId = res.result.partitionId;
        })
      }
    },


    // 添加任务
    addStage(el, index) {
      el.splice(index + 1, 0, this.newTask)
      this.$nextTick(res => {
        $('.taskLists').children().eq(index + 1).find('.stageName').focus()
      })
    },
    delStage(el, index) {
      console.log(el, index, '888');
      el.splice(index, 1)

    },

    starDrag() {
      for (let item of this.partitionsList) {
        item.autoExpand = false;
      }
    },
    movePartitions() {
      console.log('ceshi ')
    },
    stageNameBlur(name, el, index) {
      if (name == '') {
        el.stage.splice(index, 1);
      } else {
        let obj = { 'myUserId': this.userPkid, 'projectId': this.projectItem.projectid, partitionId: el.partitionId, 'title': name, 'iSort': index }
        this.$HTTP('post', '/task_add', obj).then(res => {
          el.stage.taskId = res.result.taskId;
          console.log(res)
        })
      }
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
    }

  },
  created() {
    this.getstageList(); //获取阶段列表 
  },
  mounted() {
    this.extendDetails(0);

    let _ = this;
    $('.tableBox')[0].addEventListener('scroll', _.handleScroll);
    window.onresize = () => {
      return (() => {
        if (this.detailsShow) {
          var docEl = document.documentElement,
            resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            clientWidth = docEl.clientWidth;
          let W = $('.project_task').eq(0).width();
          $("#taskList").width(clientWidth > 1600 ? W - 780 : W - 600);
          $("#taskDetails").width(clientWidth > 1600 ? 779 : 599);
        }
      })();
    };

  }
};
</script>

<style lang="less">
@import "../../../../assets/css/base.less";
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
        z-index: 99;
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
          }
          // 阶段（内容）样式
          .stageLists {
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

          i {
            position: absolute;
          }
        }

        .partitionsLabelFixed {
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


