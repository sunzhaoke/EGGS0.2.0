<template>
  <div class="loginBox">
    <div class="bgSvg_k">
      <div class="grid_ke"></div>
      <div class="svg"></div>
    </div>
    <div class="topNav">
      <img src="../../assets/img/egLogo_small.png"
           class="company_logo"
           alt="">
      <router-link to="/login"
                   class="logon"
                   tag="span">登录</router-link>
      <span class="register"
            @click="register">注册</span>
    </div>
    <div class="main_box">
      <div class="main clearfix">
        <p>账户密码登录</p>
        <div class="email_div box">
          <span class="hint"
                v-show="hintEmail">请输入邮箱账号</span>
          <input type="text"
                 :placeholder="emPlace"
                 :class="errorName?'inputBoxBlur':'inputBox'"
                 ref="email"
                 v-model="email"
                 v-on:blur="autofocusEm(email)"
                 @focus="emailFocus">
        </div>
        <div class="passwrod_div box">
          <span class="hint"
                v-show="hintPw">请输入密码</span>
          <input type="password"
                 :placeholder="pwPlace"
                 :class="errorPassWord?'inputBoxBlur':'inputBox'"
                 class="inputBox"
                 v-model="passWord"
                 @focus="pwFocus"
                 v-on:blur="pwBlur()"
                 @keyup.enter="enterLogin">
          <span class="error_title"
                v-if="errorTitle">{{errorTitle}}
            <!-- router-link -->
            <router-link class="mainColor"
                         v-show="errorTitle=='该邮箱尚未注册,点击'"
                         to="/register"
                         tag='a'> 前往注册</router-link>
          </span>

        </div>
        <div style="color: #999999;margin-top: 30px">
          <el-checkbox v-model="checked"
                       style="color:#a0a0a0"
                       class="next">下次自动登录</el-checkbox>
          <div class="fr">
            <span class="forgetPassword cur "
                  @click="forgetPwd">忘记密码？</span>
            <span class="line"></span>
            <span class="register cur"
                  @click="register()">注册</span>
          </div>

        </div>
        <span class="loginButton"
              @click="enterLogin"
              v-if='email&&passWord'>确认登录 →</span>
        <span class="loginButtonNo cur"
              v-else> 确认登录 →</span>

        <p class="otherType">你也可以用以下方式登录</p>
        <a href="http://server.apexgame.cn/wecharCode.ashx"
           class="weixin cur">
          <i class="iconfont icon-weixin1"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { setCookie, getCookie } from "../../api/cookie";

export default {
  data() {
    return {
      email: "",
      emPlace: "请输入邮箱账号",
      pwPlace: "请输入密码",
      passWord: "",
      checked: false,
      errorTitle: "", // 错误提示
      hintEmail: false, //邮箱提示信息显示
      hintPw: false, //密码提示信息显示
      myUserId: "",
      type: "",
      id: "",
      goUrl: "1111", //跳转url
      errorName: false, //账号 是否错误
      errorPassWord: false  //密码 是否错误
    };
  },

  watch: {
    email(val) {
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
    if (getCookie("loginEmail")) {
      this.email = getCookie("loginEmail");
    }
  },

  methods: {
    //      点击注册 跳转注册页
    register() {
      setCookie("registerEmail", "");
      this.$router.push("/register");
    },
    //      点击忘记密码
    forgetPwd() {
      setCookie("loginEmail", this.email);
      this.$router.push("/forgetPwd");
    },

    //      邮箱输入框设置
    autofocusEm(email) {
      this.emPlace = "请输入邮箱账号";
      this.hintEmail = false;
      let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
      let reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

      if (email == "") {
        this.errorTitle = "请输入邮箱账号";
        this.errorName = true;
      } else if (!emailReg.test(email) && !reg.test(email)) {
        this.errorTitle = "格式错误，请核对后再输入";
        this.errorName = true;
      } else {
        this.errorTitle = "";
        this.errorName = false;
      }
    },
    emailFocus() {
      this.emPlace = "";
      this.hintEmail = true;
      this.errorTitle = "";
      this.eamilBoderRed = false;
      this.hintPw = false;
      this.errorName = false;
    },
    pwFocus() {
      this.pwPlace = "";
      this.hintEmail = false;
      this.hintPw = true;
      this.errorPassWord = false;
      this.errorTitle = "";
    },
    pwBlur() {
      this.pwPlace = "请输入密码";

      this.hintPw = false;
      if (this.passWord) {
        this.errorPassWord = false;

      } else {
        this.errorPassWord = true;
        this.errorTitle = "请输入密码";
      }
    },
    enterLogin() {
      this.hintPw = false;
      this.hintEmail = false;
      if (this.email == "" || this.passWord == "") {
        this.errorTitle = "请输入用户名或密码";
        return;
      } else {
        var email = this.email;
        var pass = this.passWord;
        let data = { userName: this.email, pwd: this.passWord };
        // 个人账号
        this.$HTTP("post", "/user_login", data, $('.loginBox')[0])
          .then(res => {
            if (res.code == 200) {
              if (this.myUserId) {
                console.log(1)
                this.$router.push({
                  path: "/project",
                  query: { myUserId: this.myUserId, type: this.type, id: this.id }
                });
              } else {
                this.$router.push({ path: "/project" });
              }
              if (this.checked) {
                setCookie('RememberYourPassword', this.email, 30 * 24 * 60 * 60 * 1000)
              } else {
                setCookie('RememberYourPassword', this.email, 1 * 24 * 60 * 60 * 1000)
              }
              localStorage.setItem("staffInfo", JSON.stringify(res.result));
            } else if (res.code == 3) {
              this.errorTitle = "该邮箱尚未注册,点击";
            } else {
              this.errorTitle = "密码输入错误，请核对后再输入";
            }
          })
          .catch(err => {
            this.$messge("登录失败");
          });
      }
    },

  },
  computed: {},
  created() {
    let staffInfo = localStorage.getItem('staffInfo');
    if (localStorage.getItem("registerEmail")) {
      this.email = localStorage.getItem("registerEmail");
    }
    let urls = decodeURI(window.location.href).split("?")[1];
    if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      this.myUserId = url[0].split("=")[1];
      this.type = url[1].split("=")[1];
      this.id = url[2].split("=")[1];
      this.$router.push({
        path: "/project",
        query: { myUserId: this.myUserId, type: this.type, id: this.id }
      });
    } else if (staffInfo && getCookie('RememberYourPassword')) {
      this.$router.push('/');
    }
  },
  mounted() {
  },

};
</script>

<style lang="less">
@import "../../assets/css/base.less";
@import "../../assets/css/media.less";
a:hover {
  // color: red;
  text-decoration: none;
}
.bgSvg_k {
  width: 1200px;
  height: 600px;
  position: absolute;
  left: 50%;
  margin-left: -600px;
  top: 50%;
  margin-top: -300px;
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

.loginBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
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
      height: 400px;
      padding: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -158px;
      margin-top: -200px;
      z-index: 9999;
      background: #ffffff;
      p {
        text-align: center;
        margin-bottom: 18px;
        font-size: 18px;
      }
      .box {
        height: 50px;
        position: relative;

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
        .inputBoxBlur {
          width: 317px;
          border-bottom: 1px solid red;
          padding: 0 10px 10px 10px;
          .box_sizing;
          position: absolute;
          bottom: 0;
        }
      }
      .error_title {
        position: absolute;
        color: red;
        bottom: -20px;
        left: 10px;
        font-size: 12px;
        a {
          text-decoration: underline;
        }
      }
      .line {
        width: 1px;
        height: 13px;
        display: inline-block;
        background: #666;
        margin: 0 5px;
      }
      .forgetPassword:hover {
        color: #3684ff;
      }

      // .step {
      //   text-align: center;
      //   line-height: 35px;
      //   display: block;
      //   width: 317px;
      //   height: 35px;
      //   border-radius: 6px;
      //   border: 1px solid #999;
      //   margin: 40px auto 0;
      //   cursor: pointer;
      //   background: #ffffff;
      // }
      // .step:hover {
      //   background: #f5f5f5;
      // }
      .otherType {
        font-size: 14px;
        color: #999;
        margin-top: 70px;
      }
      .weixin {
        width: 40px;
        height: 40px;
        display: block;
        border: 1px solid #999;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        margin: 0 auto;
        i {
          font-size: 20px;
        }
      }
      .weixin:hover {
        border: 1px solid #00c90b;
        i {
          color: #00c90b;
        }
      }
    }
  }
}
</style>
