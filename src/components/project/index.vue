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
      enterShow: true,
      name: 'zhaoke',
      userId: '',

    };
  },
  methods: {
    newPro() {
      console.log('ee')
    },
    enterLogin() {
      this.enterShow = false;
      let data = { 'userId': this.userId }
      this.$HTTP('post', '/user_update_isHomeVideo', data).then(res => {

      })
    },
  },

  created() {
    let staffInfo = JSON.parse(localStorage.getItem('staffInfo'))
    this.enterShow = staffInfo.isHomeVideo;
    this.name = staffInfo.realName;
    this.userId = staffInfo.userPkid;
  }
};
</script>

<style lang="less" >
@import "../../assets/css/base.less";

#PMP {
  position: relative;
  height: 100%;
}
.enter {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -350px;
  bottom: 0;
  margin-top: -230px;
  .box_sizing;
  text-align: center;
  .tittle {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .video {
    margin: 20px auto;
    width: 695px;
    height: 390px;
    video {
      height: 100%;
    }
  }
  @media screen and (max-height: 1366px) {
    .video {
      margin: 20px auto;
      width: 695px;
      height: 320px;
      video {
        // width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

