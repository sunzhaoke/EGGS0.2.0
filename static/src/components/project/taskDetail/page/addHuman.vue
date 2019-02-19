<template>
    <div class="add_human_yun">
        <div class="stage_people">
            <div 
                class="people clearfix"
                v-for='(stage, index) in stagePeopleList'
                :key='stage.stageId'
                >
                <span class="people_title">{{stage.stageTitle}}</span>
                <div class="header_box fr">
                  <div class="people_header"
                      v-for="(item, index1) in stage.userList"
                      :key="item.userpkid"
                      @mouseenter="peopleEnter(item)"
                      @mouseleave="peopleLeave(item)">
                      <img class="header"
                          :src="item.userPic"
                          alt="">
                      <el-tooltip v-show="item.hovers"
                                  class="item"
                                  effect="dark"
                                  :content="(item.nickName ? item.nickName : item.userName) + (item.IsState ? '：已完成' : '')"
                                  placement="top"
                                  :open-delay="300"
                                  >
                          <span class="del_peop iconfont icon-guanbijiantou"
                              @click="delPeople(item, index, index1)"></span>
                      </el-tooltip>
                      <span v-if="item.IsState"
                          class="icon_finish iconfont icon-xuanzhong"></span>

                  </div>
                  <div class="add_people_box">
                      <i class="iconfont icon-jia1 add_people"
                      :class="addPeopleShow !== false && addPeopleShow === index ? 'add_people_show' : ''"
                      @click.stop="addPeople(index, stage)"></i>
                      
                  </div>
                </div>
                <div v-if='!index' class="selected_stage"></div>
            </div>
        </div>
        <div class="arrow_div">
            <div class="arrow_box"></div>
        </div>
       <!-- 添加人员 -->
        <el-collapse-transition>
            <Participant v-if="addPeopleShow !== false"
                ref="addPeople"
                id="addPeople"
                :creatorId="ids.userId"
                :defaultKeys="defaultKeys"
                :userList="userList"
                @handleSure="addPeopleSure"
                @handleInvite="invitePeople" />
        </el-collapse-transition>
        <!-- 邀请/添加人员 -->
        <transition name="fade1">
            <add-people 
                v-if="inviteShow"
                :defaultTreeKeys="inviteDefaultKeys"
                :fromInfo="fromInfo"
                @handleCancel="handleAddPeople" 
                />
        </transition>
        
        <!-- 温馨提示2_删除协作人员 -->
        <transition name="fade1">
            <Reminder2 v-if="delPeopleFlag"
                :type="1"
                :text="reminderText"
                @handleCancle="delPeopleCancel"
                @handleSure="delPeopleSure" />
        </transition>
    </div>
</template>
<script>
import Participant from "../../common/participant";
import AddPeople from "../../../common/addPeople";
import Reminder2 from "../../../common/reminder2";

export default {
  components: {
    Participant,
    AddPeople,
    Reminder2
  },
  props: ["defaultList", "ids", "fullViewFlag"],
  data() {
    return {
      stagePeopleList: [], // 阶段人员列表
      addPeopleShow: false, // 邀请加入显示/隐藏
      creatorId: "",
      defaultKeys: [],
      userList: [],

      selectedIndex: [], // [阶段index， 人员index]
      delPeopleFlag: false, 
      inviteShow: false, // 邀请加入的
      inviteDefaultKeys: [],
      fromInfo: {
        type: 2,
        id: this.ids.taskId
      }
    };
  },

  methods: {
    // 鼠标移入参与者头像
    peopleEnter(item) {
      item.hovers = true;
      this.stagePeopleList = this.stagePeopleList.concat();
    },

    // 鼠标移出参与者头像
    peopleLeave(item) {
      item.hovers = false;
      this.stagePeopleList = this.stagePeopleList.concat();
    },

    // 点击删除人员
    delPeople(item, index, index1) {
      this.delPeopleFlag = true;
      this.reminderText =
        "是否确认从任务中删除参与人：" +
        (item.nickName ? item.nickName : item.userName);
      this.selectedIndex = [index, index1];
    },
    // 取消删除人员
    delPeopleCancel() {
      this.delPeopleFlag = false;
    },
    // 确定删除人员
    delPeopleSure() {
      this.delPeopleFlag = false;
      const index = this.selectedIndex[0];
      const index1 = this.selectedIndex[1];
      // console.log( this.stagePeopleList[index]);
      // 发送请求
      let obj = {
        projectId: this.ids.projectId,
        addVale: "",
        delVale: this.stagePeopleList[index].userList[index1].userpkid,
        stageId: this.stagePeopleList[index].stageId,
        taskId: this.ids.taskId,
        myUserId: this.ids.userId,
      };
      this.$HTTP("post", "/stageTask_user_update", obj)
        .then(res => {
          let data = {
            item: this.stagePeopleList[index],
            del: [this.stagePeopleList[index].userList[index1].userpkid],
            add: []
          }
          this.$emit('stageInfoChange', 1, data);
          this.stagePeopleList[index].userList.splice(index1, 1);
          console.log("任务删除人员", res, this.stagePeopleList);
        })
        .catch(err => {
          console.log("任务删除人员失败", err);
        });
    },

    // 点击添加人员
    async addPeople(index) {
        this.selectedIndex[0] = index;
        this.defaultKeys = [];
        let nowList = this.stagePeopleList[index].userList;
        for(let x of nowList) {
            this.defaultKeys.push(x.userpkid);
        }
        this.selectedIndex = this.selectedIndex.concat();
       
      try {
        await this.getProjectUser();
        this.addPeopleShow = index;
         this.$nextTick(() => {
            // 设置邀请人员addPeople的位置
            let top, left, w1, appW;
            top = $('.add_people_box').eq(index).offset().top;
            left = $('.add_people_box').eq(index).offset().left;
            w1 = $('#addPeople').width();
            appW = $('#app').width();
            top = top + 40;
            left = left - 155;
            if(left + w1 > appW) {
                left = appW - w1 - 24;
            }
            $('#addPeople').css({top: top + 'px', left: left + 'px'});
        });
      } catch (err) {
        console.log(err);
      }
      let clickHide = e => {
        this.addPeopleShow = false; // 隐藏
        $(document).unbind("click", clickHide);
      };
      $(document).bind("click", clickHide);
    },

    // 取消添加人员/邀请人员中发生变化事发送请求
    handleAddPeople(obj) {
      if (obj) {
        obj.invite === false && (this.inviteShow = false);
        // 发送请求，taskPeopleList发生变化
        console.log("add-people", obj);
        this.addPeopleSure(Object.assign(obj, { add: obj.addIds, del: [] }));
      } else {
        this.inviteShow = false;
      }
    },

    // 添加/删除人员成功
    addPeopleSure(data) {
      let index = this.selectedIndex[0];
      let index1 = this.selectedIndex[1];
      let nowList = this.stagePeopleList[index].userList;
      this.addPeopleShow = false; // 隐藏
      
      // console.log("participant", data);
      // 发送请求
      if (data && (data.add.length || data.del.length)) {
        let add = [...data.add];
        let del = [...data.del];
        let obj = {
          projectId: this.ids.projectId,
          addVale: add.join(","),
          delVale: del.join(","),
          stageId: this.stagePeopleList[index].stageId,
          taskId: this.ids.taskId,
          myUserId: this.ids.userId,
        };
        this.$HTTP("post", "/stageTask_user_update", obj)
          .then(res => {
            // 发送请求，taskPeopleList发生变化
            let arr = res.result.userList;
            for(let i of arr) {
                this.$set(i, "show", false);
                this.$set(i, "hovers", false);
            }
            if (del) {
              for (let x = 0; x < del.length; x++) {
                for (let y = 0; y < nowList.length; y++) {
                  if (del[x] == nowList[y].userpkid) {
                    nowList.splice(y, 1);
                    y--;
                  }
                }
              }
            }
            this.stagePeopleList[index].userList = [...arr];
            this.stagePeopleList = this.stagePeopleList.concat();
            let data = {
              item: this.stagePeopleList[index],
              del: del,
              add: add
            }
            this.$emit('stageInfoChange', 1,data);
            // console.log("任务添加人员", res, nowList);
          })
          .catch(err => {
            console.log("任务添加人员失败", err);
          });
        // 发送请求
      }
    },

    // 点击邀请好友
    invitePeople(ids) {
      this.addPeopleShow = false;
      this.inviteShow = true;
      this.inviteDefaultKeys = ids;

    },

    // 获取项目成员列表
    getProjectUser() {
      return new Promise((resolve, reject) => {
        let obj = {
          projectId: this.ids.projectId,
          myUserId: this.ids.userId
        };
        this.$HTTP("post", "/project_usersList_get", obj)
          .then(res => {
            console.log("获取项目参与人员列表", res.result);
            this.userList = res.result;
            resolve(this.userList);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },

    setData() {
      this.stagePeopleList = [...this.defaultList];
      if(!this.fullViewFlag) {
        let indexs = this.stagePeopleList.findIndex( ele => ele.stageId == this.ids.stageId);
        if(indexs > 0) {
          let list = this.stagePeopleList[indexs];
          this.stagePeopleList.splice(indexs, 1);
          this.stagePeopleList.unshift(list);
        }
      }
      for (let x of this.stagePeopleList) {
        this.$set(x, "show", false);
        for (let y of x.userList) {
          this.$set(y, "hovers", false);
        }
      }
    }
  },
  created() {
    this.setData();
    console.log("addHuman---", this.stagePeopleList);
  }
};
</script>
<style lang='less'>
@import "../../../../assets/css/base.less";

.add_human_yun {
  position: absolute;
  top: 35px;
  left: -115px;
  width: 264px;
  height: 222px;
    padding: 10px 0 10px 24px;
    .box_sizing;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 15px 0px rgba(59, 81, 133, 0.3);
  border-radius: 4px;
  z-index: 100;

  .stage_people {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .people {
      width: 100%;
      line-height: 40px;
      position: relative;
      .people_title {
        color: @graySix;
        margin-right: 6px;
      }
      .header_box {
        .dis-in-bl;
        width: 160px;
        .people_header {
          position: relative;
          .dis-in-bl;
          .cur;
          padding: 0 5px;
          position: relative;
          height: 40px;
          .del_peop {
            position: absolute;
            top: 11px;
            left: 5px;
            width: 20px;
            height: 20px;
            color: #fff;
            text-align: center;
            vertical-align: middle;
            line-height: 20px;
            background: #5f5f5f;
            opacity: 0.8;
            .border_radius(@br: 4px;);
            .dis-in-bl;
            z-index: 3;
            &:hover {
                color: #ffffff !important;
            }
          }
          .icon_finish {
              position: absolute;
              .dis-in-bl;
              width: 10px;
              height: 10px;
              text-align: center;
              line-height: 10px;
              font-size: 12px;
              background: #fff;
              .border_radius(@br: 50%);
              color: #32a635;
              bottom: 9px;
              right: 6px;
              z-index: 2;
          }
        }

        .add_people_box {
          height: 40px;

          .dis-in-bl;
          position: relative;
          margin: 0 5px;
          .add_people {
            .dis-in-bl;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            .border_radius(@br: 2px;);
            background: @bg-f2f2f2;
            font-size: 12px;
            color: #cdcdcd;
            font-weight: bold;
            &:hover {
              color: @mainColor;
            }
          }
          .add_people_show {
            color: @mainColor;
          }
        }
      }

      .selected_stage {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 215px;
          height: 1px;
          background: @line;
      }
      &:first-child {
          margin-bottom: 20px;
      }
    }
  }

    .arrow_div {
        position: absolute;
        top: -10px;
        left: 120px;
        width: 10px;
        height: 10px;
        overflow: hidden;
        .arrow_box {
        width: 6px;
        height: 6px;
        box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        background: #fff;
        transform: rotate(45deg);
        margin-left: 2px;
        margin-top: 7px;
        }
    }
    #addPeople {
        position: fixed !important;
        .arrow_div {
            position: absolute;
            top: -10px;
            left: 160px;
            width: 10px;
            height: 10px;
            overflow: hidden;
            .arrow_box {
            width: 6px;
            height: 6px;
            box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            background: #fff;
            transform: rotate(45deg);
            margin-left: 2px;
            margin-top: 7px;
            }
        }
    }
    .popup {
      // background-color: rgba(255,255,255,0) !important;
    }
}
</style>


