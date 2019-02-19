<template>
  <div id="goBond">
    <div class="bgSvg_k">
      <div class="grid_ke"></div>
      <div class="svg"></div>
    </div>
    <div class="topNav">
      <img src="../../assets/img/egLogo_small.png"
           class="company_logo"
           alt="">
      <span class="logon"
            @click="logIn">登录</span>
      <span class="register"
            @click="register">注册</span>
    </div>
    <div class="main_box">
      <div class="main">
        <p class="title">账号绑定</p>
        <div class="registerList">
          <div class="email_div box">
            <span class="hint"
                  v-show="hintEmail">请输入您的工作邮箱</span>
            <input type="text"
                   :placeholder="empalce"
                   :class="errorEmail?'inputBoxBlur':'inputBox'"
                   v-model="email"
                   v-on:blur="autofocusEm(email)"
                   @focus="emailFocus">
          </div>
          <div class="pwd_div box">
            <span class="hint"
                  v-show="hintPwd">请输入密码</span>
            <input type="password"
                   :placeholder="setPwPlace"
                   :class="errorPwd ?'inputBoxBlur':'inputBox'"
                   v-model="password"
                   v-on:blur="autofocusPw(password)"
                   @focus="pawdFocus"
                   autocomplete="off"
                   maxlength="20">
            <span class="error_title"
                  v-if="erroMessage">{{erroMessage}}</span>
          </div>
        </div>
        <span class="loginButton"
              @click="boundAndLogin"
              v-if='email&&password'>确认登录 →</span>
        <span class="loginButtonNo cur"
              v-else> 确认登录 →</span>
        <span class="goRegister cur"
              @click="goRegister">没有账号？立即创建 </span>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hintEmail: false,
      empalce: "请输入要绑定的账号",
      errorEmail: false,
      email: "", //真实姓名
      hintPwd: false,
      setPwPlace: "请输入密码",
      errorPwd: false,
      password: "",
      erroMessage: ""
    };
  },
  props: ["unionId", 'nickname'],
  methods: {
    //      点击登录 跳转登录页
    logIn() {
      this.$router.push("/login");
    },
    //      点击注册 跳转注册页
    register() {
      setCookie("registerEmail", "");
      this.$router.push("/register");
    },
    // 绑定并登录
    boundAndLogin() {
      this.autofocusEm();
      this.autofocusPw();
      if (this.erroMessage == "") {
        this.emailExists(this.email);
        let data = {
          email: this.email,
          pwd: this.password,
          unionid: this.unionId,
          nickname: this.nickname
        };
        this.$HTTP("post", "/user_update_bindwx", data).then(res => {
          console.log(res);
          if (res.code == 2) {
            this.erroMessage = '密码输入错误，请核对后再输入';
          } else if (res.code == 3) {
            this.erroMessage = '该邮箱尚未注册';
          } else if (res.code == 200) {
            localStorage.setItem("staffInfo", JSON.stringify(res.result));
            this.$router.push('/project/projectManage');
            this.$message('账号绑定成功');
          }
        });
      }
    },
    goRegister() {
      this.$router.push("/register");
    },

    //  邮箱输入框设置
    autofocusEm(email) {
      this.empalce = "请输入您的工作邮箱";
      this.hintEmail = false;
      if (this.email == "") {
        this.errorEmail = true;
        this.erroMessage = "请输入您的工作邮箱";
        return false;
      } else {
        let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
        if (!emailReg.test(this.email)) {
          this.erroMessage = "请输入正确的邮箱格式";
          this.errorEmail = true;
          return false;
        } else {
          this.erroMessage = "";
          this.errorEmail = false;
        }
      }
    },
    emailFocus() {
      this.errorEmail = false;
      this.erroMessage = "";
      this.empalce = "";
      this.hintEmail = true;
    },
    //      3.失焦事件
    autofocusPw() {
      this.setPwPlace = "请设置密码";
      this.hintPwd = false;
      this.triangleShow = false;
      if (this.password == "") {
        this.erroMessage = "请输入密码";
        this.errorPwd = true;
        return;
      }
    },
    //      1.获取焦点事件
    pawdFocus() {
      this.errorPwd = false; //输入密码框底边红框
      this.setPwPlace = "";
      this.erroMessage = "";
      this.hintPwd = true;
      this.triangleShow = true; //密码信息提示框
    },
    // 判断邮箱是否存在
    emailExists(email) {
      let datas = { info: email };
      this.$HTTP("post", "/user_exists_info", datas).then(res => {
        if (res.code == 200) {
          // 1.判断邮箱不存在
          this.erroMessage = "您输入的账号不存在，请重新输入";
          return;
        } else if (res.code == 1) {
          // 2.如果已存在
          this.erroMessage = "";
        }
      });
    }
  },
  created() { }
};
</script>
<style lang='less'>
@import "../../assets/css/base.less";
#app {
  width: 100%;
  height: 100%;
}
#goBond {
  height: 100%;
  background: #ffffff;
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
      z-index: 1;
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
    .logon::after {
      content: "";
      width: 10px;
      height: 10px;
      background: red;
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
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -160px;
      margin-top: -160px;
      z-index: 2;
      background: #ffffff;
      text-align: center;
      .title {
        font-size: 18px;
        color: #333333;
        margin-bottom: 30px;
      }
      .registerList {
        position: relative;
        .box {
          height: 50px;
          position: relative;
          .hint {
            font-size: 12px;
            padding-left: 10px;
            position: absolute;
            left: 0;
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
            left: 0;
          }
          .inputBoxBlur {
            width: 317px;
            border-bottom: 1px solid red;
            padding: 0 10px 10px 10px;
            .box_sizing;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .Triangle {
            left: 50%;
            margin-left: -5px;
            top: 40px;
            position: absolute;
            width: 10px;
            height: 10px;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg); /* IE 9 */
            -moz-transform: rotate(45deg); /* Firefox */
            -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
            -o-transform: rotate(45deg); /* Opera */
            background: #ffffff;
            border-left: 1px solid #e0e0e0;
            border-top: 1px solid #e0e0e0;
            z-index: 999;
          }
          .hintMessage {
            padding: 20px 20px 0 20px;
            .box_sizing;
            width: 192px;
            height: 138px;
            left: 50%;
            margin-left: -96px;
            top: 45px;
            border: 1px solid #e0e0e0;
            .border_radius(@br:5px);
            position: absolute;
            z-index: 998;
            font-size: 13px;
            background: #ffffff;
            p {
              margin-bottom: 15px;
            }
          }
        }
      }

      .error_title {
        position: absolute;
        color: red;
        left: 10px;
        font-size: 12px;
        bottom: -20px;
      }
      p {
        line-height: 1.7;
      }
      .goBond {
        margin-top: 40px;
        color: #3684ff;
      }
      img {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: red;
        margin-bottom: 20px;
      }
      .loginButton,
      .loginButtonNo {
        margin: 40px 0 20px 0;
      }

      .goRegister {
        margin-top: 10px;
      }
    }
  }
}
</style>


