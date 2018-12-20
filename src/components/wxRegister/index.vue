<template>
  <div id="wxRegister">

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
         v-if="!goBondShow">
      <div class="main">
        <span class="logo_k">
          <el-upload class="avatar-uploader"
                     action="/File.ashx"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="wxImg"
                 :src="wxImg"
                 class="avatar">
            <span class="editor">
              <i class="iconfont icon-shangchuan-"></i>
            </span>
          </el-upload>
        </span>
        <p>Hi！{{name}}，请完善您的账号信息，</p>
        <p>以便今后使用微信快捷登录</p>
        <input type="text"
               v-model="name"
               class="inputBox">
        <p class="goBond cur"
           @click="goBound">已有Eggs账号？去绑定</p>
        <span class="step"
              @click='goLogin'>没有Eggs账号？直接登录 </span>
      </div>
    </div>
    <go-bound v-if="goBondShow"
              :unionId='unionId'
              :nickname='nickname'> </go-bound>

  </div>
</template>
<script>
import goBound from "./goBound";
export default {
  data() {
    return {
      name: "11", //真实姓名
      wxImg: "",
      unionId: "",
      nickname: '',
      goBondShow: false,//去绑定
      wxName: '', //微信名称
    };
  },
  components: { goBound },
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
    // 去绑定
    goBound() {
      this.goBondShow = true;
    },
    goLogin() {
      let data = {
        realName: this.name,
        pic: this.wxImg,
        unionId: this.unionId,
        wxName: this.wxName
      };
      this.$HTTP("post", "/user_register_bindwx", data).then(res => {
        if (res.code == 200) {
          localStorage.setItem("staffInfo", JSON.stringify(res.result));
          this.$router.push("/PersonalHome");
        }
      });
    },
    //      上传头像
    handleAvatarSuccess(res, file) {
      this.imageUrl = res;
      this.logo = res;
      let data = { userpkid: this.Pkid, pic: res };
      // this.$HTTP("post", "/UpdateMemberPIC", data).then(res => {

      // });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg/png/gif/tiff/";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    }
  },
  created() {
    let urls = decodeURI(window.location.href).split("?")[1];
    if (!urls) {
      return false;
    } else {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      console.log(url, '===============================')
      let nickname = url[2].split("=")[1];
      let sign = url[4].split("=")[1];
      let headimgurl = url[3].split("=")[1];
      this.unionId = url[1].split("=")[1];
      this.wxName = url[2].split("=")[1];
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
          this.unionId = decodeURIComponent(url[1].split("=")[1]);
          this.nickname = decodeURIComponent(url[2].split("=")[1]);
          console.log(this.nickname,'this.nickname==================')
          this.wxImg = decodeURIComponent(headimgurl);
        }
      }
    }
  }
};
</script>
<style lang='less'>
@import "../../assets/css/base.less";
#app {
  width: 100%;
  height: 100%;
}
#wxRegister {
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
      width: 420px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -210px;
      margin-top: -160px;
      z-index: 2;
      background: #ffffff;
      text-align: center;
      p {
        line-height: 1.7;
      }
      .goBond {
        margin-top: 40px;
        color: #3684ff;
      }
      // 修改头像
      .logo_k {
        display: block;
        .border_radius(@br: 50%);
        width: 50px;
        height: 50px;
        margin: 0 auto;
        overflow: hidden;
        cursor: pointer;
        position: relative;

        img {
          width: 50px;
        }
        .editor {
          display: block;
          .border_radius(@br: 50%);
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0);
          color: #fff;
          line-height: 50px;
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          opacity: 0;
          z-index: 1000;
          i {
            font-size: 20px;
          }
        }
        .editor:hover {
          background: rgba(0, 0, 0, 0.7);
          opacity: 1;
        }
      }
      .inputBox {
        width: 317px;
        border-bottom: 1px solid #999999;
        padding: 0 10px 10px 10px;
        .box_sizing;
        margin-top: 40px;
        // position: absolute;/
        // bottom: 0;
        // left: 0;
      }
      .step {
        text-align: center;
        line-height: 40px;
        display: inline-block;
        cursor: pointer;
        width: 317px;
        height: 36px;
        border: 1px solid rgba(102, 102, 102, 1);
        border-radius: 4px;
        margin-top: 40px;
      }
      .step:hover {
        border: 1px solid #333333;
      }
    }
  }
}
</style>


