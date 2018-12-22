<template>
  <div id="Info_k">
    <div class="">
      <div class="popup">
        <div class="popup_box">
          <div class="popup_top">
            <span class="popup_title"
                  v-if="classify=='newInformation'">新建项目</span>
            <span class="popup_title"
                  v-else>项目信息</span>
            <i class="iconfont  icon-guanbijiantou fr"
               @click="closeNewPop"></i>
          </div>
          <div class="popup_content popup_content_k popup_content_main clearfix">
            <ul>
              <!-- 1.输入标题 -->
              <li class="enterTitle">
                <i class="iconfont icon-title"></i>
                <input type="text"
                       v-if="classify=='newInformation'||classify=='myResponsible'"
                       placeholder="输入项目的标题"
                       @focus="titleInputFocus"
                       @blur="titleInputBlur"
                       v-model="title"
                       :class="titleFocus?'pitchOn':'titleInput'">
                <span v-else
                      class="titleInput">{{title}}</span>
              </li>
              <!-- 2.描述 -->
              <li class="describeBox clearfix">
                <div>
                  <i class="iconfont icon-caidan"></i>
                  <span :class="{'describeBold':describeShow} "
                        @click="describeBox"
                        v-if="classify=='newInformation'||classify=='myResponsible'">描述</span>
                  <span class="describeBold"
                        v-else>描述</span>
                </div>
                <textarea name=""
                          class="fr"
                          v-show="textShow"
                          :class="descnFocus?'describePitchOn':'describe'"
                          v-if="classify=='newInformation'"
                          v-model='descn'
                          style="resize:none"
                          @focus="descnInputFocus"
                          @blur="descnInputBlur"></textarea>
                <textarea name=""
                          class="fr"
                          :class="descnFocus?'describePitchOn':'describes'"
                          v-if="classify=='myResponsible'"
                          v-model='descn'
                          style="resize:none"
                          @focus="descnInputFocus"
                          @blur="descnInputBlur"></textarea>
                <span class="fr describes"
                      v-if="classify=='pigeonhole'">{{descn}}</span>
              </li>
              <!-- 3.添加成员 -->
              <li class="addProBox clearfix">
                <i class="iconfont icon-haoyou"></i>
                <span @click="addPeo"
                      v-if="classify=='newInformation'"
                      :class="{'addbold':addListShow}">添加成员</span>
                <span v-else
                      class="addbold">添加成员</span>
                <div class="addList"
                     v-if="userLitsShow || classify!=='newInformation'">
                  <span class="oneself">
                    <img :src="oneSelfImg">
                  </span>
                  <span class="line"></span>
                  <span>
                    <span v-for='(item,index) in userList'
                          :key="index">
                      {{item}}
                      <span class="addPhoto"
                            v-if="!item.del || !item.del==true">
                        <img :src="item.image"
                             alt="">
                        <i class="delBox"
                           v-if="classify!=='pigeonhole'||classify=='newInformation'"></i>
                        <i class="iconfont  icon-guanbijiantou"
                           v-if="classify!=='pigeonhole'||classify=='newInformation'"
                           @click="delPeo(item,index)"></i>
                      </span>
                    </span>
                  </span>

                  <span class="addPhotoIcon"
                        @click="addPeo"
                        v-if="classify!=='pigeonhole'||classify=='newInformation'">
                    <i class="iconfont icon-jia1"> </i>
                  </span>
                </div>
              </li>
              <!-- 4.选择日期 -->
              <li class="optionDate">
                <i class="iconfont icon-rili1"></i>
                <span v-if="classify=='iParticipate'||classify=='pigeonhole' ">
                  <span>{{startTime}}</span>
                  <span class="lines">-</span>
                  <span>{{endTime}}</span>
                </span>
                <span v-else>
                  <div class="block">
                    <el-date-picker v-model="startTime"
                                    type="date"
                                    default-time
                                    placeholder="设置开始时间">
                    </el-date-picker>
                  </div>

                  <span class="lines"> -</span>
                  <div class="block">
                    <el-date-picker v-model="endTime"
                                    type="date"
                                    placeholder="设置截止时间">
                    </el-date-picker>
                  </div>
                </span>

              </li>
            </ul>
            <input type="button"
                   value="开始创建"
                   v-if="classify=='newInformation'"
                   @click="enterNew"
                   class="enterNew fr"
                   :class="newButtonShow ? 'main_button_bg' : 'main_button_disabled_bg'">
            <input type="button"
                   value="保存信息"
                   v-else
                   @click="saveMain"
                   class="enterNew fr"
                   :class="saveButton? 'main_button_bg' :'main_button_disabled_bg' ">
          </div>
        </div>
      </div>
    </div>
    <add-people v-if="addPeopleShow"
                :defaultTreeKeys="addPeopleLists"
                @handleCancel="cancelAddPeople"></add-people>
  </div>
</template>
<script>
import AddPeople from "../../common/addPeople";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      userId: "",
      describeShow: false,
      newButtonShow: false, //开始创建按钮是否显示
      addPeopleShow: false, //添加人员显示
      title: "",
      descn: "",
      textShow: false, //输入框默认不显示
      createrId: "",
      startTime: "", //设置开始时间
      endTime: "", //设置结束时间
      titleFocus: "", //标题是否获取焦点
      descnFocus: false, //描述信息 框框是否显示
      addListShow: false, //人员列表默认不显示,

      // 信息修改页面---------------
      itemInfo: "", //项目信息列表
      saveButtonShow: false, //保存信息按钮
      userList: [], //选择人头像
      oneSelfImg: "",
      addPeopleLists: ['1024'],
      userLitsShow: false,
      saveButton: false, //保存信息按钮是否显示
    };
  },
  props: ["AddPeople", "classify", "projectId"],
  components: {
    AddPeople
  },

  watch: {
    title(val, i) {
      if (val !== "") {
        this.newButtonShow = true;
      } else {
        this.newButtonShow = false;
      }
      if (val !== this.itemInfo.title) {
        this.saveButton = true;
      } else {
        this.saveButton = false;
      }
    },
    descn(val, i) {
      if (val !== this.itemInfo.descn) {
        this.saveButton = true;
      } else {
        this.saveButton = false;
      }
    },
    userList(val, i) {
      console.log(val)
      if (val !== this.itemInfo.userlist) {
        this.saveButton = true;
      } else {
        this.saveButton = false;
      }
    },
    // 开始时间
    startTime(val, i) {
      this.itemInfo.startTime
      if (val !== this.itemInfo.startTime) {
        this.saveButton = true;
      } else {
        this.saveButton = false;
      }
    },
    // 结束时间
    endTime(val, i) {
      if (val !== this.itemInfo.endTime) {
        this.saveButton = true;
      } else {
        this.saveButton = false;
      }
    }
  },
  methods: {
    ...mapMutations(["SHOW_NEWPREJECTPOP"]),
    cancelAddPeople(ids) {
      this.addPeopleShow = false;
      if (ids) {
        // if()
        for (let item of ids.arr) {
          this.userList.push({ 'image': item.Images, 'userId': item.userid, 'realname': item.realname, 'add': true })
        }
        console.log(this.userList, ' this.userList')
        // this.userList = ids;
      }
    },
    //   点击描述
    describeBox() {
      this.textShow = true;
      this.describeShow = true;
      this.descnFocus = true;
    },
    // 添加成员
    addPeo() {
      this.addPeopleShow = true;
      this.addListShow = true;
      this.userLitsShow = true; //点击添加成员 显示列表显示；
      let userIds = [];
      console.log(this.userList, 'ddddddddddddddddd');
      if (this.userList) {
        for (let item of this.userList) {
          userIds.push(item.userId);
        }
        this.addPeopleLists = userIds;
      }

    },
    // 删除添加人员
    delPeo(item, index) {

      // 如果是有默认属性
      if (item.default) {
        // this.userList[index].del = true;
        item.del = true;
        this.userList[index].del = true
        console.log(this.userList[index])
      } else if (item.add) {
        this.$delete(item, "del", '')
      }
      // this.$delete(this.data,"obj",value)


      // this.userList.splice(index, 1);
    },
    // 开始创建
    enterNew() {
      if (this.newButtonShow == false) {
        return;
      }
      if (this.startTime) {
        this.startTime = this.format(this.startTime, "yyyy-MM-dd HH:mm:ss");
      }
      if (this.endTime) {
        this.endTime = this.format(this.endTime, "yyyy-MM-dd HH:mm:ss");
      }
      let userListIds = [];
      if (this.userList) {
        for (let item of this.userList) {
          userListIds.push(item.userid);
        }
      }
      let data = {
        title: this.title,
        descn: this.descn,
        userList: userListIds.join(','),
        createrId: this.createrId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      this.$HTTP("post", "/project_add", data).then(res => {
        if (res.code == 200) {
          this.closeNewPop();
          this.$message.success("项目创建成功");
        } else {
          this.closeNewPop();
          this.$message.warning("项目创建失败");
        }
      });
    },
    format(time, format) {
      var t = new Date(time);
      var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case "yyyy":
            return tf(t.getFullYear());
            break;
          case "MM":
            return tf(t.getMonth() + 1);
            break;
          case "mm":
            return tf(t.getMinutes());
            break;
          case "dd":
            return tf(t.getDate());
            break;
          case "HH":
            return tf(t.getHours());
            break;
          case "ss":
            return tf(t.getSeconds());
            break;
        }
      });
    },
    // 保存修改信息
    saveMain() {
      if (this.startTime) {
        this.startTime = this.format(this.startTime, "yyyy-MM-dd HH:mm:ss");
      }
      if (this.endTime) {
        this.endTime = this.format(this.endTime, "yyyy-MM-dd HH:mm:ss");
      }
      let userLists = [];
      if (this.userList) {
        for (let item of this.userList) {
          userLists.push(item.userId)
        }
      }
      let obj = {
        projectId: this.projectId,
        title: this.title,
        descn: this.descn,
        userList: userLists.join(','),
        startTime: this.startTime,
        endTime: this.endTime,
        userId: this.userId,
        AddUserList: '',
        DelUserList: '',
      };
      this.$HTTP("post", "/project_update", obj).then(res => {
        this.$message("信息修改成功");
        this.$emit("closePop");
      });
    },
    // 点击关闭创建
    closeNewPop() {
      this.$emit("closePop");
    },

    // 关闭添加人员
    closeAdd() {
      this.addPeopleShow = false;
    },
    // 点击记录 获取项目信息
    getProjectMain(projectId) {
      let obj = { projectId: projectId };
      this.$HTTP("post", "/project_get", obj).then(res => {
        this.itemInfo = res.result;
        this.oneSelfImg = this.itemInfo.createrPic;
        this.title = this.itemInfo.title;
        this.descn = this.itemInfo.descn;
        this.startTime = this.itemInfo.startTime;
        this.endTime = this.itemInfo.endTime;

        // 删除数组第一个数据
        this.userList = this.itemInfo.userlist;
        this.userList.splice(0, 1);
        for (let item of this.userList) {
          item.default = true;
        }
      });
    },
    // 标题输入框失焦
    titleInputFocus() {
      this.titleFocus = !this.titleFocus;
    },
    // 标题输入框失焦
    titleInputBlur() {
      this.titleFocus = !this.titleFocus;
    },

    descnInputFocus() {
      this.descnFocus = true;
    },
    descnInputBlur() {
      this.descnFocus = false;
    }
  },
  created() {
    var staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
    this.oneSelfImg = staffInfo.pic;
    this.createrId = staffInfo.userPkid;
    this.userId = staffInfo.userPkid;
    if (this.classify !== "newInformation") {
      this.getProjectMain(this.projectId);
    }

    if (this.classify == "pigeonhole") {
      this.addListShow = true;
    }
  }
};
</script>
<style lang='less'>
@import "../../../../assets/css/base.less";

#Info_k {
  .popup_top {
    i {
      font-size: 14px;
    }
  }
  .popup_content_main {
    width: 400px;
    min-height: 352px;
    max-height: 485px;
    .box_sizing;
  }
  .popup_content_k {
    width: 400px;
    min-height: 352px;
    max-height: 485px;
    padding: 40px 25px;
    overflow: auto;
    .box_sizing;
    ul {
      margin-bottom: 30px;
      li {
        margin-top: 30px;
        &:first-child {
          margin-top: 0;
        }
      }
      .enterTitle,
      .describeBox,
      .addProBox,
      .optionDate {
        width: 100%;
        .block {
          width: 105px;
          .el-date-editor {
            width: 105px;
          }
        }
        .lines {
          // color: red;
          margin-right: 20px;
        }
        .titleInput {
          width: 319px;
          height: 30px;
          color: #333333;
          font-weight: bold;
          .box_sizing;
        }
        .pitchOn {
          width: 88%;
          padding: 10px;
          border: 1px solid #d0d0d0;
          height: 30px;
          border-radius: 3px;
          .box_sizing;
        }
        i {
          color: #666666;
        }
        input {
          color: #333333;
          margin-left: 10px;
        }
        span {
          color: #999999;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .describeBox {
        .describeBold {
          color: #333333;
          font-weight: bold;
        }
        .describePitchOn {
          width: 322px;
          min-height: 32px;
          line-height: 1.7;
          max-height: 67px;
          border: 1px solid rgba(208, 208, 208, 1);
          border-radius: 4px;
          margin-top: 8px;
          padding: 0 8px;
          .box_sizing;
        }
        .describe {
          width: 322px;
          max-height: 67px;
          line-height: 1.7;
          border: none;
          overflow: auto;
          color: #333333;
          margin-top: 8px;
          padding: 0 8px;
          .box_sizing;
        }
        .describes {
          width: 322px;
          max-height: 67px;
          color: #333333;
          line-height: 1.7;
          border: none;
          overflow: auto;
          margin-top: 8px;
          .box_sizing;
        }
      }
      .addProBox {
        .addbold {
          color: #333333;
          font-weight: bold;
        }
        .addList {
          margin-top: 14px;
          width: 322px;
          float: right;
          span {
            margin-left: 5px;
            display: inline-block;
          }
          .oneself {
            width: 20px;
            height: 20px;
            overflow: hidden;
            border-radius: 3px;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }
          .line {
            height: 10px;
            width: 1px;
            background: #f2f2f2;
            display: inline-block;
            margin-bottom: 5px;
          }
          .addPhoto {
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border-radius: 3px;
            position: relative;
            overflow: hidden;
            i {
              position: absolute;
              left: 2px;
              color: rgba(255, 255, 255, 0);
            }
            img {
              width: 20px;
              height: 20px;
              position: absolute;
              background: slateblue;
              left: 0;
            }
            .delBox {
              display: block;
              position: absolute;
              background: rgba(51, 51, 51, 0);
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
            }
          }
          .addPhoto:hover {
            i {
              color: rgba(255, 255, 255, 1);
              transition: all 0.3s linear;
            }
            .delBox {
              background: rgba(51, 51, 51, 0.7);
              transition: all 0.3s linear;
            }
          }
          .addPhotoIcon {
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border-radius: 3px;
            position: relative;
            overflow: hidden;
            background: #3684ff;
            i {
              position: absolute;
              left: 5px;
              font-size: 10px;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }
    }
    .optionDate {
      .block {
        display: inline-block;
        width: 80px;

        .el-date-editor {
          display: inline-block;
          border: none;
          .el-input__inner {
            border: none;
            padding: 0;
            margin: 0;
            height: 30px;
            line-height: 30px;
          }
        }
        .el-input__prefix {
          display: none;
        }
        .el-input__icon {
          line-height: 30px;
        }
      }
    }
  }
}
</style>

