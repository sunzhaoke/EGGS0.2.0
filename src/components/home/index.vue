<template>
  <div class="bigBox_k clearfix">
    <div class="leftNav_k fl">
      <left-nav></left-nav>
    </div>
    <div class="topBar_k fl">
      <top-bar></top-bar>
    </div>
    <div class="maiContent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import leftNav from "../common/left";
import topBar from "../common/topBar";
import noticeAll from "../notice/noticeAll";
import { setCookie, getCookie } from '../../api/cookie';

export default {
  components: {
    leftNav,
    topBar,
    noticeAll
  },
  data() {
    return {
      userId: '',
    };
  },
  methods: {
    // 获取个人信息
    getInfo(userpkid) {
      let data = { userPkid: userpkid };
      this.$HTTP("post", "/user_get", data).then(res => {
        localStorage.setItem("staffInfo", JSON.stringify(res.result));
      });
    },
    // 同意添加好友
    agreeJoin(myUserId, friendsUserId) {
      let obj = { myUserId: myUserId, friendsUserId: friendsUserId };
      this.$HTTP('post', '/user_friends_add', obj).then(res => {
        console.log(res)
      })
    },

  },
  created() {
    if (window.location.href) {
      var urls = decodeURI(window.location.href).split("?")[1];
    }
    let RememberYourPassword = getCookie('RememberYourPassword');
    // return
    // 1.状态1 如果有自动登录并且保存数据
    if (localStorage.getItem("staffInfo") && getCookie('RememberYourPassword') && !urls) {
      var staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
      // this.$router.push("/project");
      this.userId = staffInfo.userPkid;
      // 2.有链接地址
    } else if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      if (url[0].split("=")[0] == 'userId') {
        console.log(this.userId, this.myUserId, '1 kankan加好友没有')
        let userId = url[0].split("=")[1];
        this.getInfo(userId);
      } else {
        this.userId = staffInfo.userPkid;
        this.type = url[1].split("=")[1];
        // 1.通过好友列表进入的
        // 2.通过项目进入
        // 3.通过任务片段进入
        // console.log(this.userId, this.myUserId, '2 kankan加好友没有')
        this.myUserId = url[0].split("=")[1];
        this.id = url[2].split("=")[1];
        if (this.userId !== this.myUserId) {
          this.agreeJoin(this.userId, this.myUserId);
        }
      }
      // 没有链接地址 没有自动登录
    } else {
      this.$router.push("/login");
    }
  },

};
</script>
<style lang='less'>
@import "../../assets/css/base.less";

.bigBox_k {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .leftNav_k {
    z-index: 10;
    width: 100x;
    height: 100%;
    background: #ffffff;
    // box-shadow: -1px 0px 4px 0px rgba(95, 95, 95, 0.3);
    border-right: 1px solid #eeeeee;
    position: fixed;
    top: 50px;
    left: 0;
  }
  .topBar_k {
    z-index: 13;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    height: 50px;
    background: #ffffff;
    // box-shadow: 1px 0px 4px 0px rgba(95, 95, 95, 0.3);
    border-bottom: 1px solid #eeeeee;
  }
  .maiContent {
    height: calc(100% - 50px);
    width: calc(100% - 100px);
    margin-left: 100px;
    margin-top: 50px;
    .box_sizing;
    background: #ffffff;
    position: relative;
    .notice_y {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #ccffff;
      z-index: 100;
    }
  }
}
</style>

