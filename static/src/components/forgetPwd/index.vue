<template>
  <div id="forgetPwd">
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
    <div class="main_box"
         v-if="main_boxShow">
      <div class="main">
        <el-steps :active="active">
          <el-step title="确认账号"></el-step>
          <el-step title="安全验证"></el-step>
          <el-step title="重置密码"></el-step>
        </el-steps>
        <!--步骤一 确认账号 -->
        <div class="getPwd"
             v-show="checkIndex==0">
          <div class="email_div box">
            <span class="hint"
                  v-show="hintEmail">请输入注册的邮箱账号</span>
            <input type="text"
                   :placeholder="emailPlac"
                   class="inputBox"
                   v-model="email"
                   v-on:blur="autofocusEm(email)"
                   @focus="emailFocus">
            <span class="error_title"
                  v-if="erroMessage">{{erroMessage}}</span>
          </div>
          <div class="button">
            <span class="step fr"
                  @click="next(1)">→</span>
          </div>
        </div>

        <!--步骤二 发送邮件-->
        <div class="sendEmail"
             v-show="checkIndex==1">
          <!-- defaults -->
          <div class=""
               v-if="defaults">
            <p class="title">为了保护账号安全，需要验证邮箱有效性</p>
            <p>点击下方按钮，将会发送验证码到您的邮箱</p>
            <p>{{otherEmail}}</p>
            <div class="button">
              <span class="step fr"
                    @click="next('one')">发送邮件 →</span>
            </div>
          </div>
          <div class="sendEmailTwo"
               v-else>
            <p class="sendToEmail">验证码已发送到邮箱</p>
            <p>{{otherEmail}}</p>
            <div class="getCodeBox box">
              <input type="text"
                     :placeholder="verificationCode"
                     :class="errorCode?'inputBoxBlur':'inputBox'"
                     v-model="emailCode"
                     v-on:blur="autofocusCode(emailCode)"
                     @focus="codeFocus">
              <el-button class="getCode cur"
                         v-if="getcodeShow"
                         @click="getCode">获取验证码</el-button>
              <span class="getCodes cur"
                    v-else>{{countdownTime}}</span>
            </div>
            <div class="getCodeBox box"
                 v-show='imgCodeShow'>
              <span class="hint"
                    v-show="hintimgCode">请输入右图验证码</span>
              <input type="text"
                     :placeholder="imgCode"
                     :class="imgCodes?'inputBoxBlur':'inputBox'"
                     v-model="imgCodeMain"
                     v-on:blur="autofocusImgCode(emailCode)"
                     @focus="imgcodeFocus">
              <span class="imgCode"
                    id="validate">{{imgcodeList}}</span>
            </div>
            <span class="error_title"
                  v-if="erroMessage">{{erroMessage}}</span>

            <el-popover placement="bottom"
                        width="200"
                        trigger="hover"
                        content="1.查看是否进入垃圾信息或广告信息 2.5分钟内若未收到邮件，可重新获取">
              <el-button slot="reference">收不到验证码？</el-button>
            </el-popover>
            <div class="button">
              <span class="step fr"
                    @click="next(2)">确定 →</span>
            </div>
          </div>

        </div>
        <!--步骤三 修改密码-->
        <div class="register"
             v-show="checkIndex==2">
          <div class="pwd_div box">
            <span class="hint"
                  v-show="hintPwd">请设置密码</span>
            <input :type="!check?'text':'password'"
                   :placeholder="setPwPlace"
                   class="inputBox"
                   v-model="password"
                   v-on:blur="autofocusPw(password)"
                   @focus="pawdFocus"
                   v-on:input="pwdInput(password)"
                   maxlength="20">
            <i class="iconfont"
               :class="check?'icon-yanjing-bi':'icon-yanjing-zheng'"
               @click="check=!check"></i>
            <div class=""
                 v-show="triangleShow">
              <span class="Triangle"></span>
              <div class="hintMessage">
                <p>您的密码必须包含：</p>
                <p>
                  <el-checkbox v-model="radio"> 请输入6- 20个字符</el-checkbox>
                </p>
                <p>
                  <el-checkbox v-model="radio2">同时包含字母和数字</el-checkbox>
                </p>
              </div>
            </div>
          </div>
          <div class="pwd_div box">
            <span class="hint"
                  v-show="hintPwdTwo">请再次输入密码</span>
            <input :type="!checkTwo?'text':'password'"
                   :placeholder="setPwPlacetwo"
                   class="inputBox"
                   v-model="repPassword"
                   v-on:blur="autofocusPwTw(repPassword)"
                   @focus="pawdFocusTwo"
                   @keyup.enter="resetPasswords(password)"
                   maxlength="20">
            <i class="iconfont"
               :class="checkTwo?'icon-yanjing-bi':'icon-yanjing-zheng'"
               @click="checkTwo=!checkTwo"></i>
            <span class="error_title"
                  v-if="erroPaw">{{erroPaw}}</span>
          </div>
          <div class="button">
            <span class="step"
                  @click="resetPasswords (password)">重置密码→</span>
          </div>
        </div>

        <!--步骤二-->
        <div class="setSucceed"
             v-show="false">
          <i class="el-icon-circle-check-outline"></i>
          <p class="title">密码设置成功</p>
        </div>
      </div>

    </div>
    <div class="succeed"
         v-else>
      <div class="succeedMain">
        <i class="el-icon-circle-check-outline"></i>
        <p>修改密码成功</p>
        <span class="countDown cur"
              @click="logIn">点此
          <span class="enterLogin">重新登录</span>（{{countDown}}）</span>
      </div>
    </div>
  </div>
</template>
<script>
import { setCookie, getCookie } from "../../api/cookie";

export default {
  data() {
    return {
      check: true,
      checkTwo: true,
      emailPlac: "请输入注册的邮箱账号",
      checkIndex: 0,
      defaults: true, //默认显示 第二步 的第一篇
      hintEmail: false,
      errorTitle: "", // 错误提示
      otherEmail: "",
      countDown: 5, //倒计时
      num: 30,
      CODES: "", //返回二维码
      //     第一步
      email: "",
      active: 0,
      countdownTime: '30s', //倒计时
      getcodeShow: false, //获取验证码
      erroMessage: "", //错误信息
      emailCode: "",
      errorCode: "", //邮箱
      verificationCode: "请输入邮箱收到的验证码",
      hintCode: false, //光标获取验证码 是否显示
      email: "", //地址带过来的邮箱
      number: "", //随机数
      hintEmail: false,
      hintPw: "",
      userName: "",
      passWord: "",
      checked: false,
      loginType: false, // 登录账户类型 true是公司账户 false是员工账户
      errorTitle: "", // 错误提示

      //     第1步   设置密码
      password: "",
      setPwPlace: "请设置密码",
      setPwPlacetwo: "请再次输入密码",
      repPassword: "",
      radio: false,
      radio2: false,
      triangleShow: false, //信息提示显示
      erroPaw: "",
      //     第三步 完善信息
      hintPwd: false, //密码提示
      hintPwdTwo: false, // 再次输入密码提示
      main_boxShow: true,
      imgCodeMain: "",
      imgCode: "请输入右图验证码", //图片验证码
      imgCodes: "",
      imgCodeShow: false,
      hintimgCode: false,
      wrongNumber: 0,
      erroMessage: "",
      imgcodeList: "",
      clock: null, //定时器
    };
  },

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
    autofocusCode() {
      this.verificationCode = "请输入邮箱收到的验证码";
      this.hintCode = false;
      if (this.emailCode == "") {
        this.erroMessage = "请输入邮箱收到的验证码";
        return false;
      }
    },
    // 点击修改密码
    resetPasswords() {
      this.autofocusPw();
      this.autofocusPwTw();
      if (this.erroPaw) {
        return false;
      }
      let obj = { email: this.email, pwd: this.password };
      this.$HTTP("post", "/user_update_pwd", obj).then(res => {
        if (res.code == 200) {
          this.main_boxShow = !this.main_boxShow;
          this.$router.push("/login");
        }
      });
    },
    // 获取验证码
    getEmailCode(email) {
      let data = { email: email };
      this.$HTTP("post", "/user_code_get", data).then(res => {
        this.CODES = res.result;
      });
    },
    codeFocus() {
      this.verificationCode = "";
      this.hintCode = true;
      this.hintPw = false;
      this.erroMessage = "";
    },
    //      下一步
    next(index) {
      // 判断邮箱账号是否存在
      if (index == 1) {
        this.autofocusEm(this.email);
        if (!this.erroMessage) {
          this.emailExists(this.email, index);
          if (!this.erroMessage) {
            if (this.active++ > 2) this.active = 0;
          }
        }
      } else if (index == "one") {
        if (!this.erroMessage) {
          if (this.active++ > 2) this.active = 0;
        }

        this.defaults = !this.defaults;
        this.getCode();
        this.getEmailCode(this.email);
      } else if (index == 2) {

        let nums = localStorage.getItem("wrongNums");
        if (this.emailCode == "") {
          this.erroMessage = "请输入邮箱收到的验证码";
          return;
        }
        if (this.$md5(this.emailCode) == this.CODES) {
          localStorage.setItem("wrongNums", 0);
          if (nums < 5) {
            this.checkIndex = index;
          } else {
            let imgCodeMain = this.imgCodeMain.toUpperCase();
            let randomCode = this.imgcodeList.toUpperCase();
            if (imgCodeMain == randomCode) {
              // console.log("需要输入图片验证码，但是图片验证码输入正确");
              this.checkIndex = index;
              if (!erroMessage) {
                if (this.active++ > 2) this.active = 0;
              }
            } else {
              // console.log("需要输入图片验证码，但是图片验证码输入错误");
              this.imgCodes = true;
              this.erroMessage = "动态验证码输入错误，请核对后再输入";
            }
          }
        } else {
          this.erroMessage = "验证码错误";
          this.wrongNumber++;
          localStorage.setItem("wrongNums", this.wrongNumber);
          let nums = localStorage.getItem("wrongNums");

          if (nums >= 5) {
            this.imgCodeShow = true;
          }
        }
      }
    },
    //      邮箱输入框设置
    autofocusEm(email) {
      this.hintEmail = false;
      this.emailPlac = "请输入注册的邮箱账号";
      let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
      if (email == "") {
        this.erroMessage = "请输入邮箱账号";
        return false;
      } else if (!emailReg.test(email)) {
        this.erroMessage = "请输入正确的邮箱格式";
        return false;
      } else {
        this.erroMessage = "";
      }
    },
    emailFocus() {
      this.emailPlac = "";
      this.hintEmail = true;
      this.errorTitle = "";
      this.erroMessage = "";
      this.hintPw = false;
    },

    getCode() {
      this.num = 60;
      this.countdownTime = this.num + "s";
      this.getcodeShow = false;
      this.clock = window.setInterval(() => {
        this.num--;
        this.countdownTime = this.num + "s";
        if (this.num < 1) {
          window.clearInterval(this.clock);
          this.num = 60;
          this.getcodeShow = true;
        }
      }, 1000);
    },
    // 判断邮箱是否存在
    emailExists(email, index) {
      let datas = { info: email };
      this.$HTTP("post", "/user_exists_info", datas).then(res => {
        if (res.code == 1) {
          this.checkIndex = index;
          var reg = /(.{2}).+(.{2}@.+)/g;
          this.otherEmail = this.email.replace(reg, "$1****$2");
          // 1.判断存在才能发送
        } else {
          this.erroMessage = "邮箱不存在，请核对后再输入";
          // 2.如果不存在，不发送
          return false;
        }
      });
    },
    // 错误五次 图片验证码 失焦事件
    autofocusImgCode() {
      this.imgCode = "请输入右图验证码";
      this.hintimgCode = false;
      if (this.imgCodeMain == "") {
        this.erroMessage = "请输入图片验证码";
        this.imgCodes = true;
      }
    },
    // 超过五次 出现图片验证码
    imgcodeFocus() {
      this.imgCode = "";
      this.hintimgCode = true;
      this.imgCodes = false;
      this.erroMessage = "";
    },
    //      1.获取焦点事件
    pawdFocus() {
      this.setPwPlace = "";
      this.erroPaw = "";
      this.hintPwd = true;
      this.triangleShow = true;
    },
    //     2.输入监控
    pwdInput(password) {
      let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
      if (password.length >= 6) {
        this.radio = true;
      } else {
        this.radio = false;
      }
      if (regExp.test(password)) {
        this.radio2 = true;
      } else {
        this.radio2 = false;
        return false;
      }
    },
    //      3.失焦事件
    autofocusPw() {
      if (!this.radio || !this.radio2) {
        this.erroPaw = "密码格式不正确，请重新输入";
      }
      this.setPwPlace = "请输入密码";

      this.hintPwd = false;
      this.triangleShow = false;
      if (this.password == "") {
        this.erroPaw = "请输入密码";
      }
    },
    //      再次验证密码失焦
    autofocusPwTw() {
      this.setPwPlaceTwo = "请再次输入密码";
      this.hintPwdTwo = false;
      if (this.password !== this.repPassword) {
        this.erroPaw = "输入密码不一致，请重新输入";
        return;
      } else {
        this.erroPaw = "";
      }
      if (this.password == "") {
        this.erroPaw = "请输入密码";
      }
    },
    //      再次验证密码获取焦点
    pawdFocusTwo() {
      this.setPwPlacetwo = "";
      this.hintPwdTwo = true;
      this.erroPaw = "";
    }
  },
  created() {
    window.clearInterval(this.clock);
    // console.log(this.num)
    // if (localStorage.getItem('forgetPwdCode')) {
    //   let forgetPwdCode = JSON.parse(localStorage.getItem('forgetPwdCode'));
    //   let newNums = 30 - Math.ceil(new Date().getTime() / 1000 - forgetPwdCode.num / 1000);
    //   if (newNums >= 0) {
    //     this.getCode(newNums);
    //   } else {
    //     this.num = 0;
    //     localStorage.setItem('forgetPwdCode', '')
    //   }
    // }

    let wrongNums = localStorage.getItem("wrongNums");
    this.imgCodeShow = wrongNums >= 5;
    let emails = getCookie("loginEmail");

    let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    if (!emailReg.test(emails)) {
    } else {
      this.email = emails;
    }
  },
  mounted() {
    this.$nextTick(function () {
      let codeStr =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      // 生成随机验证码
      function getRandom(n, m) {
        n = Number(n); //转换n,m，结果不是数字就是NaN
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
          //判断n,m,是不是有效数字，如果n或m其中一个传入的不是数字
          return Math.random(); //返回 【0-1）之间的随机小数
        }
        if (n > m) {
          //如果n大于m，则交换位置
          var temp = n;
          n = m;
          m = temp;
        }
        return Math.round(Math.random() * (m - n) + n); //返回，取m,n之间的随机整数。
      }
      // 获取随机验证码
      let imgcode;
      function getCode() {
        var str = ""; //定义一个空字符串备用
        for (var i = 0; i < 4; i++) {
          //遍历4个索引
          var ran = getRandom(0, 61); //调用getRandom方法，随机获取一个索引0-61里的随机索引
          str += codeStr.charAt(ran); //把codeStr字符串里，我们指定获取ran（这个4个索引）；
        }
        // $("#validate").text(str);
        imgcode = str; //呈现在页面上
      }
      // 首次获取验证码
      getCode();
      this.imgcodeList = imgcode;
      // 点击获取验证码
      $("#validate").click(function () {
        getCode();
      });
    });
  }
};
</script>

<style lang="less">
@import "../../assets/css/base.less";
@import "../../assets/css/media.less";

/*去除默认输入框底色*/
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset; //使用足够大的纯色内阴影覆盖黄色背景
}

input:-webkit-autofill {
  background-color: #ffffff !important;
  background-image: none;
  color: #999999;
}
#app {
  width: 100%;
  height: 100%;
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

#forgetPwd {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .is-finish {
    color: #3684ff;
    border: none;
    // background: #3684FF;
    .el-step__icon {
      background: #3684ff;
      border: none;
      color: #ffffff;
      width: 32px;
      height: 32px;
    }
  }
  .el-popover {
    background: red;
  }

  .el-step__line {
    height: 0px;
    border: 1px dashed #e5e5e5;
    background: none;
    position: relative;
    .el-step__line-inner {
      border: 1px dashed #3684ff;
      position: absolute;
      top: -1px;
    }
  }
  .el-step__icon {
    width: 32px;
    height: 32px;
  }
  .el-step__title {
    margin-left: -10px;
    font-size: 14px;
    color: #999999;
    font-weight: normal;
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
      width: 420px;
      height: 260px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -210px;
      margin-top: -125px;
      z-index: 2;
      background: #ffffff;
      .getPwd {
        width: 317px;
        position: relative;
        margin: 50px auto 0;
        .button {
          position: absolute;
          width: 317px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-top: 50px;
          .step {
            text-align: center;
            line-height: 40px;
            display: inline-block;
            cursor: pointer;
            width: 317px;
            height: 36px;
            border: 1px solid rgba(102, 102, 102, 1);
            border-radius: 4px;
          }
          .step:hover {
            border: 1px solid #333333;
          }
        }
      }
      .title {
        text-align: center;
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: bold;
      }
      .box {
        height: 50px;
        position: relative;
        i {
          position: absolute;
          right: 10px;
          bottom: 5px;
        }
        .hint {
          font-size: 12px;
          padding-left: 10px;
          position: absolute;
          color: #999999;
          bottom: 30px;
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
      .error_title {
        position: absolute;
        color: red;
        left: 10px;
        font-size: 12px;
        bottom: -20px;
      }

      .sendEmail {
        width: 317px;
        margin: 50px auto 0;
        // text-align: center;
        // position: relative;
        p {
          line-height: 1.7;
          text-align: center;
        }
        .sendEmailTwo {
          text-align: center;
          position: relative;
          .el-popover__reference {
            position: absolute;
            right: 0;
            bottom: -20px;
          }
          .sendToEmail {
            font-weight: bold;
          }
          .el-button {
            padding: 0;
            border: none;
          }
          .el-button :hover {
            padding: 0;
            border: none;
            background: none;
            span {
              background: none;
            }
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
        }

        .el-icon-circle-check-outline {
          font-size: 40px;
          margin-bottom: 37px;
          color: #999999;
        }
        .hint {
          width: 100%;
          color: #333333;
          line-height: 2;
          bottom: 30px;
          left: 0;
          position: absolute;
        }
        .getCodeBox {
          position: relative;
          .hint {
            text-align: left;
          }
          .el-button {
            padding: 0;
          }
          .getCode {
            position: absolute;
            right: 0;
            top: 10px;
            width: 100px;
            height: 32px;
            border: 1px solid rgba(229, 229, 229, 1);
            position: absolute;
          }

          .getCodes {
            position: absolute;
            right: 0px;
            top: 10px;
            display: inline-block;
            width: 100px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #3684ff;
            border: 1px solid #3684ff;
            border-radius: 4px;
            position: absolute;
            background: #ffffff;
          }
          .imgCode {
            display: inline-block;
            border-radius: 4px;
            width: 100px;
            height: 32px;
            position: absolute;
            right: 0px;
            top: 10px;
            background: #edf4f7;
            letter-spacing: 7px;
            text-align: center;
            line-height: 32px;
            font-style: italic;
            font-weight: bold;
          }
        }
      }
      .register {
        width: 317px;
        margin: 50px auto 0;
      }
    }
  }
  .succeed {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10000;
    .succeedMain {
      position: absolute;
      width: 200px;
      height: 100px;
      left: 50%;
      top: 50%;
      margin-left: -100px;
      margin-top: -50px;
      text-align: center;
      line-height: 2;
      i {
        font-size: 40px;
        margin-bottom: 20px;
      }
      .enterLogin {
        color: #4583f0;
      }
    }
  }
  .button {
    position: absolute;
    width: 317px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-top: 40px;

    .step {
      text-align: center;
      line-height: 40px;
      display: inline-block;
      cursor: pointer;
      width: 317px;
      height: 36px;
      border: 1px solid rgba(102, 102, 102, 1);
      border-radius: 4px;
    }
    .step:hover {
      border: 1px solid #333333;
    }
  }
}
</style>
