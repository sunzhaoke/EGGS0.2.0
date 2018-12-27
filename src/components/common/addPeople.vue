<template>
    <div class="add_people" @click.stop="() => {}">
        <div class="popup">
            <div class="popup_box">
                <div class="popup_top">
                    <i v-if="!invite" class="iconfont icon-return fl" @click.stop="lastStep"></i>
                    <span class="popup_title">{{addInvite ? '邀请新成员' : '好友列表'}}</span>
                    <i class="iconfont icon-guanbijiantou fr" @click.stop="cancel"></i>
                </div>
                <!-- 添加人员 -->
                <div v-if="!addInvite && !invite">
                  <div v-if="treeList.length" class="popup_content">
                    <ul class="three_parths">
                        <li class="parths parths_one">
                            <p class="parths_title">好友列表</p>
                            <el-tree
                                :data="treeList"
                                show-checkbox
                                node-key="pkid"
                                ref="tree1"
                                :default-expanded-keys="[treeList[0].pkid]"
                                :default-checked-keys="defaultTreeKeys"
                                :props="defaultProps"
                                @check-change="treeCheckChange"
                            >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <img class="el_tree_img" v-if="!data.groupName" :src="data.Images" /><span class="el_tree_name">{{ node.label }}</span>
                            </span>
                            </el-tree>

                            
                        </li>
                        <li class="parths parths_two">
                            <p class="parths_title">常用联系人</p>
                            <ul class="parths_list" v-if="usedList.length">
                                <li v-for="list in usedList" :key="list.userid">
                                    <el-checkbox 
                                      :disabled="list.disabled"
                                      v-model="list.checked" 
                                      @change="usedCheckChange(list)"></el-checkbox>
                                    <img class="el_tree_img" :src="list.Images" />
                                    <span class="el_tree_name">{{ list.realname }}</span>
                                </li>
                            </ul>
                            <p class="no_body" v-else>暂无，可在好友管理中添加，系统也会自动生成</p>
                        </li>
                        <li class="parths parths_three">
                            <p class="parths_title">已选列表</p>
                            <ul class="parths_list">
                                <li v-for="(list, index) in selectedList" :key="list.userid" v-if="list.checked && !list.disabled">
                                    <img class="el_tree_img" :src="list.Images" />
                                    <span class="el_tree_name">{{ list.realname }}</span>
                                    <i class="iconfont icon-delete" @click="delCheckChange(list, index)"></i>
                                </li>
                            </ul>
                        </li>
                    </ul>
                  </div>
                  <div v-else class="content_empty">
                      <img src="../../assets/img/noBody.png" alt="">
                      <p>您还没有好友，请点击<span @click="clickInvite">这里</span>邀请朋友加入吧！</p>
                  </div>
                  <div class="popup_bottom">
                      <span class="invite" @click="clickInvite">邀请Ta加入</span>
                      <button 
                        class="fr sure" 
                        :class="disabled ? 'main_button_disabled_bg' : 'main_button_bg'" 
                        :disabled="disabled"
                        @click.stop="addSure"
                      >确定</button>
                      <button class="main_button_color fr" @click.stop="cancel">取消</button>
                  </div>
                </div>
                <!-- 邀请成员 -->
                <ul v-else class="two_parths">
                    <li class="parths parths_one fl">
                        <p class="title">方式一：发送邮件邀请</p>
                        <p class="desc">将发送邀请邮件至对方邮箱</p>
                        <ul class="invite_list">
                          <li v-for="(email, index) in emailList" :key="index">
                            <input 
                            class="invite_input" type="text" placeholder="请输入邮箱账号" 
                            v-model="email.email"
                            @focus="emailFocus(index)"
                            @blur="emailBlur(email)"
                            @input="emailInput(email)"
                           />
                           <span v-if="email.check" class="error">{{email.check}}</span>
                          </li>
                        
                        </ul>
                        <button class="main_button_color" @click="inviteButton">邀请</button>
                    </li>
                    <li class="parths parths_two fl">
                        <p class="title">方式二：发送邀请链接</p>
                        <p class="desc">可自行复制邀请文字和链接发送给对方</p>
                        <p class="send_one">"{{userName}}"邀请您一起完成工作，详情点击</p>
                        <textarea class="send_two" id="copyContent" spellcheck="false">https://www.teambition.com/project/5a9f58b19fae5163d29ed234/tasks/scrum/5a9f58b19fae5163d29ed236</textarea>
                        <button class="main_button_color" @click="copyButton">一键复制</button>
                    </li>
                </ul>
                
            </div>
        </div>
        
        <!-- 温馨提示 -->
        <div class="reminder1" id="remider1" v-if="reminderContent">
          <p class="top">温馨提示</p>
          <p class="content" >{{reminderContent}}</p>
        </div>
        
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  props: ["defaultTreeKeys", "invite"],
  data() {
    return {
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      userName: JSON.parse(localStorage.getItem('staffInfo')).realName, // 当前登录者的名字
      defaultProps: {
        children: "friendsList",
        label: "realname"
      },
      treeList: [], // 好友树状图列表
      usedList: [], // 常用联系人列表
      selectedList: [], // 已选列表
      emailList: [{ email: "", check: "" }, { email: "", check: "" }], // 邀请邮箱列表, 默认有两个
      disabled: false, // 确定按钮是否是禁用
      addInvite: false, // 是否是邀请人员列表
      reminderContent: "", // 温馨提示的内容
      addIdsCopy: [],
      keysList: [],
    };
  },
  computed: {
    ...mapState(["demo"])
  },

  methods: {
    // 点击上一步
    async lastStep() {
      if (this.addInvite) {
        // 邀请页面
        this.addInvite = false;
        this.selectedList = [];
        try {
          await this.getList();
          await this.getUserList();
          !this.invite && await this.setInitChecked(this.keysList);
        }catch(err) {
          console.log(err);
        }
      } else {
        // 列表页面
        // 返回info页面
        this.$emit("handleCancel");

      }
    },

    // 点击取消
    cancel() {
      // 返回info页面
      this.addInvite = false;
      this.$emit("handleCancel", undefined);

    },

    // 确认
    addSure() {
      let obj = this.computedNum();
      let addIds = obj.ids;
      console.log('obj', obj)
      if(addIds && addIds.length) {
      //   if(this.addIdsCopy.sort().join(',') == addIds.sort().join(',')) {
      //     this.$emit("handleCancel", undefined);
      //     return;
      //  };
        this.$emit("handleCancel", {addIds: addIds, arr: obj.arr, invite: false});
      }else {
        this.$emit("handleCancel", undefined);
      }
      
    },

    // 通过 node 设置
    setCheckedNodes(list) {
      for(let i = 0; i < list.length; i++) {
        if(!list[i].checked) {
          list.splice(i, 1);
          i--;
        }
      }
      this.$refs.tree1.setCheckedNodes(list);
    },

    // 初始化页面的时候常用列表和已选列表的状态
    setInitChecked(ids) {
      return new Promise((resolve, reject) => {
        for(let x of ids) {
          x = Number(x);
          for(let ele of this.usedList) {
            if(x == ele.userid) {
              ele.checked = true;
              ele.disabled = true;
            }
          }

          for(let a of this.treeList) {
            for(let b of a.friendsList) {
              if(b.userid == x) {
                b.checked = true;
                b.disabled = true;
                this.selectedList.push(b);
              }
            }
          }
        }
        this.usedList = this.usedList.concat();
        this.setCheckedNodes(this.selectedList);
        resolve(true);
      });

      
    },

    // 点击好友列表
    treeCheckChange(item, state) {
      item.checked = state;
      if(item.groupName) {
      }else {
        this.checkedOne(item);
      }
    },


    // 点击常用联系人
    usedCheckChange(item) {
      this.checkedTwo(item);
    },

    // 点击已选列表
    delCheckChange(item, index) {
      item.checked = false;
      this.selectedList.splice(index, 1);
      this.checkedThree(item);

    },
    
    // 点击好友列表检查
    checkedOne(item) {
      let index1 = this.usedList.findIndex( ele => {
        return ele.userid === item.userid;
      });
      if(index1 != -1) {
        this.usedList[index1].checked = item.checked;
      }

      let index2 = this.selectedList.findIndex( ele => {
        return ele.userid === item.userid;
      });
      if(index2 != -1) {
        this.selectedList[index2].checked = item.checked;
      }else {
         this.selectedList.push(item);
      }
      this.usedList = this.usedList.concat();
      this.selectedList = this.selectedList.concat();
    },

    // 点击常用联系人检查
    checkedTwo(item) {

      let index2 = this.selectedList.findIndex( ele => {
        return ele.userid === item.userid;
      });
      if(index2 != -1) {
        this.selectedList[index2].checked = item.checked;
      }else {
         this.selectedList.push(item);
      }
      this.setCheckedNodes(this.selectedList);
      this.selectedList = this.selectedList.concat();
    },

    // 点击已选列表检查
    checkedThree(item) {
      let index1 = this.usedList.findIndex( ele => {
        return ele.userid === item.userid;
      });
      if(index1 != -1) {
        this.usedList[index1].checked = item.checked;
      }
      this.setCheckedNodes(this.selectedList);
      this.usedList = this.usedList.concat();

    },

    // 确定当前人数，以及添加或删除的人数
    computedNum() {
      let ids = [];
      let arr = [];
      for(let x of this.selectedList) {
        if(x.checked && !x.disabled) {
          ids.push(x.userid);
          arr.push(x);
        }
      }
      if(ids.length) {
        return {ids: ids, arr: arr};
      }
      return;
      if(ids.sort().toString() === this.defaultTreeKeys.sort().toString()) {
        // 人员没用变动
        return null;
      }else {
        // 人员变动：添加/减少
        return ids;

      }
    },

    // 点击‘邀请Ta加入’
    clickInvite() {
      this.addInvite = true;
      let obj = this.computedNum();
      let addIds = obj.ids;
      if(addIds && addIds.length) {
        this.addIdsCopy = addIds;
        this.treeList && this.reminders("已将修改后的人员加至项目中，前往邀请页面");
        this.$emit("handleCancel", {addIds: addIds, arr: obj.arr, invite: true});
        this.keysList = this.keysList.concat(this.defaultTreeKeys);
        this.keysList = this.keysList.concat(addIds);
      }
     
      // this.$emit("handleCancel", addIds);

    },

    // 添加邀请邮箱input聚焦
    emailFocus(index) {
      if (index === this.emailList.length - 1) {
        this.emailList.push({ email: "", check: "" });
      }
    },

    // 添加邀请邮箱input失焦
    emailBlur(email) {
      if (email.email === "") {
        return;
      }
      let reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!reg.test(email.email)) {
        email.check = "邮箱格式错误";
        return;
      }
      // 验证此邮箱是否已经是好友
      let obj = {
        userId: JSON.parse(localStorage.getItem('staffInfo')).userPkid,
        email: email
      }
      this.$HTTP('post', '/user_friends_exists_email', obj).then(res => {
        console.log('邮箱是否存在验证', res);
        if(!res.result) {
          email.check = "此邮箱已存在";
        }
      }).catch(err => {
        console.log('请求失败', err);
      });
    },

    // 添加邀请邮箱input事件
    emailInput(email) {
      if (email.check) {
        email.check = "";
      }
    },

    // 点击邀请按钮
    inviteButton() {
      let emails = [];
      for (let ele of this.emailList) {
        if (ele.check) {
          return;
        }
        if (ele.email) {
          emails.push(ele.email);
        }
      }

      if (emails.length) {
        emails = [...new Set(emails)];
        console.log(emails);
        this.$emit('handleInvite', emails);
        
        this.reminders("您的邀请已发送成功");
      } else {
        this.reminders("您还没有输入邀请邮箱");
      }
    },

    // 点击一键复制
    copyButton() {
      let linkCopy = document.getElementById("copyContent");
      linkCopy.select(); // 选择对象
      if (document.execCommand("Copy", false, null)) {
        //success info
        this.reminders("已复制到剪贴板，赶快粘贴发送给好友吧");
      } else {
        //fail info
      }
    },

    // 温馨提示
    reminders(text) {
      this.reminderContent = text;
      setTimeout(() => {
        this.reminderContent = "";
      }, 3000);
    },

    // 获取好友分组列表
    getList() {
      return new Promise((resolve, reject) => {
        let obj = {
          myUserId: this.userPkid
        }
        this.$HTTP('post', '/user_friends_getlist', obj).then( res => {
            this.treeList = [...res.result];
            for(let x of this.treeList) {
                x.realname = x.groupName;
                x.friendsList.map(ele => {
                    return (ele.checked = false) && (ele.disabled = true);
                });
            }
            console.log('好友分组列表', this.treeList);
            resolve(this.treeList);
        }).catch( err => {
            console.log('获取好友分组列表失败', err);
            reject(err);
        });
      });
        
    },
    // 获取常用联系人列表
    getUserList() {
      return new Promise((resolve, reject) => {
        this.usedList = [];
        this.usedList = [];
         this.usedList.map(ele => {
            return (ele.checked = false) && (ele.disabled = true);
          });
        resolve(this.usedList);
        return;
        let obj = {
            myUserId: this.userId
        }
        this.$HTTP('post', '/user_friends_getlist', obj).then( res => {
            this.usedList = [...res.result];
            console.log('常用联系人列表', this.usedList);
            resolve(this.usedList);
        }).catch( err => {
            console.log('获取常用联系人列表失败', err);
            reject(err);
        });
      });
        
    },
  },
  async created() {
    try {
      await this.getList();
      await this.getUserList();
      !this.invite && await this.setInitChecked(this.defaultTreeKeys);
    }catch(err) {
      console.log(err);
    }
  }
};
</script>
<style lang="less">
@import "../../assets/css/base.less";
.add_people {
  .popup {
    .popup_box {
      width: 800px;
      height: 540px;
    }
    .popup_content {
      width: 800px;
      min-height: 100px;
      height: 415px;

      .three_parths {
        width: 100%;
        height: 415px;
        .parths {
          width: 33.33%;
          height: 100%;
          float: left;
          .parths_title {
            margin-top: 20px;
            margin-left: 82px;
            margin-bottom: 18px;
            font-weight: bold;
          }
          .parths_list {
            width: 210px;
            height: 340px;
            overflow: auto;
            margin: 0 auto;
            li {
              height: 32px;
              line-height: 32px;
              padding-left: 40px;
              .box_sizing;
              .cur;
              &:hover {
                background: @bg-f2f2f2;
              }
            }
            .el_tree_img {
              margin: 0 10px;
            }
          }
          .el_tree_img {
            display: inline-block;
            width: 20px;
            height: 20px;
            .border_radius(@br: 2px);
            vertical-align: middle;
            margin: 0 13px;
          }
          .el_tree_name {
            vertical-align: middle;
            display: inline-block;
            width: 100px;
            .word_over;
          }

          &:nth-of-type(2) {
            border-left: 1px solid @bg-f2f2f2;
            border-right: 1px solid @bg-f2f2f2;
            .box_sizing;
          }

          .no_body {
            color: @grayNight;
            text-align: left;
            padding: 0 55px;
            line-height: 2;
            margin-top: 120px;
          }
        }
        .parths_one {
          .parths_title {
            margin-left: 55px;
            text-align: left;
          }
          .el-tree {
            width: 200px;
            margin-left: 45px;
            max-height: 340px;
            overflow: auto;
            .el-tree-node__children .el-checkbox {
              margin-right: 0;
            }
          }
        }

        .parths_two {
           .el_tree_name {
              width: 100px;
          }
        }

        .parths_three {
          .parths_list li {
            .iconfont {
              display: none;
              font-size: 14px;
              .cur;
              color: @mainColor;
            }
            .el_tree_img {
              margin-left: 0;
            }
          }
          .parths_list li:hover {
            .iconfont {
              display: inline-block;
            }
          }
        }
      }
    }

    .content_empty {
      width: 800px;
      min-height: 100px;
      text-align: center;
      img {
        margin-top: 73px;
        margin-bottom: 50px;
      }
      p {
        margin-bottom: 60px;
        span {
          padding: 0 10px;
          color: @mainColor;
          vertical-align: middle;
          .cur;
          &:hover {
            color: @mainHover;
            text-decoration: underline;
          }
        }
      }
    }

    .popup_bottom {
      height: 70px;
      line-height: 71px;
      border-top: 1px solid @bg-f2f2f2;

      .invite {
        color: @mainColor;
        margin-left: 26px;
        .cur;
        &:hover {
          color: @mainHover;
          text-decoration: underline;
        }
      }

      button {
        margin-top: 20px;
      }

      .sure {
        margin-right: 26px;
        margin-left: 20px;
      }
    }

    .two_parths {
      width: 100%;
      height: 485px;
      .parths {
        width: 50%;
        height: 100%;
        text-align: center;
        // padding: 23px 0 122px 0;
        // .box_sizing;

        .title {
          font-weight: bold;
          margin-top: 23px;
        }

        .desc {
          color: @grayNight;
          font-size: 12px;
          margin-top: 12px;
        }
      }
      .parths_one {
        border-right: 1px solid @bg-f2f2f2;
        .box_sizing;

        .invite_list {
          margin: 30px auto;
          height: 150px;
          overflow: auto;
          width: 280px;
          li {
            height: 50px;
            text-align: center;
            position: relative;
            .invite_input {
              width: 250px;
              height: 30px;
              border-bottom: 1px solid @grayNight;
              padding: 0 10px;
              .box_sizing;
              &::placeholder {
                color: @grayNight;
              }
            }

            .error {
              position: absolute;
              top: 34px;
              left: 24px;
              color: red;
              font-size: 12px;
            }
          }
        }
        .main_button_color {
          margin-top: 60px;
        }
      }
      .parths_two {
        .send_one {
          padding: 0 24px;
          line-height: 1.7;
          height: 50px;
          margin-top: 40px;
          .cur;
          .box_sizing;
          // .word_over2;
         .wold_overN(2);
        }
        .send_two {
          display: block;
          resize: none;
          border: none;
          width: 240px;
          height: 100px;
          overflow: auto;
          margin: 40px auto;
          margin-top: 4px;
          line-height: 2;
          font-size: 12px;
          word-break: break-all;
          text-align: center;
          .cur;
        }
        .main_button_color {
          margin-top: 36px;
        }
      }
    }
  }
}
</style>

