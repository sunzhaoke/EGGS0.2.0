<template>
  <div class="registerBox">
    <div class="bgSvg_k">
      <div class="grid_ke"></div>
      <div class="svg"></div>
    </div>
    <div class="topNav">
      <img src="../../assets/img/egLogo_small.png"
           class="company_logo"
           alt="">
      <router-link to="/login"
                   tag="span"
                   class="login">登录</router-link>
      <span class="register"
            @click="register">注册</span>
    </div>
    <div class="main_box">
      <div class="main">
        <!--步骤一 -->
        <div class="registerList">
          <p class="title">注册</p>
          <div class="email_div box">
            <span class="hint"
                  v-show="hintName">请输入您的姓名</span>
            <input type="text"
                   :placeholder="namePlace"
                   :class="errorName?'inputBoxBlur':'inputBox'"
                   v-model="name"
                   v-on:blur="nameBlur(name)"
                   @focus="nameFocus">
          </div>
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
          <div class="getCodeBox box">
            <span class="hint"
                  v-show="hintCode">请输入邮箱收到的验证码</span>
            <input type="text"
                   :placeholder="verificationCode"
                   :class="errorCode?'inputBoxBlur':'inputBox'"
                   v-model="emailCode"
                   v-on:blur="autofocusCode(emailCode)"
                   @focus="codeFocus">
            <el-button disabled
                       class="getCode cur"
                       v-if="!email">获取验证码</el-button>
            <el-button class="getCode cur"
                       v-else
                       @click="getCode">获取验证码</el-button>
            <span class="getCodes cur"
                  v-show="getcodeShow">{{num}}s</span>
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
                  id="validate"></span>
          </div>
          <div class="pwd_div box">
            <span class="hint"
                  v-show="hintPwd">请设置密码</span>
            <input type="password"
                   :placeholder="setPwPlace"
                   :class="errorPwd?'inputBoxBlur':'inputBox'"
                   v-model="password"
                   v-on:blur="autofocusPw(password)"
                   @focus="pawdFocus"
                   v-on:input="pwdInput(password)"
                   autocomplete="off"
                   maxlength="20">
            <div class=""
                 v-show="triangleShow">
              <span class="Triangle"></span>
              <div class="hintMessage">
                <p>您的密码必须包含：</p>
                <p>
                  <el-checkbox v-model="radio"> 请输入6-20个字符</el-checkbox>
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
            <input type="password"
                   :placeholder="setPwPlaceTwo"
                   :class="errorPwdTwo ?'inputBoxBlur':'inputBox'"
                   v-model="repPassword"
                   v-on:blur="autofocusPwTw(repPassword)"
                   @focus="pawdFocusTwo"
                   autocomplete="off"
                   maxlength="20">
            <span class="error_title"
                  v-if="erroMessage">{{erroMessage}}
              <router-link class="mainColor"
                           @click.native="goLogin"
                           tag='a'
                           to="/login"
                           v-if="erroMessage=='该账号已经注册，点击'">直接登录</router-link>
            </span>

          </div>
          <div class="loginButton cur"
               v-if="name&&email&&emailCode&&password&&repPassword"
               @click="register">注册
            <i class="iconfont "> → </i>
          </div>
          <div class="loginButtonNo cur"
               v-else> 注册
            <i class="iconfont "> → </i>
          </div>
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
      hintEmail: false,
      hintCode: false, //光标获取验证码 是否显示
      erroMessage: "", //错误信息
      errorName: "", //姓名
      errorEmail: "",
      errorCode: "", //邮箱
      errorPwd: "", //邮箱
      errorPwdTwo: "", //邮箱

      getcodeShow: false, //获取验证码
      num: 60,
      //     第一步
      email: "",
      emailCode: "",
      empalce: "请输入您的工作邮箱",
      verificationCode: "请输入邮箱收到的验证码",
      //     第二步   设置密码
      password: "",
      setPwPlace: "请设置密码",
      setPwPlaceTwo: "请再次输入密码",
      repPassword: "",
      radio: false,
      radio2: false,
      triangleShow: false, //信息提示显示
      erroPaw: "",
      //     第三步 完善信息
      name: "",
      namePlace: "请输入您的姓名",
      hintPwd: false, //密码提示
      hintPwdTwo: false, // 再次输入密码提示
      perfectErro: "",
      hintName: false,
      CODES: "",
      wrongNumber: 0,
      imgCode: "请输入右图验证码", //图片验证码
      imgCodes: "",
      imgCodeMain: "",
      imgCodeShow: false,
      hintimgCode: false,
      deleteCode: '', //删除验证码 定时器
    };
  },

  watch: {
    wrongNumber: function (val) {
      if (val >= 5) {
      }
    }
  },
  methods: {
    goLogin() {
        localStorage.setItem("registerEmail", this.email);
    },

    // 1。姓名-----------------------------------------------------------------
    // 一、 1.姓名失焦
    nameBlur() {
      this.namePlace = "请输入您的姓名";
      this.hintName = false;
      if (this.name == "") {
        this.perfectErro = "请输入姓名";
        this.erroMessage = "请输入姓名";
        this.errorName = true;
      }
    },
    // 一、 2.姓名获取焦点
    nameFocus() {
      this.namePlace = "";
      this.perfectErro = "";
      this.hintName = true;
      this.erroMessage = "";
      this.errorName = false;
    },

    // 2.  邮箱----------------------------------------------------------------
    getCodes(num) {
      return new Promise((resolve, reject) => {
        if (this.erroMessage) {
          return false;
        } else {
          if (typeof num == "number") {
            this.num = num;
            let clock = window.setInterval(() => {
              this.num--;
              if (this.num < 1) {
                window.clearInterval(clock);
                this.getcodeShow = false;
              }
            }, 1000);
          } else {
            this.num = 60;
            let clock = window.setInterval(() => {
              this.num--;
              if (this.num < 1) {
                window.clearInterval(clock);
                this.getcodeShow = false;
              }
            }, 1000);
            let registerInfo = { 'name': this.name, 'email': this.email, 'num': new Date().getTime() }
            localStorage.setItem('registerInfo', JSON.stringify(registerInfo))
          }
        }
      });
    },
    // 异步调用
    async getCode(num) {
      try {
        await this.autofocusEm(this.email); //先判断格式是否正确
        await this.emailExists(this.email); //先判断是否存在
        await this.getCodes(num); //先判断是否存在
      }
      catch (err) {
        console.log(err);
      }
    },
    // 获取验证码
    getEmailCode(email) {
      let data = { email: email };
      this.$HTTP("post", "/user_code_get", data).then(res => {
        this.CODES = res.result;
        this.deleteCode = window.setInterval(() => {
          this.CODES = 0;
        }, 1000 * 300);
      });
    },
    // 点击注册
    register() {
      let randomCode = $("#validate").text();
      this.autofocusEm(this.email);
      this.autofocusPw();
      this.autofocusPwTw();
      // 1.如果邮箱验证码输入正确 则进入下一步
      if (this.erroMessage !== "") {
        return false;
      }
      if (this.$md5(this.emailCode) == this.CODES) {
        // console.log("图片校验码正确");
        let nums = localStorage.getItem("wrongNum");
        if (nums < 5) {
          // console.log("邮箱验证码正确，且不需要输入图片验证码");
          this.zhuce();
        } else {
          // console.log("图片校验码错误，需要输入图片验证码");
          let imgCodeMain = this.imgCodeMain.toUpperCase();
          randomCode = randomCode.toUpperCase();
          if (imgCodeMain == randomCode) {
            // console.log("需要输入图片验证码，但是图片验证码输入正确");
            this.zhuce();
          } else {
            // console.log("需要输入图片验证码，但是图片验证码输入错误");
            this.imgCodes = true;
            this.erroMessage = "图片验证码输入错误";
          }
        }
      } else {
        // console.log("验证码错误");
        this.erroMessage = "验证码错误";
        this.errorCode = true;
        this.wrongNumber++;
        localStorage.setItem("wrongNum", this.wrongNumber);
        let nums = localStorage.getItem("wrongNum");
        if (nums >= 5) {
          this.imgCodeShow = true;
        }
      }
    },
    zhuce() {
      let obj = {
        realName: this.name,
        email: this.email,
        pwd: this.password
      };
      this.$HTTP("post", "/user_register", obj).then(res => {
        if (res.code == 200) {
          this.$message("注册成功,请登录");
          this.$router.push("/login");
          localStorage.setItem("wrongNum", 0);
          localStorage.setItem("registerInfo", '');
          localStorage.setItem("registerEmail", this.email);
        }
      });
    },
    //      密码框事件==========================

    //      1.获取焦点事件
    pawdFocus() {
      this.errorPwd = false; //输入密码框底边红框
      this.setPwPlace = "";
      this.erroMessage = "";
      this.hintPwd = true;
      this.triangleShow = true; //密码信息提示框
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
      this.setPwPlace = "请设置密码";
      this.hintPwd = false;
      this.triangleShow = false;
      if (this.password == "") {
        this.erroMessage = "请输入密码";
        this.errorPwd = true;
        return;
        // this.erroMessage = "密码格式不正确";
      }
      if (!this.radio || !this.radio2) {
        this.erroMessage = "密码格式不正确";
        this.errorPwd = true;
      }
    },
    //      再次验证密码失焦
    autofocusPwTw() {
      this.setPwPlaceTwo = "请再次输入密码";
      this.hintPwdTwo = false;

      if (this.repPassword == "") {
        this.erroMessage = "请再次输入密码";
        this.errorPwdTwo = true;
        return;
      }
      if (!this.radio || !this.radio2) {
        this.erroMessage = "密码格式不正确";
        this.errorPwdTwo = true;
      } else {
        this.hintPwdTwo = false;
        if (this.password !== this.repPassword) {
          this.erroMessage = "两次输入的密码必须保持一致";
          this.errorPwdTwo = true; //输入密码框
          return;
        } else {
          this.erroMessage = "";
        }
      }
    },
    pawdFocusTwo() {
      this.errorPwdTwo = false; //输入密码框
      this.hintPwdTwo = true;
      this.setPwPlaceTwo = "";
      this.erroMessage = "";
    },
    //      邮箱输入框设置
    autofocusEm(email) {
      return new Promise((resolve, reject) => {
        this.empalce = "请输入您的工作邮箱";
        this.hintEmail = false;
        if (this.email == "") {
          this.errorEmail = "请输入您的工作邮箱";
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
            this.getcodeShow = false;
            this.errorEmail = false;
            resolve(email);
          }
        }
      });

    },
    // 判断邮箱是否存在
    emailExists(email) {
      return new Promise((resolve, reject) => {
        let datas = { info: email };
        this.$HTTP("post", "/user_exists_info", datas).then(res => {
          resolve(res);
          if (res.code == 200) {
            // 1.判断邮箱不存在 才发送验证码
            this.getEmailCode(this.email);
            this.getcodeShow = true;
          } else if (res.code == 1) {
            this.erroMessage = '该账号已经注册，点击';

          }
        });
      });

    },
    autofocusCode() {
      this.verificationCode = "请输入邮箱收到的验证码";
      this.hintCode = false;
      if (this.emailCode == "") {
        this.erroMessage = "请输入邮箱收到的验证码";
        return false;
      }
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
    emailFocus() {
      this.errorEmail = false;
      this.erroMessage = "";
      this.empalce = "";
      this.hintEmail = true;
    },
    codeFocus() {
      this.errorCode = false;
      this.verificationCode = "";
      this.hintCode = true;
    },
    // 超过五次 出现图片验证码
    imgcodeFocus() {
      this.imgCode = "";
      this.hintimgCode = true;
      this.imgCodes = false;
      this.erroMessage = "";
    },
    pwFocus() {
      this.hintEmail = false;
      this.hintPw = true;
    },

    //      手机号正则判断
    isPoneAvailable(str) {
      console.log(str);
      var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/; //手机的格式
      if (!reg.test(str)) {
        this.perfectErro = "*请输入正确的手机号";
        return false;
      } else {
        this.perfectErro = "";
      }
    }
  },

  created() {
    if (localStorage.getItem('registerInfo')) {
      let registerInfo = JSON.parse(localStorage.getItem('registerInfo'));
      this.name = registerInfo.name;
      this.email = registerInfo.email; let newNums = 60 - Math.ceil(new Date().getTime() / 1000 - registerInfo.num / 1000);
      if (newNums >= 0) {
        this.getCode(newNums);
      } else {
        this.num = 60
        localStorage.setItem('registerInfo', '')
      }
    }

    let urls = decodeURI(window.location.href).split("?")[1];
    let wrongNum = localStorage.getItem("wrongNum");
    this.imgCodeShow = wrongNum >= 5;

    if (!urls) {
      return false;
    } else {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      let nickname = url[2].split("=")[1];
      let sign = url[4].split("=")[1];
      let arr = {
        openid: url[0].split("=")[1],
        unionid: url[1].split("=")[1]
      };
      let obj1 = Object.assign({}, arr);
      let key = "4951841F25AF0C695331B3F3C0369089";
      for (let x in arr) {
        arr[x] = encodeURIComponent(arr[x]);
      }
      obj1.key = key;
      var objSortJoin = arr => {
        var newkey = Object.keys(arr).sort();
        var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {
          //遍历newkey数组
          newObj[newkey[i]] = arr[newkey[i]];
          //向新创建的对象中按照排好的顺序依次增加键值对
        }
        let str = "";
        for (let i in newObj) {
          newObj[i] = encodeURIComponent(newObj[i]);
          str += i + "=" + newObj[i] + "&";
        }
        str = str.slice(0, str.length - 1);
        str = str.toLocaleUpperCase();
        str = this.$md5(str);
        str = str.toLocaleUpperCase();
        return str; //返回排好序连接好的新对象
      };
      if (url) {
        if (objSortJoin(obj1) == sign) {
          this.name = nickname;
        }
      }
    }
  },
  mounted() {
    let codeStr =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = $("#validate").text('2222222');
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
    function getCode() {
      var str = ""; //定义一个空字符串备用
      for (var i = 0; i < 4; i++) {
        //遍历4个索引
        var ran = getRandom(0, 61); //调用getRandom方法，随机获取一个索引0-61里的随机索引
        str += codeStr.charAt(ran); //把codeStr字符串里，我们指定获取ran（这个4个索引）；
      }
      $("#validate").text(str);
      randomCode = str; //呈现在页面上
    }
    // 首次获取验证码
    getCode();
    // 点击获取验证码
    $("#validate").click(function () {
      getCode();
    });
  },


};
</script>

<style lang="less">
@import "../../assets/css/base.less";
@import "../../assets/css/media.less";

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

.registerBox {
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
    .login {
      right: 150px;
    }
    .login::after {
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
      height: 350px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -160px;
      margin-top: -170px;
      // background: #ffffff;
      z-index: 9999;
      padding: 20px;
      .registerList {
        background: #ffffff;
        .getCodeBox {
          position: relative;
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
            border: 1px solid #e5e5e5;
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

      .title {
        text-align: center;
        margin-bottom: 25px;
        font-size: 18px;
        color: #333333;
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
        a {
          text-decoration: underline;
        }
      }
      .buttonNo {
        position: absolute;
        left: 50%;
        margin-left: -160px;
        width: 318px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        margin-top: 30px;
        text-align: center;
        color: #d0d0d0;
      }

      .buttonYes:hover {
        position: absolute;
        left: 50%;
        margin-left: -160px;
        width: 318px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        margin-top: 30px;
        text-align: center;
        color: #3684ff;
        border: 1px solid #3684ff;
      }
    }
  }
}
</style>
