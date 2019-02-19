<template>
  <div id="top_k"
       class="clearfix">
    <img src="../../assets/img/egLogo_small.png"
         class="company_logo  "
         alt="">
    <div class="otherButton fr clearfix">
      <ul class="clearfix">
        <span ref='userInfo'>
          <li class="last">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                {{staffInfo.realName ? staffInfo.realName : 'Happy work'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link tag="li"
                               to='/myCenter'>
                    个人中心
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>系统设置</el-dropdown-item>
                <el-dropdown-item>问题反馈</el-dropdown-item>
                <el-dropdown-item @click.native="exitLogin">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="last">
            <img :src="staffInfo.pic"
                v-if='staffInfo.pic'
                 class="userImg"
                 alt=""
                 >
            <img src="../../assets/img/load.gif"
              v-else
                 class="userImg"
                 alt=""
                 >
          </li>
        </span>
        <li>
          <el-tooltip effect="dark" content="刷新" placement="top" :open-delay="300">
            <i class="iconfont  icon-shuaxin" @click="refresh"></i>
          </el-tooltip>
        </li>
        <li class="notice_icon">
          <el-tooltip effect="dark" content="消息通知" placement="top" :open-delay="300">
            <i class="iconfont icon-tongzhi" @click.stop='clickNotice'></i>
          </el-tooltip>
          <span v-if="Number(unreadNum)" class="unread" @click.stop='clickNotice'>{{unreadNum > 99 ? '···' : unreadNum}}</span>
          <transition name="fade1">
            <notice-page 
              v-if='noticeShow' 
              @enterAll='enterAll'
              />
          </transition>
        </li>
        <li @click="friend">
          <el-tooltip effect="dark" content="好友管理" placement="top" :open-delay="300">
            <i class="iconfont icon-haoyouliebiao"></i>
          </el-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import noticePage from "../notice";
import { mapState } from 'vuex';
import { setCookie } from '../../api/cookie';

export default {
  components: {
    noticePage,
  },
  inject: ['reload'],
  data() {
    return {
      staffInfo: "",
      createrId: "",
      setListShow: false,
      noticeShow: false,
    };
  },
  computed: {
    ...mapState(['unreadNum']),
  },
  methods: {
    // 刷新页面
    refresh() {
      this.reload();
    },
    // 消息通知
    clickNotice() {
      if(this.noticeShow) {
        this.noticeShow = false;
      }else {
        this.noticeShow = true;
      }
      let clickHide = e => {
        this.noticeShow = false;
        $(document).unbind("click", clickHide)
      };
      $(document).bind("click", clickHide)
    },
    enterAll() {
      this.noticeShow = false;
    },
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
      let staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
      this.getInfo(staffInfo.userPkid)
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
    // let _this = this;
    // document.addEventListener("click", function (e) {
    //   if (_this.$refs.userInfo) {
    //     if (!_this.$refs.userInfo.contains(e.target)) {
    //       _this.setListShow = false;
    //       return;
    //     }

    //   }
    //   _this.setListShow = true;
    // });
  }
};
</script>
<style lang='less'>
@import "../../assets/css/base.less";

#top_k {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .box_sizing;
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

  .company_logo {
    margin-top: 15px;
    width: 64px;
    vertical-align: middle;
  }
  .otherButton {
    width: 35%;
    height: 100%;
    padding: 11px 0;
    line-height: 24px;
    .box_sizing;
    li {
      float: right;
      min-width: 55px;
      text-align: center;
      border-right: 1px solid #f2f2f2;
      cursor: pointer;
      .iconfont:hover {
        color: @mainColor;
      }
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
      }
      i {
        font-size: 12px;
      }
    }
    
    .notice_icon {
      position: relative;
      .unread {
        position: absolute;
        left: 26px;
        top: -6px;
        line-height: 1;
        display: inline-block;
        padding: 3px;
        min-width: 12px;
        font-size: 12px;
        text-align: center;
        .border_radius(@br: 50%);
        background-color: #ff6173;
        color: #ffffff;
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
      z-index: 101;
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


