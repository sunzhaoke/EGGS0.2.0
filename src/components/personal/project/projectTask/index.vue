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
    


    
    <left-list ref="ledtList"
               @handleDetails="extendDetails" />
    <right-details ref="details"
                   :taskId="taskId"
                   @handleDetails="extendDetails" />
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
import LeftList from "./leftList";
import RightDetails from "./rightDetails";
import { mapMutations } from 'vuex';
import Info from "../projectManage/info";
import { searchList } from './data.js';

export default {
  components: {
    LeftList,
    RightDetails,
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

  },
  mounted() {
    this.extendDetails(0);
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
.project_task {
  width: 100%;
  height: 100%;
  // height: calc(~ '100% - 50px');
  overflow: hidden;
  .project_task_top {
    width: 100%;
    height: 50px;
    line-height: 51px;
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

    .icon-gantanhao {
      // color: @grayNight;
    }

    .el-select {
      // margin-left: 24px;
      .el-input {
      }
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
}
</style>


