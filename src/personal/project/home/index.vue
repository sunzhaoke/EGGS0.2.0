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

export default {
  components: {
    leftNav,
    topBar
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
        console.log(res);

      })
    }
  },
  created() {
    if (localStorage.getItem("staffInfo")) {
      this.userId = JSON.parse(localStorage.getItem("staffInfo")).userPkid;
      return
    }
    let urls = decodeURI(window.location.href).split("?")[1];
    console.log(url, '===============================')
    if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      if (url[0].split("=")[0] == 'userId') {
        let userId = url[0].split("=")[1];
        this.getInfo(userId);
      } else {
        this.myUserId = url[0].split("=")[1];
        this.type = url[1].split("=")[1];
        this.id = url[2].split("=")[1];
        if (this.userId !== this.myUserId) {
          this.agreeJoin(this.userId, this.myUserId);
        }
      }
    }
  },
};
</script>
<style lang='less'>
@import "../../../assets/css/base.less";

.bigBox_k {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .leftNav_k {
    z-index: 10;
    width: 166px;
    height: 100%;
    background: #ffffff;
    box-shadow: -1px 0px 4px 0px rgba(95, 95, 95, 0.3);
    position: fixed;
    top: 50px;
    left: 0;
  }
  .topBar_k {
    z-index: 11;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    height: 50px;
    background: #ffffff;
    box-shadow: 1px 0px 4px 0px rgba(95, 95, 95, 0.3);
  }
  .maiContent {
    height: calc(100% - 50px);
    width: calc(100% - 166px);
    margin-left: 166px;
    margin-top: 50px;
    .box_sizing;
    background: #ffffff;
    overflow: hidden;
  }
}
</style>

