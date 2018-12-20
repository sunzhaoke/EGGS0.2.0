<template>
  <div class="setPwd">
    <div class="bgSvg_k">
      <div class="grid_ke"></div>
      <div class="svg"></div>
    </div>
    <div class="main_box">
      <div class="main">
        <!--步骤一 -->
        <div class="register" v-show="one">
          <p class="title">设置密码</p>
          <div class="pwd_div box">
            <span class="hint" v-show="hintPwd">请设置密码</span>
            <input type="password" :placeholder="setPwPlace" class="inputBox" v-model="password"
                   v-on:blur="autofocusPw(password)" @focus="pawdFocus" v-on:input="pwdInput(password)" maxlength="20">
            <div class="" v-show="triangleShow">
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
            <span class="hint" v-show="hintPwdTwo">请再次输入密码</span>
            <input type="password" :placeholder="setPwPlacetwo" class="inputBox" v-model="repPassword"
                   v-on:blur="autofocusPwTw(repPassword)" @focus="pawdFocusTwo" v-on:input="pwdInputTwo(repPassword)"
                   @keyup.enter="next(password)"
                   maxlength="20">
            <span class="error_title" v-if="erroPaw">{{erroPaw}}</span>
          </div>
          <div class="button">
            <span class="step" @click="next(password)">→</span>
          </div>
        </div>

        <!--步骤二-->
        <div class="setSucceed" v-show="two">
          <i class="el-icon-circle-check-outline"></i>
          <p class="title">密码设置成功</p>
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
      email: "", //地址带过来的邮箱
      number: "", //随机数
      hintEmail: false,
      hintPw: "",
      userName: "",
      passWord: "",
      checked: false,
      loginType: false, // 登录账户类型 true是公司账户 false是员工账户
      errorTitle: "", // 错误提示
      one: true,
      two: false,

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
      name: "",
      tell: "",
      hintPwd: false, //密码提示
      hintPwdTwo: false, // 再次输入密码提示
      perfectErro: "",
      hintName: false,
      hintTel: false
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
  mounted() {},

  methods: {
    //下一步
    next(password) {
      if (this.password == "" || this.repPassword == "") {
        this.erroPaw = "请输入密码";
        return;
      } else {
        this.erroPaw = "";
      }
      if (this.password !== this.repPassword) {
        this.erroPaw = "两次输入的密码不一致";
        return;
      } else {
        this.erroPaw = "";
      }

      //      判断密码不为空.规则符合  才能进入下一步
      if (this.erroPaw == "" && this.radio == true && this.radio2 == true) {
        this.one = false;
        this.two = true;

        let data = { Email: this.email, Pwd: this.password };
        this.$HTTP("post", "/RetrievUpdatePassword", data).then(res => {});
        var t;
        t = setTimeout(res => {
          this.$router.push("/login");
        }, 2000);
      } else {
        this.erroPaw = "密码格式不符合要求";
      }
    },
    //      密码框事件==========================

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
      this.setPwPlace = "请输入密码";

      this.hintPwd = false;
      this.triangleShow = false;
      if (this.password == "") {
        this.erroPaw = "请输入密码";
      }
    },
    //      再次验证密码失焦
    autofocusPwTw() {
      this.setPwPlacetwo = "请再次输入密码";

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
    },
    pwdInputTwo(pwd) {},

    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "userName") {
            this.ruleForm.userName = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "userPwd") {
            this.ruleForm.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    }
  },
  created() {
    if (getCookie("loginEmail")) {
      this.$router.push("/myTesk/myTeskList");
      return
    }
    //      let url =window.location.href;
    let url = unescape(window.location.href).split("?")[1];

    this.email = url.split("&")[0].split("=")[1];
    console.log(this.email);
    this.number = url.split("&")[1].split("=")[1];
    if (this.number !== getCookie("number")) {
      this.$message("此链接已失效,请重新发送");
      this.$router.push("/forgetPwd");
    }
    let t;
    t = setTimeout(function() {
      setCookie("number", "");
    }, 30000);
  }
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

.setPwd {
  width: 100%;
  height: 100%;
  background: #ffffff;

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
      z-index: 9999;
      padding: 20px;
      .setSucceed {
        text-align: center;
        .el-icon-circle-check-outline {
          font-size: 40px;
          margin-bottom: 37px;
          color: #999999;
        }
      }
      .title {
        text-align: center;
        margin-bottom: 25px;
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
      .button {
        position: absolute;
        left: 50%;
        margin-left: -109px;
        width: 218px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-top: 40px;
        .step {
          text-align: center;
          line-height: 40px;
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #ffffff;
          cursor: pointer;
        }
        .step:hover {
          border: 1px solid #333333;
        }
      }
    }
  }
}
</style>
