<template>
  <div id="PMP">
    <div class="enter"
         v-if="enterShow">
      <p class="tittle">HI {{name}}！欢迎使用Eggs</p>
      <div>您可以利用Eggs强大的团队协作和成果展示功能，帮助团队提高工作效率</div>
      <div class="video">
        <video controls
               poster
               src="../../assets/img/IMG_2156.mp4">
        </video>
      </div>
      <div class="main_button_bg"
           @click="enterLogin">我知道了，进入项目</div>
    </div>
    <transition name="fade1">
      <List v-if="!enterShow"></List>
    </transition>
    <Template></Template>
  </div>
</template>
<script>
import List from "./common/list";
import Template from "./common/template";
export default {
  components: { List, Template },
  data() {
    return {
      enterShow: '',
      name: 'zhaoke',
      userId: '',
      myUserId: '',
    };
  },
  methods: {
    enterLogin() {
      this.enterShow = false;
      let data = { 'userId': this.userId };
      this.$HTTP('post', '/user_update_isHomeVideo', data).then(res => {
      })
    },
    // 同意添加好友
    agreeJoin(myUserId, friendsUserId) {
      let obj = { myUserId: myUserId, friendsUserId: friendsUserId };
      this.$HTTP('post', '/user_friends_add', obj).then(res => {
        console.log(res)
      })
    },
    // 获取个人信息
    getInfo(userpkid) {
      let data = { userPkid: userpkid };
      this.$HTTP("post", "/user_get", data).then(res => {
        localStorage.setItem("staffInfo", JSON.stringify(res.result));
      });
    },
  },

  created() {
    let staffInfo = JSON.parse(localStorage.getItem('staffInfo'));
    this.enterShow = staffInfo.isHomeVideo; 
    this.name = staffInfo.realName;
    this.userId = staffInfo.userPkid;
    let urls = decodeURI(window.location.href).split("?")[1];
    if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      if (url[0].split("=")[0] == 'userId') {
        let userId = url[0].split("=")[1];
        this.getInfo(userId);
      } else {
        this.userId = staffInfo.userPkid;
        this.myUserId = url[0].split("=")[1];
        this.type = url[1].split("=")[1];
        this.id = url[2].split("=")[1];
        if (this.userId !== this.myUserId) {
          this.agreeJoin(this.userId, this.myUserId);
        }
      }
    }
  }
};
</script>

<style lang="less" >
@import "../../assets/css/base.less";

#PMP {
  position: relative;
  height: 100%;
  width: 100%;
  background: #fafafa;
  overflow: hidden;
}
.enter {
  width: 100%;
  max-height: 90%;
  text-align: center;
  margin: 50vh auto 0;
  transform: translateY(-56%);
  .tittle {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .video {
    margin: 20px auto;
    height: 100%;
    video {
      width: 55%;
    }
  }
}
</style>

