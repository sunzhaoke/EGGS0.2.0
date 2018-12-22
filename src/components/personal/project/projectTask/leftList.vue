<template>
  <div class="project_task_list fl"
       id="taskList">
    <div class="tableBox">
      <div class="topTable">
        <div class="stageListBox clearfix">
          <div class="label ">分区</div>
          <div class="label ">任务/阶段</div>
        </div>
        <div class="stageListBox clearfix ">
          <div v-for="element in stageList"
               :key="element.pkid"
               class="stageLists">
            {{element.title}}
          </div>
        </div>
      </div>
      <div class="mainContent">
        <draggable v-model="partitionsList"
                   :move="getdata"
                   @update="datadragEnd">
          <transition-group>
            <div v-for="element in partitionsList"
                 :key="element.pkid"
                 class="partitionsMain">

              <div class="partitionsAndStages"
                   v-if="!element.autoExpand">
                <div class="partitionsLabel">
                  <span>
                    <transition name="flodRotate">
                      <i class="iconfont cur"
                         :class="element.autoExpand?'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                    </transition>

                    {{element.name}}
                  </span>
                </div>
                <draggable v-model="element.stage"
                           :move='getdata2'
                           @update="datadragEnd2">
                  <transition-group>
                    <li v-for="el in element.stage"
                        :key="el.pkid"
                        class="stageBox">
                      <span class="stageLists cur">{{el.name}}</span>

                      <span class="stage"
                            v-for="(lists,index) in  el.stageMain"
                            :key="index">
                        {{lists.name}}
                      </span>
                    </li>
                  </transition-group>
                </draggable>
              </div>
              <!-- 缩略列表 -->
              <ul v-else
                  class="thumbnailList">
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
              </ul>
            </div>
          </transition-group>
        </draggable>
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
      stageList: '',
      partitionsList: [
        {          name: '分区1', id: 1, pkid: 1, autoExpand: true,
          stage: [
            {              name: '阶段1', id: 1, pkid: 1, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段2', id: 2, pkid: 2, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段3', id: 3, pkid: 3, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段4', id: 4, pkid: 4, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
          ]
        },
        {          name: '分区2', id: 2, pkid: 2, autoExpand: true, stage: [
            {              name: '阶段1', id: 1, pkid: 1, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
            {              name: '阶段2', id: 2, pkid: 2, stageMain: [
                { name: '阶段1-产品规划内容', id: 1, pkid: 1 },
                { name: '阶段2-产品设计内容', id: 2, pkid: 2 },
                { name: '阶段3-开发阶段内容', id: 3, pkid: 3 },
                { name: '阶段4-测试阶段内容', id: 4, pkid: 4 }
              ]            },
          ],
        },

        {          name: '分区3', id: 3, pkid: 3, autoExpand: true,
          stage: [
            { name: '阶段1', id: 1, pkid: 1 },
            { name: '阶段2', id: 2, pkid: 2 },
          ],
          stageMain1: [
            { name: '', id: 1, pkid: 1 },
            { name: ' ', id: 2, pkid: 2 },
            { name: '阶段3-产品规划内容', id: 3, pkid: 3 },
            { name: '阶段4-产品规划内容', id: 4, pkid: 4 }
          ]        },
      ],
      stageLists: [
        { 'title': '阶段1 ，内容1', 'title': '阶段2 ，内容2', 'title': '阶段3 ，内容3', 'title': '阶段4 ，内容4', },
        { 'title': '阶段2 ，内容1', 'title': '阶段2 ，内容2', 'title': '阶段3 ，内容3', 'title': '阶段4 ，内容4', },
        { 'title': '阶段3 ，内容1', 'title': '阶段2 ，内容2', 'title': '阶段3 ，内容3', 'title': '阶段4 ，内容4', },
      ],
      scroll: '',

    };
  },
  computed: {

  },
  watch: {

  },
  methods: {
    goFlod(el) {
      console.log(el)
      el.autoExpand = !el.autoExpand;
    },
    menu() {
      this.scroll = document.body.scrollTop;
      console.log(this.scroll)
    },
    getdata(evt) {
      // console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.tags)
    },
    getdata2(evt) {
      console.log('heheh ')
      evt.preventDefault();
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd2(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      // console.log(this.tags)
    },
    // 获取阶段列表
    getstageList() {
      let data = { 'projectId': this.projectItem.projectid, 'state': 0 };
      this.$HTTP('post', '/stage_list_get', data).then(res => {
        console.log(res)
        this.stageList = res.result;
      })
    }

  },
  created() {
    this.getstageList(); //获取阶段列表 
  },
  mounted() {
    let _ = this;
    window.addEventListener('scroll', this.menu)
  }
};
</script>

<style lang="less">
@import "../../../../assets/css/base.less";
.flodRotate-enter-active {
  animation: bounce-in 0.5s;
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
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #eeeeee;
      .label {
        width: 112px;
        min-height: 40px;
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
      .stageLists {
        width: 252px;
        height: 40px;
        border-right: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        background: #fff;

        text-align: center;
        line-height: 40px;
      }
    }
    .mainContent {
      display: flex;
      flex-direction: column;
      // padding-top: 41px;
      .partitionsMain {
        display: flex;
        flex-direction: row;
        min-height: 72px;
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
          padding: 0 28px;
          .box_sizing;
          background: #fff;
          border-bottom: 1px solid #eeeeee;
        }
      }

      .stageBox {
        display: flex;
        flex-direction: row;
        .stageLists {
          min-height: 72px;
          width: 112px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          text-align: center;
        }
        .stage {
          width: 252px;
          min-height: 72px;
          border-right: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
        }
      }
      .fixation {
        // position: fixed;
        // padding-left: 100px;
      }
      .partitionsLabel {
        display: block;
        width: 112px;
        min-height: 72px;
        border-right: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        text-align: center;
        // line-height: 40px;
      }
    }
  }
}
</style>


