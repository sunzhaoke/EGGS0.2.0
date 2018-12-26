<template>
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
              <div class="thumbnailList">
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
                    {{element.name}}
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
</template>
<script>
import draggable from "vuedraggable";
import Reminder2 from "../../../common/reminder2";
import TaskFilter from "../../common/taskFilter";
import { task, task1 } from './data.js';
import { mapState, mapMutations } from "vuex";
import { VTable, VPagination } from 'vue-easytable';
export default {

  components: {
    draggable,
    Reminder2,
    TaskFilter
  },
  // name: 'frozen-title-columns',
  data() {
    return {
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
        },
      ],
      EmptyData: {        'title': '', 'partitionId': '', 'autoExpand': true,
        stage: [
          {
            name: '', id: '', taskId: '',
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
          { name: '', id: 12, pkid: 12 },
          { name: '', id: 13, pkid: 13 },
          { name: '', id: 14, pkid: 14 },
          { name: '', id: 15, pkid: 15 }
        ]      },

    }
  },

  computed: {

  },
  watch: {

  },
  methods: {
    // 分区

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
    let _ = this;
    $('.tableBox')[0].addEventListener('scroll', _.handleScroll);

    // if (_.$refs.partitions[0]) {
    //   console.log('222222')
    //   let hei = this.$refs.partitions[0].clientHeight
    //   // console.log(this.$refs.partitions[0].clientHeight);//获取第一个div元素的高度
    //   this.$refs.partitions[0].style.height = hei + 'px';//动态设置HTML元素高度
    // }
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
</style>


