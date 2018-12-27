<template>
  <div id="top_k"
       class="clearfix">
    <span class="personImg">
      <img src="../../assets/img/egLogo_small.png"
           class="company_logo"
           alt="">
    </span>
    <div class="otherButton fr">
      <ul>
        <span ref='userInfo'>
          <li class="last">
            {{staffInfo.realName}}
            <i class="iconfont icon-unfold"></i>
          </li>
          <li class="last"
              @click="setListShow=!setListShow">
            <img :src="staffInfo.pic"
                 class="userImg"
                 alt="">
          </li>
        </span>
        <li>
          <i class="iconfont  icon-shuaxin"></i>
        </li>
        <li>
          <i class="iconfont icon-tongzhi"></i>
        </li>
        <li @click="friend">
          <i class="iconfont icon-haoyouliebiao"></i>
        </li>
      </ul>
      <transition name='info'>
        <ul class="setList user-info"
            style=""
            v-show="setListShow">
          <router-link tag='li'
                       to='/myCenter'>个人中心</router-link>
          <li>系统设置</li>
          <li>问题反馈</li>
          <li @click="exitLogin">退出登录</li>
        </ul>
      </transition>
    </div>
  </div>
</template>
<script>
import { setCookie } from '../../api/cookie';

export default {
  components: {},
  data() {
    return {
      staffInfo: "",
      createrId: "",
      setListShow: false
    };
  },

  methods: {
    friend() {
      this.$router.push("/friend");
    },
    // 退出登录
    exitLogin() {
      localStorage.setItem("staffInfo", "");
      setCookie('RememberYourPassword', 0);
      this.$router.push("/login");
    },
    // 获取个人信息
    getInfo(userpkid) {
      let data = { userPkid: userpkid };
      this.$HTTP("post", "/user_get", data).then(res => {
        localStorage.setItem("staffInfo", JSON.stringify(res.result));
        this.staffInfo = res.result;
        this.createrId = this.staffInfo.userPkid;
      });
    },
  },
  created() {
    if (localStorage.getItem("staffInfo")) {
      this.staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
    }

    let urls = decodeURI(window.location.href).split("?")[1];
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
      }
    }
  },
  mounted() {
    let _this = this;
    document.addEventListener("click", function (e) {
      if (_this.$refs.userInfo) {
        if (!_this.$refs.userInfo.contains(e.target)) {
          _this.setListShow = false;
          return;
        }

      }
      _this.setListShow = true;
    });
  }
};
</script>
<style lang='less'>
@import "../../assets/css/base.less";

#top_k {
  width: 100%;
  height: 100%;
  .serchBox {
    width: 65%;
    padding: 0 30px;
    .box_sizing;
    height: 100%;
    line-height: 60px;
    color: #666;
    input {
      width: calc(100% - 40px);
    }
  }
  .personImg {
    display: inline-block;
    width: 166px;
    height: 100%;
    line-height: 50px;
    text-align: center;
    // box-shadow: -1px 0px 4px 0px rgba(95, 95, 95, 0.3);
    img {
      width: 86px;
      vertical-align: middle;
    }
  }
  .otherButton {
    width: 35%;
    height: 100%;
    padding: 13px 0;
    line-height: 24px;
    .box_sizing;
    padding-right: 20px;

    li {
      float: right;
      min-width: 55px;
      text-align: center;
      border-right: 1px solid #f2f2f2;
      cursor: pointer;
    }
    .last {
      border: none;
      color: #333333;
      .userImg {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        .border_radius(@br: 3px);
        background: red;
      }
    }
    .setList {
      position: absolute;
      right: 23px;
      top: 50px;
      width: 110px;
      height: 134px;
      background: #fff;
      border: 1px solid #e5e5e5;
      box-shadow: 0 1px 4px 0 rgba(59, 81, 133, 0.3);
      li {
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        float: left;
        border: none;
        width: 110px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
      }
      li:hover {
        background: #f2f2f2;
      }
    }
    .info-enter,
    .info-leave-active {
      opacity: 0;
      transform: translate3d(0, 20%, 0);
    }
    .info-enter,
    .info-leave-active {
      transition: all 0.5s cubic-bezier(0.4, 0, 0, 1.5);
    }
  }
}
</style>


