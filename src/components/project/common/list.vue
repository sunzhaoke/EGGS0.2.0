<template>
  <div id="PMP">
    <div class="PMP_top">
      <span class="topName">项目管理</span>
      <span class="main_button_bg mf-20"
            @click="newPro">新建项目</span>
      <span class="fr">
        <i class="iconfont icon-sousuo"></i>
        <i class="iconfont icon-rili "></i>
      </span>
    </div>
    <div class="middleMain">
      <!-- <div class="recently clearfix classify">
        <p class="title">最近活跃</p>
        <div class="card fl"
             v-for="(list,index) in myResponsibleList"
             :key="index">
          <h2>{{list.title}}</h2>
          <i class="iconfont icon-star fr"
             v-if="list.isStar"
             @click="LightStar(list)"></i>
          <i class="iconfont icon-shoucang fr"
             @click="LightStar(list)"
             v-else></i>
          <div class="statisticalFigures">
            <ul class="clearfix">
              <li>
                <div class="num">{{list.createTaskCount}}</div>
                <div>已创建任务</div>
                <span class="line"></span>
              </li>
              <li>
                <div class="num">{{list.finishTaskCount}}</div>
                <div>已完成任务</div>
                <span class="line"></span>
              </li>
              <li>
                <div class="num">{{list.incompleteTtasksCount}}</div>
                <div>已超时任务</div>
              </li>
            </ul>
          </div>
          <div class="participantBottom">
            <ul class="clearfix">
              <li class="lessThan5">
                <img :src="list.creater.createrPic"
                     alt="赵珂">
              </li>
              <li class="lessThan5"
                  v-for="(img,index) in list.userlist"
                  :key="index">
                <img :src="img.image"
                     alt="">
              </li>
              <li class="nums fr"
                  v-if="list.userCount > 5">等{{list.userCount}}人</li>
              <li :class="list.userCount > 5 ? 'moreThan5':'lessThan5'"
                  v-if="list.userCount<1">
                <img src=""
                     alt="">
              </li>
            </ul>
            <el-dropdown @command="handleCommand"
                         trigger="click">
              <span class="el-dropdown-link">
                <i class="iconfont icon-gengduo fr"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="index"
                                  v-for="(lists,index) in OtherfeatureLists"
                                  :key="index"
                                  :dataProjectid='list.projectid'>{{lists.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div> -->
      <div class="iResponsible clearfix classify">
        <p class="title">我负责的</p>
        <div class="card fl"
             v-for="(list,index) in myResponsible"
             :key="index"
             @click="enterTask(list)">
          <h2>{{list.title}}</h2>
          <i class="iconfont icon-star fr"
             v-if="list.isStar"
             @click.stop="LightStar(list)"></i>
          <i class="iconfont icon-shoucang fr"
             @click.stop="LightStar(list)"
             v-else></i>
          <div class="statisticalFigures">
            <ul class="clearfix">
              <li>
                <div class="num">{{list.createTaskCount}}</div>
                <div>已创建任务</div>
                <span class="line"></span>
              </li>
              <li>
                <div class="num">{{list.finishTaskCount}}</div>
                <div>已完成任务</div>
                <span class="line"></span>
              </li>
              <li>
                <div class="num">{{list.incompleteTtasksCount}}</div>
                <div>已超时任务</div>
              </li>
            </ul>
          </div>
          <div class="participantBottom">
            <ul class="clearfix">
              <div v-if="list.userCount<5">
                <li class="lessThan5">
                  <img :src="list.creater.createrPic"
                       alt="赵珂">
                </li>
                <li class="lessThan5"
                    v-for="(img,index) in list.userlist"
                    :key="index">
                  <img :src="img.image"
                       alt="">
                </li>
              </div>

              <div v-if="list.userCount >= 5 "
                   class="moreUser clearfix">
                <li class="moreThan5"
                    :style="{'z-index': Math.abs( index-200)}">
                  <img :src="list.creater.createrPic"
                       alt="赵珂">
                </li>
                <li class="moreThan5"
                    v-for="(img,index) in list.userlist"
                    :key="index"
                    :style="{'z-index': Math.abs( index-100)}">
                  <img :src="img.image"
                       alt="">
                </li>
                <li class="nums fr">等{{list.userCount}}人</li>
              </div>

            </ul>
            <span @click.stop
                  class="moreButton">
              <el-dropdown @command="handleCommand"
                           trigger="click">
                <span class="el-dropdown-link">
                  <i class="iconfont icon-gengduo fr"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="index"
                                    v-for="(lists,index) in OtherfeatureLists"
                                    :key="index"
                                    :dataProjectid='list.projectid'
                                    classify='myResponsible'>{{lists.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>

          </div>
        </div>

        <div class="card fl newCard"
             @click="newPro">
          <i class="iconfont icon-jia"> 新建项目</i>
        </div>
      </div>
      <div class="iJoined classify clearfix"
           v-if="I_participatein">
        <div style="height:21px;"
             class="title">
          <div class="fl">我参与的</div>
          <i class="iconfont icon-shaixuan fl"></i>
          <el-select v-model="value"
                     class="fl"
                     placeholder="请选择"
                     @change="selectState(value)">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="card fl"
             v-for="(list,index) in joinedAddList"
             :key="index"
             @click="enterTask(list)">
          <h2>{{list.title}}</h2>
          <i class="iconfont icon-star fr"
             v-if="list.isStar"
             @click.stop="LightStar(list)"></i>
          <i class="iconfont icon-shoucang fr"
             @click.stop="LightStar(list)"
             v-else></i>
          <div class="statisticalFigures">
            <ul class="clearfix">
              <li>
                <div class="num">{{list.createTaskCount}}</div>
                <div>我未完成的任务</div>
              </li>
            </ul>
          </div>
          <div class="participantBottom">
            <ul class="clearfix">
              <div v-if="list.userCount<5">
                <li class="lessThan5">
                  <img :src="list.creater.createrPic"
                       alt="赵珂">
                </li>
                <li class="lessThan5"
                    v-for="(img,index) in list.userlist"
                    :key="index">
                  <img :src="img.image"
                       alt="">
                </li>
              </div>

              <div v-if="list.userCount >= 5 "
                   class="moreUser clearfix">
                <li class="moreThan5"
                    :style="{'z-index': Math.abs( index- 200)}">
                  <img :src="list.creater.createrPic"
                       alt="赵珂">
                </li>
                <li class="moreThan5"
                    v-for="(img,index) in list.userlist"
                    :key="index"
                    :style="{'z-index': Math.abs( index-100)}">
                  <img :src="img.image"
                       alt="">
                </li>
                <li class="nums fr">等{{list.userCount}}人</li>
              </div>

            </ul>
            <span @click.stop
                  class="moreButton">
              <el-dropdown @command="handleCommand"
                           trigger="click"
                           visible-change.stop>
                <span class="el-dropdown-link"
                      @click.stop>
                  <i class="iconfont icon-gengduo fr"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="index"
                                    v-for="(lists,index) in handoverSettings"
                                    :key="index"
                                    :dataProjectid='list.projectid'
                                    classify='iParticipate'>{{lists.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
        </div>
      </div>
      <div class="filed classify clearfix">
        <div class="title cur active" v-if="fillShowAll" @click="fillShowAll=!fillShowAll">显示已归档项目({{fillLength}})</div>
        <div class="titleBox" v-if="!fillShowAll">
          <span class="title cur"
                :class="checkIndex==index?'active':'' "
                v-for=" (li,index) in pigeonholeAndconnect"
                @click="selectTitle(index)"
                :key="index">{{li.name}} &nbsp;</span>
          <span class="cur"
                v-if="showButton"
                @click="fillShowAll=!fillShowAll">隐藏</span>
        </div>
        <div v-if="!fillShowAll">
          <div class="card fl"
               v-for="(list,index) in projectArchiveList"
               :key="index"
               @click="enterTask(list)">
            <h2>{{list.title}}</h2>
            <i class="iconfont icon-star fr"
               v-if="list.isStar"
               @click.stop="LightStar(list)"></i>
            <i class="iconfont icon-shoucang fr"
               @click.stop="LightStar(list)"
               v-else></i>
            <div class="statisticalFigures">
              <div class="num saveTime">归档日期：{{list.saveTime}}</div>
            </div>
            <div class="participantBottom">
              <ul class="clearfix">
                <div v-if="list.userCount<5">
                  <li class="lessThan5">
                    <img :src="list.creater.createrPic"
                         alt="赵珂">
                  </li>
                  <li class="lessThan5"
                      v-for="(img,index) in list.userlist"
                      :key="index">
                    <img :src="img.image"
                         alt="">
                  </li>
                </div>

                <div v-if="list.userCount >= 5 "
                     class="moreUser clearfix">
                  <li class="moreThan5"
                      :style="{'z-index': Math.abs( index- 200)}">
                    <img :src="list.creater.createrPic"
                         alt="赵珂">
                  </li>
                  <li class="moreThan5"
                      v-for="(img,index) in list.userlist"
                      :key="index"
                      :style="{'z-index': Math.abs( index-100)}">
                    <img :src="img.image"
                         alt="">
                  </li>
                  <li class="nums fr">等{{list.userCount}}人</li>
                </div>

              </ul>
              <span @click.stop
                    class="moreButton">
                <el-dropdown @command="handleCommand"
                             trigger="click"
                             visible-change.stop>
                  <span class="el-dropdown-link"
                        @click.stop>
                    <i class="iconfont icon-gengduo fr"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="index"
                                      v-for="(lists,index) in ArchiveSettingsList"
                                      :key="index"
                                      :dataProjectid='list.projectid'
                                      classify='iParticipate'>{{lists.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Info v-if="itemInformationShow"
          @closePop='closeInfo'
          num='itemInformation'
          :projectId='projectId'
          :classify='classify'></Info>
    <itemRecord v-if="itemRecordShow"
                @closeItem='closeItemRecord'
                :projectId='projectId'></itemRecord>
    <projectHandover v-if="HandoverShow"
                     @closeHandover='closeHandover'></projectHandover>
  </div>
</template>
<script>
import List from "./list";
// import Template from "./template";
import { mapState, mapActions, mapMutations } from "vuex";
import Info from "./info";
import itemRecord from "./itemRecord";
import projectHandover from "./projectHandover";

export default {
  components: { List, Info, itemRecord, projectHandover },
  // props: ["Info"],
  data() {
    return {
      fillShowAll:true, //归档文件 显示全部
      info: "",
      userId: "",
      options: [
        {
          value: "1",
          label: "全部"
        },
        {
          value: "2",
          label: "未完成"
        }
      ],
      value5: [],
      value: "全部",
      myResponsibleList: [], //
      I_participatein: [], //我参与的列表
      projectArchiveList: [], //项目归档列表
      fillLength:'', //项目归档数目
      OtherfeatureLists: [
        { name: "项目信息", id: 0 },
        { name: "项目记录", id: 1 },
        { name: "分享", id: 2 },
        { name: "归档", id: 3 },
        { name: "交接", id: 4 }
      ], //卡片其他功能列表
      itemInformationShow: "",
      projectId: "", //卡片id
      itemRecordShow: "", //项目记录显示隐藏
      ArchiveSettingsList: [
        { name: "项目信息", id: 0 },
        { name: "项目记录", id: 1 },
        { name: "分享", id: 2 },
        { name: "恢复项目", id: 5 }
      ], //归档设置按钮值
      handoverSettings: [
        { name: "项目信息", id: 0 },
        { name: "项目记录", id: 1 },
        { name: "分享", id: 2 }
      ], //交接归档设置按钮和我参与的按钮相同
      checkIndex: 0,
      pigeonholeAndconnect: [
        {
          name: "项目归档",
          num: 0,
          Selection: true
        },
        {
          name: "交接归档",
          num: 1,
          Selection: false
        }
      ], //归档 和交接
      showButton: true, //显示 按钮默认显示
      classify: "", //点击进入 是我负责的还是 我参与 权限修改
      HandoverShow: false,//项目交接是否显示
      createrId: JSON.parse(localStorage.getItem("staffInfo")).userPkid,
    };
  },

  filters: {},
  computed: {
    ...mapState(["newProjectPop"]),
    joinedAddList: function () {
      if (this.I_participatein) {
        for (let i in this.I_participatein) {
          let index = this.I_participatein[i].userlist.findIndex(res => {
            return res.userId == this.I_participatein[i].creater.createrId;
          })
          this.I_participatein[i].userlist.splice(index, 1)
          // console.log('我参与的', this.I_participatein)
        }
        return this.I_participatein;
      }
    },
    // 我负责的
    myResponsible: function () {
      if (this.myResponsibleList) {
        for (let i in this.myResponsibleList) {
          let index = this.myResponsibleList[i].userlist.findIndex(res => {
            return res.userId == this.myResponsibleList[i].creater.createrId
          })
          // console.log('我负责的 id ', index)
          this.myResponsibleList[i].userlist.splice(index, 1);
        }
      }
      return this.myResponsibleList
    }
  },
  methods: {
    ...mapMutations(["SHOW_NEWPREJECTPOP"]),
    newPro() {
      // this.SHOW_NEWPREJECTPOP(true);
      this.classify = 'newInformation'
      this.itemInformationShow = true;
    },
    // 选择状态
    selectState(e) {
      console.log('chufa  ', e)
    },
    onSubmit() {
      console.log("submit!");
    },
    // 是否归档弹框
    pigeonhole(list) {
      this.$confirm(
        "您是否归档该项目？归档后可在 已归档 中进行恢复",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.projectId = list.$attrs.dataProjectid;
          let obj = { projectId: this.projectId };
          this.$HTTP("post", "/project_update_isSave", obj).then(res => {
            this.$message.success("归档成功!");
            this.getProjectArchiveList();
            if (this.myResponsibleList) {
              let index = this.myResponsibleList.findIndex(res => {
                return this.projectId == res.projectid;
              });
              if (index !== -1) {
                this.projectArchiveList.push(this.myResponsibleList[index]);
                this.myResponsibleList.splice(index, 1);
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消归档"
          });
        });
    },

    // 项目恢复
    projectRestore(list) {
      this.$confirm(
        "您是否归档该项目？归档后可在 已归档 中进行恢复",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.projectId = list.$attrs.dataProjectid;
          let obj = { projectId: this.projectId };
          this.$HTTP("post", "/project_update_isSave", obj).then(res => {
            this.$message.success("恢复成功!");
            let index = this.projectArchiveList.findIndex(res => {
              return res.projectid == this.projectId;
            });
            if (index !== -1) {
              this.myResponsibleList.push(this.projectArchiveList[index]);
              this.projectArchiveList.splice(index, 1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消恢复"
          });
        });
    },
    // 获取我负责的列表
    getMyResponsibleList() {
      let data = { createrId: this.createrId };
      this.$HTTP("post", "/project_getListByCreaterId", data, $('#app')[0]).then(res => {
        this.myResponsibleList = res.result;
        console.log('我负责的', this.myResponsible)
      });
    },
    // 获取我参与的列表
    get_I_participatein(createrId) {
      let data = { userId: this.createrId };
      this.$HTTP("post", "/projectParticipation_getListByUserId", data, $('#app')[0]).then(
        res => {
          this.I_participatein = res.result;
          console.log(res)
        }
      );
    },
    // 获取项目归档列表
    getProjectArchiveList() {
      let data = { createrId: this.createrId };
      this.$HTTP("post", "/project_getSaveListByCreaterId", data).then(res => {
        this.projectArchiveList = res.result;
        // console.log(this.projectArchiveList.length)
        this.fillLength=this.projectArchiveList.length;
        for (var item of this.projectArchiveList) {
          if (item.saveTime) {
            let i = item.saveTime.split(" ");
            item.saveTime = i[2] + "年" + i[1] + "月" + i[0] + "日";
          }
        }
      });
    },
    // 设置星标
    LightStar(list) {
      list.isStar = !list.isStar;
      let obj = { projectId: list.projectid, userId: this.userId };
      this.$HTTP("post", "/project_update_isStar", obj).then(res => {
        if (res.code == 200) {
          this.getMyResponsibleList();
        }
      });
    },
    // 点击不同选项
    handleCommand(command, list) {
      //  command.cancelBubble = true
      this.projectId = list.$attrs.dataProjectid;
      this.classify = list.$attrs.classify;
      if (command == 0) {
        this.itemInformationShow = true;
      } else if (command == 1) {
        this.itemRecordShow = true;
      } else if (command == 3) {
        this.pigeonhole(list);
      } else if (command == 4) {
        this.HandoverShow = true;
      } else if (command == 5) {
        this.projectRestore(list);
      }
      return false;
    },
    // 交接弹框
    closeHandover() {
      this.HandoverShow = false;
    },
    // 关闭
    closeInfo() {
      this.itemInformationShow = false;
      this.getMyResponsibleList();
      // 获取我参与的列表
      this.get_I_participatein(this.createrId);
    },
    // 关闭
    closeItemRecord() {
      this.itemRecordShow = false;
    },
    // 选择 归档
    selectTitle(index) {
      this.checkIndex = index;
      if (index == 0) {
      } else {
      }
    },
    enterTask(list) {
      console.log(list)

      localStorage.setItem('projectItem', JSON.stringify(list));
      this.$router.push("/project/projectInfo");
    },
    // 项目归档 显示按钮
    showAll() {
      this.showButton = !this.showButton;
    },
    //1.通过好友列表 同意添加好友
    agreeJoin(myUserId, friendsUserId) {
      let obj = { myUserId: myUserId, friendsUserId: friendsUserId };
      this.$HTTP('post', '/user_friends_add', obj).then(res => {
        console.log(res)
      })
    },
    // 2.通过项目加入
    byProject(type, id) {
      let obj = { myUserId: myUserId, friendsUserId: friendsUserId, type: type, id: id };
      this.$HTTP('post', '/user_friendsByType_add', obj).then(res => {
        console.log(res)
      });
    },
    // 3.通过任务片段
  },
  mounted() { },
  created() {
    if (localStorage.getItem("staffInfo")) {
      var staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
      this.createrId = staffInfo.userPkid;
      this.userId = staffInfo.userPkid;
      this.info = staffInfo;
    }
    let urls = decodeURI(window.location.href).split("?")[1];
    if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");

      // console.log(url[1].split("=")[1], url[0].split("=")[1], url[2].split("=")[1])
      // 1.通过好友列表进入的 
      if (url[1].split("=")[1] == 0) {
        this.agreeJoin(this.userId, url[0].split("=")[1]);

        // 2.通过项目进入
      } else if (url[1].split("=")[1] == 1) {
        this.byProject();
        // 3.通过任务片段进入
      } else {
        this.byProject();
      }
    }

    // 获取我负责的列表
    this.getMyResponsibleList();
    // 获取我参与的列表
    this.get_I_participatein(this.createrId);

    // 获取归档的列表
    this.getProjectArchiveList();


    // 归档项目 设置
    // 交接项目 设置

    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("userMsg") && this.$store.replaceState(JSON.parse(localStorage.getItem("userMsg")));

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("userMsg", JSON.stringify(this.$store.state));
    });
  }
};
</script>

<style lang="less" >
@import "../../../assets/css/base.less";
.mf-20 {
  margin-left: 20px;
}

.mf(@mf:20px) {
  margin-left: @mf;
}


#PMP {
  .el-popper[x-placement^="bottom"] {
    width: 120px;
  }
  background: #fafafa;
  height: 100%;
  overflow: auto;
  .PMP_top {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f2f2f2;
    padding: 0 25px;
    .box_sizing;
    .topName {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .middleMain {
    padding: 25px 0 25px 25px;
    .box_sizing;
    .classify {
      margin-bottom: 25px;
    }
    .titleBox {
      margin-bottom: 15px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .card {
      width: 270px;
      height: 150px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      box-shadow: 0px 1px 4px 0px rgba(126, 126, 126, 0.4);
      padding: 17px 15px 16px 15px;
      .box_sizing;
      cursor: pointer;
      .icon-shoucang {
        display: none;
      }
      .icon-star {
        color: #ffa62f;
      }
      h2 {
        width: 170px;
        font-weight: bold;
        font-size: 14px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .card:hover {
      .icon-shoucang {
        display: block;
      }
    }
    .iResponsible,
    .iJoined,
    .recently,
    .filed {
      /* 开始过渡阶段,动画出去阶段 */
      .el-input--suffix {
        input {
          height: 20px;
        
        }  .el-select__caret{
            line-height: 1;
          }
      }
      .fadeds {
        width: 100px;
        height: 100px;
        background: red;
        z-index: 100000;
        position: relative;
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: all 0.5s ease-out;
      }
      /* 进入开始 */
      .fade-enter {
        transform: translateY(-500px);
        opacity: 0;
      }
      /* 出去终点 */
      .fade-leave-active {
        transform: translateY(500px);
        opacity: 0;
      }
      .active {
        color: #3684ff;
      }
      .newCard {
        text-align: center;
        line-height: 120px;
        color: #999999;
      }
      .el-input__inner {
        border: none;
        background: none;
        width: 90px;
      }
      .el-input__inner-placeholder {
        color: red;
      }
      .card {
        margin-right: 22px;
        margin-bottom: 22px;
        .statisticalFigures {
          margin-top: 16px;
          .saveTime {
            font-size: 14px;
            font-weight: normal;
            margin: 28px 0;
          }
          ul {
            li {
              float: left;
              margin-left: 30px;
              font-size: 12px;
              color: #666666;
              position: relative;
              .num {
                font-size: 18px;
                font-weight: bold;
                color: #333333;
              }
            }
            & li:first-child {
              margin-left: 0;
            }
            .line {
              display: inline-block;
              width: 1px;
              height: 10px;
              right: -13px;
              top: 20px;
              background: #f2f2f2;
              position: absolute;
            }
          }
        }
        .participantBottom {
          margin-top: 20px;
          position: relative;
          .moreUser {
            display: flex;
            flex-flow: row;
            .moreThan5 {
              width: 25px;
              height: 25px;
              // float: right;
              margin-right: -12px;
              border: 1px solid #ffffff;
              border-radius: 4px;
              .box_sizing;
              overflow: hidden;
              img {
                //     width: 25px;
                // height: 25px;
                width: 100%;
                height: 100%;
                display: block;
                background: red;
              }
            }
            li {
              float: left;
            }
          }
          .moreButton {
            display: inline-block;
            width: 45px;
            height: 33px;
            position: absolute;
            right: -15px;
            bottom: -11px;
            .el-dropdown {
              width: 100%;
              height: 100%;
              line-height: 25px;
              .el-dropdown-link {
                display: inline-block;
                width: 100%;
                text-align: center;
                height: 100%;
                .icon-gengduo {
                  display: inline-block;
                  width: 100%;
                  text-align: center;
                  height: 100%;
                  text-align: center;
                }
              }
            }
          }
          ul {
            width: 150px;
            // background: pink;
            .lessThan5 {
              width: 25px;
              height: 25px;
              float: left;
              margin-right: 5px;
              border: 1px solid #ffffff;
              border-radius: 4px;
              .box_sizing;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            .nums {
              min-width: 58px;
              margin-left: 27px;
              font-size: 12px;
              color: #666666;
              line-height: 25px;
            }
          }
        }
      }
      .el-message-box {
        width: 352px;
        height: 158px;
        .el-message-box__header {
          text-align: center;
          border-bottom: 1px solid red;
        }
      }
    }
  }
}
</style>

