<template>
  <div id='myCenter'>
    <div class="topBar_k fl">
      <top-bar></top-bar>
    </div>
    <div class="mainBox">
      <router-link to="project/projectManage"
                   class="next cur">退出个人中心</router-link>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="用户管理"
                     name="first">

          <div class="myMain">
            <div class="hintBox"
                 v-if="!emails">
              <p class="h1">账号信息需要完善</p>
              <p>您还未绑定邮箱和设置密码，部分功能暂时无法使用</p>
              <button class="main_button_bg perfect"
                      @click=" activeName = 'second'"> 完善账号 </button>
            </div>
            <div class="personalInfobox personalMainBox">
              <span class="logo_k">
                <el-upload class="avatar-uploader"
                           action="/img.ashx"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img v-if="personalImg"
                       :src="personalImg"
                       class="avatar">
                  <span class="editor">编辑</span>
                </el-upload>
              </span>
              <ul class="fl optionsList detailed">
                <li>姓名 </li>
                <li>所属行业 </li>
                <li>职位 </li>
                <li>电话 </li>
                <li>生日 </li>
              </ul>
              <ul class="fr optionsMain">
                <li><input type="text"
                         v-model="realName"></li>
                <li>
                  <el-select v-model="profession"
                             clearable
                             placeholder="请选择行业信息">
                    <el-option v-for="item in industryLists"
                               :key="item.Pkid"
                               :label="item.Title"
                               :value="item.Pkid">
                    </el-option>
                  </el-select>
                </li>
                <li><input type="text"
                         placeholder="请输入职位名称"
                         v-model="job"></li>
                <li><input type="text"
                         placeholder="请输入联系方式"
                         v-model="tell"></li>
                <li class="birthday">
                  <select name="public-choice"
                          class="year"
                          v-model="year"
                          @change="getCouponSelected(year)">
                    <option :value="coupon"
                            v-for="(coupon,index) in yearLists"
                            :key="index">{{coupon}}</option>
                  </select>年
                  <select name="sel_month"
                          class="month"
                          v-model="month"
                          @change="getCouponSelected(month)">
                    <option :value="coupon"
                            v-for="(coupon,index) in monthLists"
                            :key="index">{{coupon}}</option>
                  </select>月
                  <select name="sel_month"
                          class="day"
                          v-model="day"
                          @change="getCouponSelected(day)">
                    <option :value="coupon"
                            v-for="(coupon,index) in dayList"
                            :key="index">{{coupon}}</option>
                  </select>日

                </li>
              </ul>
              <button :class="saveShow?'saveBtn main_button_bg':'saveBtn main_button_disabled_bg' "
                      @click="saveMain"> 保存信息 </button>
              <!-- <button class="main_button_disabled_bg saveBtn"> 保存信息 </button> -->

            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全设置"
                     name="second">
          <div class="myMain">
            <div class="personalMainBox ">
              <div v-if="emails">
                <p class="title">修改密码</p>
                <ul class="fl optionsList oldpawList">
                  <li>旧密码 </li>
                  <li>新密码 </li>
                  <li>确认新密码 </li>
                </ul>
                <ul class="fr optionsMain">
                  <div class="box">
                    <input type="password"
                           placeholder="请输入旧密码"
                           class="inputBox"
                           v-model="oldPwd"
                           @focus="oldPawdFocus"
                           @blur="oldPwdAutofocus">
                  </div>
                  <!-- 输入新密码 -->
                  <div class="pwd_div box">
                    <input :type="!check?'text':'password'"
                           placeholder="请输入新密码（6位以上）"
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
                    <input :type="!checkTwo?'text':'password'"
                           placeholder="请再次输入密码"
                           class="inputBox"
                           v-model="repPassword"
                           v-on:blur="autofocusPwTw(repPassword)"
                           @focus="pawdFocusTwo"
                           @keyup.enter="resetPasswords(password)"
                           maxlength="20">
                    <i class="iconfont"
                       :class="checkTwo?'icon-yanjing-bi':'icon-yanjing-zheng'"
                       @click="checkTwo = !checkTwo"></i>
                  </div>
                  <span class="error_title"
                        v-if="erroPaw">{{erroPaw}}</span>
                </ul>
                <button :class="oldPwd&&password&&repPassword ? 'saveBtn main_button_bg':'saveBtn main_button_disabled_bg' "
                        @click="amendMain">确认修改</button>
              </div>
              <!-- +++++++++++++++++++++++++  完善账号 ++++++++++++++++++++++++++++++++++++++++++++ -->
              <div v-else>
                <p class="title">完善账号</p>
                <ul class="fl optionsList email">
                  <li>邮箱账号 </li>
                  <li>验证码 </li>
                  <li v-show="imgCodeShow">动态验证码</li>
                  <li>密码 </li>
                  <li>确认密码 </li>
                </ul>
                <div class="fl optionsMain">
                  <div class="email_div box">
                    <input type="text"
                           placeholder="请输入您的工作邮箱"
                           :class="errorEmail?'inputBoxBlur':'inputBox'"
                           v-model="email"
                           v-on:blur="autofocusEm(email)"
                           @focus="emailFocus">
                  </div>
                  <div class="getCodeBox box">
                    <input type="text"
                           placeholder="请输入邮箱收到的验证码"
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
                          v-show="getcodeShow">{{countdownTime}}</span>
                  </div>
                  <div class="getCodeBox box"
                       v-show='imgCodeShow'>
                    <input type="text"
                           placeholder="请输入右侧图片验证码"
                           :class="imgCodes?'inputBoxBlur':'inputBox'"
                           v-model="imgCodeMain"
                           v-on:blur="autofocusImgCode(emailCode)"
                           @focus="imgcodeFocus">
                    <span class="imgCode cur"
                          id="validate">{{validate}}</span>
                  </div>
                  <div class="pwd_div box">
                    <input :type="!check?'text':'password'"
                           placeholder="请输入密码"
                           :class="errorPwd?'inputBoxBlur':'inputBox'"
                           v-model="password"
                           v-on:blur="autofocusPw(password)"
                           @focus="pawdFocus"
                           v-on:input="pwdInput(password)"
                           autocomplete="off"
                           maxlength="20">
                    <i class="iconfont"
                       :class="check?'icon-yanjing-bi':'icon-yanjing-zheng'"
                       @click="check = !check"></i>
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
                    <input :type="!checkTwo?'text':'password'"
                           placeholder="请再次输入密码"
                           :class="errorPwdTwo ?'inputBoxBlur':'inputBox'"
                           v-model="repPassword"
                           v-on:blur="autofocusPwTw(repPassword)"
                           @focus="pawdFocusTwo"
                           autocomplete="off"
                           maxlength="20">
                    <i class="iconfont"
                       :class="checkTwo?'icon-yanjing-bi':'icon-yanjing-zheng'"
                       @click="checkTwo = !checkTwo"></i>
                  </div>
                  <span class="error_title"
                        v-if="erroPaw">{{erroPaw}}</span>

                </div>
                <button :class="repPassword?'saveBtn main_button_bg':'saveBtn main_button_disabled_bg' "
                        @click="confirmToSubmit">确认提交</button>
              </div>
              <div class="successBox"
                   v-if='logInShow'>
                2222
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账号绑定"
                     name="third">
          <div class="myMain">
            <div class="personalMainBox changePassword">
              <div class="boundEmailBox clearfix"
                   v-show="!boundEmail">
                <ul class="fl optionsList">
                  <li>邮箱</li>
                  <li>微信</li>
                </ul>
                <ul class="fl optionsList accountInformation ">
                  <li v-if="emails">{{emails}}</li>
                  <li v-else>
                    <span class="">请在</span>
                    <span class="cur mainColor"
                          @click="activeName = 'second'"> 安全设置 </span>
                    <span class="">中设置邮箱和密码</span>
                  </li>
                  <li v-show="xwName"
                      class="xwName">{{xwName}}
                    <span class="cur errRed"
                          v-show="xwName"
                          @click="removeWxBind"> 解除绑定</span>
                  </li>
                </ul>
                <ul class="fl optionsList goBound">
                  <li class="cur mainColor"
                      v-show="emails"
                      @click="boundEmail=!boundEmail">更换绑定</li>
                  <li v-if="!emails"
                      style="opacity:0">dd</li>
                  <li class="cur mainColor"
                      v-show="!xwName">
                    <a href="https://server.apexgame.cn/wecharCode2.ashx">绑定</a>
                  </li>
                </ul>
              </div>
              <div class="boundEmailBox changePassword changeEmail"
                   v-show="boundEmail">
                <ul class=" fl optionsList">
                  <li>邮箱账号</li>
                  <li>验证码</li>
                  <li v-show="imgCodeShow">动态验证码</li>
                </ul>
                <div class="fl optionsMain">
                  <div class="email_div box">
                    <input type="text"
                           placeholder="请输入您的工作邮箱"
                           :class="errorEmail?'inputBoxBlur':'inputBox'"
                           v-model="email"
                           v-on:blur="autofocusEm(email)"
                           @focus="emailFocus">
                  </div>
                  <div class="getCodeBox box">
                    <input type="text"
                           placeholder="请输入邮箱收到的验证码"
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
                          v-show="getcodeShow">{{countdownTime}}</span>
                  </div>
                  <div class="getCodeBox box"
                       v-show='imgCodeShow'>
                    <span class="hint"
                          v-show="hintimgCode">请输入右侧图片验证码</span>
                    <input type="text"
                           placeholder="请输入右侧图片验证码"
                           :class="imgCodes?'inputBoxBlur':'inputBox'"
                           v-model="imgCodeMain"
                           v-on:blur="autofocusImgCode(emailCode)"
                           @focus="imgcodeFocus">
                    <span class="imgCode"
                          id="validate">{{validate}}</span>
                  </div>
                  <span class="error_title"
                        v-if="erroPaw">{{erroPaw}}</span>
                </div>
                <button :class="email&&emailCode?'saveBtn main_button_bg':'saveBtn main_button_disabled_bg' "
                        @click="changeBind">更换邮箱</button>
              </div>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 消息提醒====删除任务 -->
    <transition name="fade1">
      <Reminder2 v-if="reminder2Flag"
                 :type="1"
                 :text="errMessage"
                 :sureText="buttonMes"
                 @handleCancle="reminderCancel"
                 @handleSure="reminderSure" />
    </transition>

    <transition name="popBox_k">
      <div class="popBox_k"
           v-show="popBoxShow">
        <i class="iconfont icon-xuanzhong mainColor"></i>
        <span class="hint">
          {{popContent}}（{{countDown}}）
        </span>
      </div>
    </transition>

  </div>
</template>
<script>
import Reminder2 from "../common/reminder2";
import topBar from "../common/topBar";
import "../../api/birthday.js";
import { setInterval } from 'timers';
import { fail } from 'assert';
export default {
  components: {
    Reminder2,
    topBar
  },
  data() {
    return {
      reminder2Flag: false,
      userId: "",
      activeName: "first",
      industryLists: [], //行业信息列表
      profession: "",
      check: true,
      checkTwo: true,
      realName: "", //真实姓名
      personalImg: "", //个人头像
      triangleShow: false,
      radio: "",
      radio2: "",
      job: "", //职位
      tell: "",
      year: '',
      month: '',
      day: '',
      password: "",
      erroPaw: "",
      repPassword: "",
      oldPwd: "",
      hintBoxShow: false,
      email: "",
      emails: '',
      errorPwdTwo: "", //邮箱
      hintName: false,
      errorCode: "", //邮箱
      emailCode: "",
      getcodeShow: false, //获取验证码
      countdownTime: "300s", //倒计时
      imgCodeShow: false,
      imgCodes: "",
      imgCodeMain: "",
      hintPwd: false, //密码提示
      errorPwd: "", //邮箱
      errorEmail: "", //邮箱红线
      xwName: '',
      boundEmail: false, //绑定邮箱
      hintimgCode: false,
      wrongNumber: 0,
      validate: '', // 动态码
      errMessage: '',
      buttonMes: '', //按钮显示字
      logInShow: false, //修改成功 跳转页面
      countDown: 5, //倒计时
      popBoxShow: 0, //弹框 默认消失
      yearNow: new Date().getFullYear(),
      couponSelected: '', //年 
      mySelf: '',
      saveShow: false, //保存信息按钮
      makeSure: false,//确认修改按钮是否置灰
      popContent: '', //弹框的内容
      unionid: '',
    };
  },
  watch: {
    // 真实姓名 
    realName(val, old) {
      if (this.mySelf.realName !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
    },
    // 行业信息 
    profession(val) {
      if (this.mySelf.industry !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
    },
    job(val) {
      if (this.mySelf.position !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
    },
    tell(val) {
      if (this.mySelf.mobi !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
    },
    year(val) {
      let birthday = this.mySelf.birthday.split("-");
      if (birthday[0] !== val) {
        this.saveShow = true;
        console.log(this.mySelf.realName, val)
      } else {
        this.saveShow = false;
      }
    },
    month(val) {
      let birthday = this.mySelf.birthday.split("-");
      if (Number(birthday[1]) !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }

    },
    day(val) {
      let birthday = this.mySelf.birthday.split("-");
      if (birthday[2] !== val) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
    },
  },
  computed: {
    yearLists: function () {
      let yearLists = [];
      for (var i = this.yearNow; i >= 1970; i--) {
        yearLists.push(i)
      }
      return yearLists;
    },
    monthLists: function () {
      let monthList = [];
      for (var i = 1; i <= 12; i++) {
        monthList.push(i)
      }
      return monthList;
    },
    dayList: function () {
      if (this.month && this.year) {
        var dayCount = 0;
        switch (this.month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            dayCount = 31;
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            dayCount = 30;
            break;
          case 2:
            dayCount = 28;
            if ((this.year % 4 == 0) && (this.year % 100 != 0) || (this.year % 400 == 0)) {
              dayCount = 29;
            }
            break;
          default:
            break;
        }
        return dayCount
      } else {
        return;
      }
    }
  },
  methods: {
    getCouponSelected(couponSelected) {
      console.log(couponSelected)
    },
    // 任务删除的提示----确认删除
    reminderSure() {
      this.reminder2Flag = false;
      let pkid = { userpkid: this.userId }
      this.$HTTP('post', '/user_relieve_bindwx', pkid).then(res => {
        this.$message('解除成功');
        this.xwName = '';
      })
    },
    // 任务删除的提示----取消删除
    reminderCancel() {
      this.reminder2Flag = false;
    },
    // =====================================离开后清除页面内容------------
    handleClick(tab, event) {
      this.erroPaw = ''
      this.errorEmail = false;
      this.imgCodes = false;
    },

    // 超过五次 出现图片验证码
    imgcodeFocus() {
      this.imgCodes = false;
      this.erroPaw = "";
    },
    codeFocus() {
      this.erroPaw = '';

      this.errorCode = false;
    },
    // 保存信息
    saveMain() {
      let obj = {
        userId: this.userId,
        pic: this.personalImg,
        realName: this.realName,
        industry: this.profession,
        position: this.job,
        mobi: this.tell,
        birthday: this.year + '-' + this.month + '-' + this.day
      };
      this.$HTTP("post", "/user_update_info", obj).then(res => {
        if (res.code == 200) {
          this.mySelf = {
            userId: this.userId,
            pic: this.personalImg,
            realName: this.realName,
            industry: this.profession,
            position: this.job,
            mobi: this.tell,
            birthday: this.year + '-' + this.month + '-' + this.day
          };
          this.saveShow = false;
          this.$message("信息修改成功");
        } else {
          this.$message("信息修改失败");
        }
      });
    },
    //
    pawdFocus() {
      this.errorPwd = false;
      this.erroPaw = "";
      this.triangleShow = true; //密码信息提示框
    },
    oldPawdFocus() {
      this.erroPaw = "";
    },
    oldPwdAutofocus() {
      if (!this.oldPwd) {
        this.erroPaw = "请输入旧密码";
        return
      }
    },
    //      上传头像
    handleAvatarSuccess(res, file) {
      this.personalImg = res;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg/png/gif/tiff/";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 获取行业信息
    getIndustry() {
      let data = { categoryId: 7 };
      this.$HTTP("post", "/category_get", data).then(res => {
        this.industryLists = res.result;
      });
    },
    // 获取个人信息
    getInfo(userpkid) {
      let data = { userPkid: userpkid };
      this.$HTTP("post", "/user_get", data).then(res => {
        let staffInfo = res.result;
        this.mySelf = res.result;
        this.realName = staffInfo.realName;
        this.personalImg = staffInfo.pic;
        this.emails = staffInfo.email;
        if (staffInfo.industry) {
          this.profession = staffInfo.industry;
        }
        this.job = staffInfo.position;
        this.tell = staffInfo.mobi;
        let birthday = staffInfo.birthday.split("-");
        this.year = birthday[0];
        this.month = Number(birthday[1]);
        this.day = birthday[2];
        this.xwName = staffInfo.nickname;
        this.unionid = staffInfo.unionid;
      });
    },
    popoShow(goLogin) {
      this.popBoxShow = true;
      let clock = window.setInterval(() => {
        this.countDown--;
        if (this.countDown < 1) {
          window.clearInterval(clock);
          this.popBoxShow = false;
          if (goLogin) {
            this.$router.push('/login');
          } else {
            this.boundEmail = false;
          }
          localStorage.setItem('staffInfo', '');
        }
      }, 1000);
    },
    // 确认修改密码
    amendMain() {
      this.autofocusPw();

      if (this.erroPaw == '') {
        let obj = {
          userpkid: this.userId,
          oldPwd: this.oldPwd,
          pwd: this.password
        };
        this.$HTTP("post", "/user_update_pwd2", obj).then(res => {
          if (res.code == 2) {
            this.erroPaw = "旧密码输入错误，请核对后再输入";
          } else {
            this.popoShow(true)

            this.popContent = '密码修改成功,即将跳转到登录页面';

          }
        });
      }
    },
    emailFocus() {
      this.errorEmail = false;
      this.erroPaw = "";
    },
    //      3.失焦事件
    autofocusPw() {
      if (!this.radio || !this.radio2) {
        this.erroPaw = "密码格式不正确，请重新输入";
        this.errorPwd = true;
      }
      this.triangleShow = false;
      if (this.password == "") {
        this.erroPaw = "请输入密码";
      }
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
    //      再次验证密码失焦
    autofocusPwTw() {
      if (this.password !== this.repPassword) {
        this.erroPaw = "两次输入的密码必须保持一致";
        this.errorPwdTwo = true;
        return;
      } else {
        this.erroPaw = "";
      }
      if (this.password == "") {
        this.erroPaw = "请输入密码";
        this.errorPwdTwo = true;
      }
    },



    // 2.  邮箱----------------------------------------------------------------
    getCode(num) {
      this.autofocusEm(this.email);  //先判断是否存在 
      if (this.erroMessage) {
        return false;
      } else {
        this.emailExists(this.email);
        if (typeof num == "number") {
          this.num = num;
          let clock = window.setInterval(() => {
            this.num--;
            this.countdownTime = this.num + "s";
            if (this.num < 1) {
              window.clearInterval(clock);
              this.getcodeShow = false;
            }
          }, 1000);
        } else {
          this.num = 30;
          this.countdownTime = this.num + "s";
          let clock = window.setInterval(() => {
            this.num--;
            this.countdownTime = this.num + "s";
            if (this.num < 1) {
              window.clearInterval(clock);
              this.getcodeShow = false;
            }
          }, 1000);
          let myCenterCode = { 'name': this.name, 'email': this.email, 'num': new Date().getTime() }
          localStorage.setItem('myCenterCode', JSON.stringify(myCenterCode))
        }
      }
    },
    // 获取验证码
    getEmailCode(email) {
      let data = { email: email };
      this.$HTTP("post", "/user_code_get", data).then(res => {
        this.CODES = res.result;
      });
    },
    // 点击注册
    register() {
      this.autofocusEm(this.email);
      this.autofocusPw();
      this.autofocusPwTw();
      // 1.如果邮箱验证码输入正确 则进入下一步
      if (this.erroPaw !== "") {
        return false;
      }
      if (this.$md5(this.emailCode) == this.CODES) {
        console.log("图片校验码正确");
        let nums = localStorage.getItem("wrongNum");
        if (nums < 5) {
          console.log("邮箱验证码正确，且不需要输入图片验证码");
          // this.zhuce();
        } else {
          console.log("图片校验码错误，需要输入图片验证码");
          let imgCodeMain = this.imgCodeMain.toUpperCase();
          this.validate = this.validate.toUpperCase();
          if (imgCodeMain == this.validate) {
            console.log("需要输入图片验证码，但是图片验证码输入正确");
            // this.zhuce();
          } else {
            console.log("需要输入图片验证码，但是图片验证码输入错误");
            this.imgCodes = true;
            this.erroPaw = "图片验证码输入错误";
          }
        }
      } else {
        // console.log("验证码错误");
        this.erroPaw = "验证码错误";
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
          localStorage.setItem("myCenterCode", '');
        }
      });
    },
    //      密码框事件==========================
    pawdFocusTwo() {
      this.errorPwdTwo = false; //输入密码框
      this.erroPaw = "";
    },
    //      邮箱输入框设置
    autofocusEm(email) {
      if (this.email == "") {
        this.errorEmail = "请输入您的工作邮箱";
        this.erroPaw = "请输入您的工作邮箱";
        return false;
      } else {
        let emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
        if (!emailReg.test(this.email)) {
          this.erroPaw = "请输入正确的邮箱格式";
          this.errorEmail = true;
          return false;
        } else {
          this.erroPaw = "";
          // this.getcodeShow = false;
          this.errorEmail = false;
        }
      }
    },
    // 判断邮箱是否存在
    emailExists(email) {
      let datas = { info: email };
      this.$HTTP("post", "/user_exists_info", datas).then(res => {
        if (res.code == 200) {
          // 1.判断邮箱不存在 才发送验证码
          this.getEmailCode(this.email);
          this.getcodeShow = true;
        } else if (res.code == 1) {
          // this.getcodeShow = false;
          // 2.如果已存在 不发送验证码
          this.erroPaw = "该邮箱已经绑定其他Eggs账户，请解绑后尝试绑定";

        }
      });
    },
    autofocusCode() {
      if (this.emailCode == "") {
        this.erroPaw = "验证码输入错误，请核对后再输入";
        this.errorCode = true;
        return false;
      }
    },
    // 错误五次 图片验证码 失焦事件
    autofocusImgCode() {
      if (this.imgCodeMain == "") {
        this.erroPaw = "请输入图片验证码";
        this.imgCodes = true;
      }
    },
    emailFocus() {
      this.errorEmail = false;
      this.erroPaw = "";
    },

    // 超过五次 出现图片验证码
    imgcodeFocus() {
      this.imgCodes = false;
      this.erroPaw = "";
    },
    pwFocus() {
      this.hintPw = true;
    },
    // 确认提交
    confirmToSubmit() {

      this.autofocusEm();
      this.autofocusCode();
      this.autofocusPw();
      this.autofocusPwTw();
      if (this.erroPaw) return;
      if (this.$md5(this.emailCode) == this.CODES) {
        let nums = localStorage.getItem("wrongNum");
        if (nums < 5) {
          // console.log("邮箱验证码正确，且不需要输入图片验证码");
          this.bindEmail();
        } else {
          // console.log("图片校验码错误，需要输入图片验证码");
          let imgCodeMain = this.imgCodeMain.toUpperCase();
          this.validate = this.validate.toUpperCase();
          if (imgCodeMain == this.validate) {
            // console.log("需要输入图片验证码，并且图片验证码输入正确");
            this.bindEmail();
          } else {
            // console.log("需要输入图片验证码，但是图片验证码输入错误");
            this.imgCodes = true;
            this.erroPaw = "动态验证码输入错误，请核对后再输入";
          }
        }
      } else {
        this.erroPaw = "验证码输入错误，请核对后再输入";
        this.errorCode = true;
        this.wrongNumber++;
        localStorage.setItem("wrongNum", this.wrongNumber);
        let nums = localStorage.getItem("wrongNum");
        if (nums >= 5) {
          this.imgCodeShow = true;
        }
      }
    },
    // 绑定账号和密码
    bindEmail() {
      let data = { userId: this.userId, email: this.email, pwd: this.password }
      this.$HTTP('post', '/user_updateByUserId_emailAndPwd', data).then(res => {
        if (res.code == 200) {
          localStorage.setItem("wrongNum", 0);
          this.activeName = 'first';
          this.$message.success('邮箱及密码设置成功，下次您可以使用该邮箱及密码进行登录（5）')
        }
      })

    },
    // 更换绑定的邮箱
    changeBind() {
      this.autofocusEm();
      if (this.$md5(this.emailCode) == this.CODES) {
        let nums = localStorage.getItem("wrongNum");
        if (nums < 5) {
          // console.log("邮箱验证码正确，且不需要输入图片验证码");
          this.changeBindEmail();
        } else {
          // console.log("图片校验码错误，需要输入图片验证码");
          let imgCodeMain = this.imgCodeMain.toUpperCase();
          this.validate = this.validate.toUpperCase();
          if (imgCodeMain == this.validate) {
            // console.log("需要输入图片验证码，并且图片验证码输入正确");
            this.changeBindEmail();
          } else {
            // console.log("需要输入图片验证码，但是图片验证码输入错误");
            this.imgCodes = true;
            this.erroPaw = "动态验证码输入错误，请核对后再输入";
          }
        }
      } else {
        this.erroPaw = "验证码输入错误，请核对后再输入";
        this.errorCode = true;
        this.wrongNumber++;
        localStorage.setItem("wrongNum", this.wrongNumber);
        let nums = localStorage.getItem("wrongNum");
        if (nums >= 5) {
          this.imgCodeShow = true;
        }
      }
    },
    // 更换绑定的邮箱
    changeBindEmail() {
      let obj = { userPkid: this.userId, email: this.email }
      this.$HTTP('post', '/user_binding_email', obj).then(res => {
        localStorage.setItem("wrongNum", 0);
        localStorage.setItem("myCenterCode", '');
        this.popoShow(false);
        this.popContent = '邮箱更换成功，下次请使用' + this.emails + '登录，登录密码不变';
      })
    },
    // 解除微信绑定
    removeWxBind() {
      if (!this.emails) {
        this.buttonMes = '解除绑定'
        this.errMessage = '这是登录此账号的最后一个凭证了。接触绑定后，此账号数据将丢失，无法找回'
      } else {
        this.buttonMes = '确认'
        this.errMessage = '解除绑定后将无法继续使用该账号进行登录'
      }
      this.reminder2Flag = true;
    },
    //绑定微信
    bindWx(nickname, unionid) {
      let data = { userId: this.userId, nickname: nickname, unionid: unionid }
      this.$HTTP('post', '/user_binding_bindwx', data).then(res => {
        this.xwName = res.result;
      })
    }
  },
  created() {

    if (localStorage.getItem('myCenterCode')) {
      let myCenterCode = JSON.parse(localStorage.getItem('myCenterCode'));
      this.name = myCenterCode.name;
      this.email = myCenterCode.email; let newNums = 30 - Math.ceil(new Date().getTime() / 1000 - myCenterCode.num / 1000);
      if (newNums >= 0) {
        this.getCode(newNums);
      } else {
        this.num = 0;
        localStorage.setItem('myCenterCode', '')
      }
    }
    if (localStorage.getItem("staffInfo")) {
      let staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
      this.userId = staffInfo.userPkid;
      let wrongNum = localStorage.getItem("wrongNum");
      this.imgCodeShow = wrongNum >= 5;
      this.getInfo(this.userId);
      this.getIndustry();
    } else {
      this.$router.push('/login')
    }


    let urls = decodeURI(window.location.href).split("?")[1];
    if (urls) {
      let url = decodeURI(window.location.href)
        .split("?")[1]
        .split("&");
      if (url[0].split("=")[0] == 'openid') {
        console.log(2322)
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
            this.xwName = nickname;
          }
        }
      }
      if (url[0].split("=")[0] == 'state') {
        if (url[0].split("=")[1] == 1) {
          this.$message('该微信已经绑定其他Eggs账户，请解绑后尝试绑定')
        } else if (url[0].split("=")[1] == 0) {
          let unionid = url[1].split("=")[1];
          let nickname = url[2].split("=")[1];
          this.xwName = nickname;
          console.log('11111111')

          this.bindWx(nickname, unionid);
        }
      }
    }


  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      let codeStr =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      // let randomCode = $("#validate").text('2222222');
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
        _this.validate = str;
        // $("#validate").text(str);
        // randomCode = str; //呈现在页面上
      }
      // 首次获取验证码
      getCode();
      // 点击获取验证码
      $("#validate").click(function () {
        getCode();
      });
    })
  }
};
</script>
<style lang='less'>
@import "../../assets/css/base.less";
.mainColor {
  color: #3684ff;
}
.errRed {
  color: red;
}
.popBox_k {
  width: 400px;
  min-height: 65px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 15px 0px rgba(59, 81, 133, 0.3);
  border-radius: 4px;
  position: fixed;
  left: 50%;
  margin-left: -200px;
  top: 50px;
  z-index: 99;
  padding: 10px 30px;
  .box_sizing;
  line-height: 1.5;
  .icon-xuanzhong {
    position: absolute;
    left: 35px;
    top: 10px;
  }
  .hint {
    display: inline-block;
    width: 307px;
    margin-left: 30px;
  }
}
.popBox_k-enter-active,
.popBox_k-leave-active {
  top: 50px;
  transition: all 0.5s;
}
.popBox_k-enter, .popBox_k-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  top: -10px;
}
#app,
#myCenter {
  width: 100%;
  height: 100vh;
  background: #fafafa;
  position: relative;
  .optionsMain {
    position: relative;
    .getCodeBox {
      width: 220px;
      height: 32px;
      position: relative;
      .el-button {
        padding: 0;
      }
      .getCode {
        position: absolute;
        right: -110px;
        top: 0;
        width: 100px;
        height: 32px;
        border: 1px solid rgba(229, 229, 229, 1);
        position: absolute;
      }
      .getCodes {
        position: absolute;
        right: -110px;
        top: 0;
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
        border-radius: 4px;
        width: 100px;
        height: 32px;
        position: absolute;
        right: -110px;
        bottom: 0;
        background: #edf4f7;
        letter-spacing: 7px;
        text-align: center;
        line-height: 32px;
        font-style: italic;
        font-weight: bold;
      }
    }
    .box {
      width: 220px;
      height: 32px;
      position: relative;
      .hint {
        text-align: left;
        font-size: 12px;
        padding-left: 10px;
        position: absolute;
        bottom: 30px;
        color: #999999;
        left: 0;
      }
      .inputBox {
        width: 220px;
        height: 32px;
        border: 1px solid #999999;
        padding: 0 10px;
        .box_sizing;
        border-radius: 4px;
      }
      .inputBoxBlur {
        width: 220px;
        height: 32px;
        border: 1px solid red;
        border-radius: 4px;
        padding: 0 10px;
        .box_sizing;
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
      display: inline-block;
      color: red;
      left: 0;
      font-size: 12px;
      bottom: 0;
    }
  }
  .topBar_k {
    width: 100%;
    height: 50px;
    background: #ffffff;
    box-shadow: 1px 0px 4px 0px rgba(95, 95, 95, 0.3);
  }
  .mainBox {
    width: 780px;
    height: calc(100vh - 105px);
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(104, 104, 104, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .birthday {
      text-align: left;
      select {
        margin-right: 10px;
        border-radius: 3px;
        width: 40px;
        height: 32px;
        border: 1px solid rgba(208, 208, 208, 1);
      }
      .year {
        width: 58px;
      }
    }
    .next {
      position: absolute;
      top: 15px;
      right: 20px;
      color: #3684ff;
      z-index: 999;
    }
    .next:hover {
      text-decoration: none;
    }
  }
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #f2f2f2;
    z-index: 1;
  }
  .el-tabs__item {
    // padding: 0 20px;
    height: 50px;
    line-height: 50px;
  }
  .el-tabs__nav-scroll {
    padding: 0 20px;
  }
  #pane-first,
  #pane-second,
  #pane-third {
    width: 100%;
    height: calc(100vh - 110px);
    // overflow: auto;
    .myMain {
      width: 100%;
      height: calc(100vh - 170px);
      overflow: auto;
      .hintBox {
        position: relative;
        padding: 12px 24px;
        height: 66px;
        background: rgba(255, 243, 203, 1);
        .box_sizing;
        .perfect {
          margin: 0;
        }
        p {
          line-height: 1.6;
        }
        .h1 {
          font-weight: bold;
          font-size: 14px;
        }
        .main_button_bg {
          position: absolute;
          right: 25px;
          top: 18px;
        }
      }
      .oldpawList {
        li {
          text-align: right;
          margin-bottom: 10px;
        }
      }
      .personalMainBox {
        width: 300px;
        height: 100%;
        margin: 0 auto;
        .successBox {
          width: 100%;
          height: 100%;

          background: red;
        }
      }
      .changePassword {
        margin: 80px auto 0;
        .optionsList {
          margin-right: 20px;
        }
      }
      // 绑定邮箱 盒子
      .boundEmailBox {
        width: 400px;
        .optionsList {
          margin: 0 5px;
        }
      }
      .optionsMain {
        text-align: right;
      }
      .email {
        margin-right: 10px;
        li {
          text-align: right;
          line-height: 2.5;
          margin-bottom: 17px;
        }
      }
      .changePassword {
        li {
          text-align: right;
          line-height: 2.5;
          margin-bottom: 17px;
        }
      }
      .changeEmail {
        .error_title {
          top: 90px;
        }
      }
      .detailed {
        li {
          text-align: right;
          line-height: 40px;
        }
      }
      .accountInformation {
        margin-left: 25px;
        text-align: left;
        .xwName {
          width: 140px;
          display: inline-block;
          text-align: left;
        }
      }
      .goBound {
        margin-left: 20px;
        li {
          text-align: left;
        }
      }
      li {
        line-height: 40px;
      }
      .personalInfobox {
        input {
          width: 220px;
          height: 32px;
          border: 1px solid rgba(208, 208, 208, 1);
          border-radius: 4px;
          padding: 0 10px;
          .box_sizing;
          left: 0;
        }
      }

      .title {
        font-size: 16px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        margin: 40px 0;
        text-align: center;
      }

      .password {
        position: relative;
        // line-height:
      }
      .box {
        height: 32px;
        position: relative;
        margin-bottom: 20px;
        i {
          position: absolute;
          right: 10px;
          bottom: 5px;
        }
        .hint {
          font-size: 12px;
          padding: 5px 0;
          position: absolute;
          color: #999999;
          bottom: 30px;
        }
        .inputBox {
          width: 220px;
          height: 32px;
          border: 1px solid rgba(208, 208, 208, 1);
          border-radius: 4px;
          padding: 0 10px;
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
          text-align: left;
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
        text-align: left;
        line-height: 1;
      }
      .saveBtn {
        margin: 40px 100px;
      }
      // 修改头像
      .logo_k {
        display: block;
        .border_radius(@br: 50%);
        width: 66px;
        height: 66px;
        margin: 20px auto;
        overflow: hidden;
        cursor: pointer;
        position: relative;

        img {
          width: 66px;
        }
        .editor {
          display: block;
          .border_radius(@br: 50%);
          width: 66px;
          height: 66px;
          background: rgba(0, 0, 0, 0);
          color: #fff;
          line-height: 66px;
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          opacity: 0;
          z-index: 1000;
        }
        .editor:hover {
          background: rgba(0, 0, 0, 0.7);
          opacity: 1;
        }
      }
    }
  }
}
</style>


