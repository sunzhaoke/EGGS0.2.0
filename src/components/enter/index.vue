<template>
  <div id="homeBox">
    <div class="bgSvg_k">
      <div class="grid_ke"></div>
      <div class="svg"></div>
    </div>

    <div class="topNav">
      <img src="../../assets/img/egLogo_small.png"
           class="company_logo"
           height="40px"
           alt="">
      <span class="logon"
            @click="logIn">登录</span>
      <span class="register"
            @click="register">注册</span>
    </div>
    <div class="main_box">
      <div class="main">
        <img src="../../assets/img/egLogo.png"
             width="170px"
             alt="">
        <div class="box">
          <span class="hint"
                v-show="hintEmail">请输入您的工作邮箱</span>
          <input type="text"
                 :placeholder="emPlace"
                 class="inputBox"
                 v-model="email"
                 v-on:blur="autofocusEm(email)"
                 @focus="emailFocus"
                 @keyup.enter="enter">
          <span class="error_title"
                v-if="errorTitle">{{errorTitle}}</span>
          <i class="el-icon-back"
             @click="enter"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setCookie, getCookie } from "../../api/cookie";

export default {
  data() {
    return {
      emPlace: "请输入您的工作邮箱", //em placeholder
      userName: "",
      passWord: "",
      checked: false,
      loginType: false, // 登录账户类型 true是公司账户 false是员工账户
      errorTitle: "", // 错误提示
      email: "",
      hintEmail: false,

      nextPagetwo: false,
      nextPage: false
    };
  },

  watch: {
    userName(val) {
      if (this.errorTitle) {
        this.errorTitle = "";
      }
    },
    passWord(val) {
      if (this.errorTitle) {
        this.errorTitle = "";
      }
    }
  },
  mounted() {
    if (getCookie("Uname")) {
      this.userName = getCookie("Uname");
    }
    if (getCookie("userPwd")) {
      this.passWord = getCookie("userPwd");
    }
    if (this.userName && this.passWord) {
      this.$refs.passWord.focus();
    }
  },
  methods: {
    logIn() {
      this.$router.push("/login");
    },
    register() {
      setCookie("registerEmail", "");
      this.$router.push("/register");
    },
    enter(e) {
      this.autofocusEm(this.email);
      if (this.email && this.errorTitle == "") {
        let data = { Email: this.email };
        this.$HTTP("post", "/UnameEmail", data).then(res => {
          if (res.result == false) {
            console.log(" this.nextPage = true;");
            this.nextPage = true;
          } else {
            console.log(" this.nextPage = false;");
            this.nextPage = false;
          }
        });
        this.$HTTP("post", "/UnameExists", data).then(ress => {
          if (ress.result == false) {
            console.log(" this.nextPagetwo = true;");
            this.nextPagetwo = true;
          } else {
            console.log(" this.nextPagetwo = false;");
            this.nextPagetwo = false;
          }
        });
        let time;
        time = setTimeout(res => {
          if (this.nextPage == true && this.nextPagetwo == true) {
            let t;
            t = setTimeout(res => {
              this.$router.push("/register");
              setCookie("registerEmail", this.email, 1000 * 60);
            }, 2000);
          } else if (this.nextPage == false || this.nextPagetwo == false) {
            this.$router.push("/login");
            setCookie("loginEmail", this.email, 1000 * 60);
          }
        }, 100);
      } else {
        return false;
      }
    },
    //      邮箱输入框设置
    autofocusEm(email) {
      this.hintEmail = false;
      this.emPlace = "请输入您的工作邮箱";
      let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
      if (this.email == "") {
        this.errorTitle = "请输入您的工作邮箱";
      } else if (!emailReg.test(this.email)) {
        this.errorTitle = "请输入正确的邮箱格式";
      } else {
        this.errorTitle = "";
      }
    },
    //      获取焦点事件
    emailFocus() {
      this.emPlace = "";
      this.hintEmail = true;
      this.errorTitle = "";
      this.eamilBoderRed = false;
      this.hintPw = false;
    }
  },
  created() {
    console.log(localStorage.getItem('RememberYourPassword'))
    if (localStorage.getItem('staffInfo') && getCookie('RememberYourPassword')) {
      this.$router.push("/project/projectManage");
    }
  }
};
</script>

<style lang="less">
@import "../../assets/css/base.less";
@import "../../assets/css/media.less";

.bgSvg_k {
  width: 100%;
  height: 100%;
  position: absolute;
  /*left: 50%;*/
  /*margin-left: -600px;*/
  /*top: 50%;*/
  /*margin-top: -300px;*/
  .svg {
    width: 100%;
    height: 100%;
    position: absolute;
    background: url("../../assets/img/bg.svg");
  }
  .grid_ke {
    width: 100%;
    height: 100%;
    background: -webkit-linear-gradient(top, transparent 179px, #f0f0f0 180px),
      -webkit-linear-gradient(left, transparent 179px, #f0f0f0 180px);
    background-size: 180px 180px;
    position: absolute;
    z-index: 1;
  }
}

#homeBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  position: relative;

  .topNav {
    height: 50px;
    width: 100%;
    line-height: 50px;
    z-index: 9999;
    right: 0;
    position: absolute;
    .company_logo {
      display: block;
      height: 30px;
      left: 100px;
      top: 15px;
      position: absolute;
    }
    span {
      position: absolute;
      color: #333333;
      cursor: pointer;
    }
    .logon {
      right: 150px;
    }
    .register {
      right: 100px;
    }
  }
  .main_box {
    height: calc(100vh - 20px);
    width: 100%;
    position: relative;
    .main {
      width: 317px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -158px;
      margin-top: -100px;
      background: #ffffff;
      z-index: 999;
      padding: 20px 0;
      p {
        text-align: center;
        margin-bottom: 25px;
        font-size: 18px;
      }
      .box {
        height: 50px;
        position: relative;
        margin-top: 40px;
        .hint {
          font-size: 12px;
          padding-left: 10px;
          position: absolute;
          bottom: 30px;
          color: #999999;
        }
        .inputBox {
          width: 317px;
          border-bottom: 1px solid #999999;
          padding: 0 10px 10px 10px;
          .box_sizing;
          position: absolute;
          bottom: 0;
        }
        .el-icon-back {
          transform: rotate(180deg);
          cursor: pointer;
          right: 10px;
          bottom: 10px;
          position: absolute;
        }
        .error_title {
          position: absolute;
          color: red;
          bottom: -20px;
          left: 10px;
          font-size: 12px;
        }
      }

      img {
        display: block;
        margin: 0 auto;
      }
    }
  }
}
</style>
