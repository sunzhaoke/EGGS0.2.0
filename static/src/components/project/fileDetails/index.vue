<template>
    <div id="FileDetails">
        <div class="fileTop">
            <div class="fl leftNav">
                <ul>
                    <li v-for='(list,index) of this.info.menuList'
                        :key="index"
                        class="fl"
                        v-show="index<3">
                        {{list}} /
                    </li>
                    <span>
                        <span v-if="modifyShow"
                              class="cur fileName"> {{fileItem.FileName}}
                            <i v-if='fileItem.isOwn'
                               class="iconfont  icon-bianji"
                               @click="ModifyFileName"></i>
                        </span>
                        <input v-show='!modifyShow'
                               type="text"
                               v-model="fileItem.FileTitle"
                               id="fileNameInput"
                               @blur="autofocusFileName(fileItem)">
                    </span>
                </ul>
            </div>
            <div class="right fr">
                <!-- <span class="cur">
                    <i class="iconfont icon-tihuan"> </i> 文件替换</span> -->
                <span class="cur">
                    <i class="iconfont icon-xiazai">
                        <a :href="fileItem.Url"
                           :download="fileItem.FileName">下载</a>
                    </i>
                </span>
                <span class="cur">
                    <i class="iconfont icon-fenxiang"></i> 分享
                </span>
                <!-- <span class="cur"
                      @click="delResultFile(fileItem)">
                    <i class="iconfont icon-delete"></i> 删除
                </span> -->
                <span class="cur"
                      @click="closeDetails">
                    <i class="iconfont icon-guanbijiantou"></i>
                </span>
            </div>
        </div>
        <div class="fileContent">
            <!-- 左侧列表 -->
            <div class="content_box">
                <div id='leftFileOne' class="leftFileOne">
                    <!-- 文件预览 -->
                    <div class="fileBoxBig">
                        <div id='fileListBox' class="fileListBox">
                            <!-- 图片预览 -->
                            <div 
                                class="imgBg"
                                v-if="fileItem.FileType == 1 "  
                                v-loading="imgLoading"
                                element-loading-text="Loading"
                                element-loading-spinner="el-icon-loading"
                                >
                                <img id='ImgBg' :src="fileItem.Url"
                                    alt=""
                                    draggable="true">
                            </div>
                            <div class='otherType'
                                v-if="fileItem.FileType == 2 || fileItem.FileType == 3 || fileItem.FileType == 5 || fileItem.FileType == 11">
                                <iframe :src="fileItem.Url"
                                        width='100%'
                                        height='100%'
                                        frameborder='0'>
                                </iframe>
                            </div>
                            <div class="pdfType"
                                v-if='fileItem.FileType == 6'>
                                <c-pdf @closepdf="closepdf"
                                    :pdfurl="this.fileItem.Url"></c-pdf>
                            </div>
                            <div v-if="fileItem.FileType == 7"
                                class="audio_div">
                                <div class="audioBox">
                                    <div  v-if='true' class="iframe_title">{{fileItem.FileName}}</div>
                                    <audio v-if="fileItem.FileType == 7"
                                        :src="fileItem.Url"
                                        controls="controls"
                                        autoplay="autoplay"
                                        preload="preload">亲 您的浏览器不支持html5的audio标签</audio>
                                </div>
                            </div>
                            <div v-if="fileItem.FileType == 8"
                                class="video_div">
                                <div class="videoBox">
                                    <video v-if="fileItem.FileType == 8"
                                        :src="fileItem.Url"
                                        controls="controls"
                                        autoplay="autoplay"
                                        preload="preload">亲 您的浏览器不支持html5的video标签</video>
                                </div>
                            </div>
                            <div class="OtherStyle"
                                v-if="fileItem.FileType == 0||fileItem.FileType == 4 || fileItem.FileType == 9 || fileItem.FileType ==10">
                                <div class="otherBox">
                                    <div class="topName">
                                        <div class="c"> {{fileItem.FileName}} </div>
                                    </div>
                                    <div class="fileImg">
                                        <img class="typeTwo"
                                            v-if="fileItem.FileType === 0"
                                            src="../../../assets/img/file_b/0.png">
                                        <img class="typeTwo"
                                            v-if="fileItem.FileType === 4"
                                            src="../../../assets/img/file_b/4.png">
                                        <img class="typeTwo"
                                            v-if="fileItem.FileType === 9"
                                            src="../../../assets/img/file_b/9.png">
                                        <img class="typeTwo"
                                            v-if="fileItem.FileType === 10"
                                            src="../../../assets/img/file_b/10.png">
                                    </div>
                                    <div class="dowButton cur">
                                        <a :href="fileItem.Url" :download="fileItem.FileName">下载文件（{{fileItem.Size}}）</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="personalInfo">
                            <span class="userImg">
                                <img :src="fileItem.UserPic"
                                    alt="">
                            </span>
                            <span class="nickName">{{fileItem.nickName}}</span>
                            <span class="formatTime">{{fileItem.formatTime}}</span>
                            <span class="original cur fr" v-if='false'>
                                <i class="iconfont icon-iconfontchakanyuantu"></i>
                                查看原图
                            </span>
                        </div>
                    </div>
                    <!-- 全部评论 -->
                    <div class="commentBox">
                        <div class="topInputBox">
                            <textarea name=""
                                    placeholder="输入评论内容，可@通知对方，Enter快速发布"
                                    v-model="commentInfo"
                                    class="commentiInput">
                            </textarea>
                            <div class="atButton">
                                <!-- <i class="iconfont ">@</i>
                                <i class="iconfont icon-biaoqing"></i> -->
                                <span class="fr commentButton"
                                    :class="commentInfo?'main_button_bg':'main_button_disabled_bg'"
                                    @click="sendComment(commentInfo)">评论</span>
                            </div>
                        </div>
                        <div class="allComment">
                            <p v-if='commentInfoLists.length'>全部评论</p>
                            <ul>
                                <li class="clearfix commentList"
                                    v-for="(list,index) of commentInfoLists"
                                    :key="index">
                                    <span class="commentator">
                                        <img :src="list.userPic"
                                            alt="">
                                    </span>
                                    <div class="commentatorInfo">
                                        <p class="name">{{list.nickName}}</p>
                                        <p class="infoBox">{{list.descn}}</p>
                                    </div>
                                    <span class="fr time">
                                        <p>{{list.createTime}}</p>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右侧列表 -->
            <div id='rightFileLists' class="rightFileLists fr">
                    <el-select 
                        class='el_select'
                        v-model="defaultGroupList"
                        @change='checkGroup(defaultGroupList)'
                        placeholder="请选择">
                        <el-option v-for="item in groupList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                <ul class="allFileLists">
                    <li v-for="(list,index) of fileLists"
                        :key="index"
                        @click="checkFile(list,index)"
                        class="allList"
                        :class="{'allListCheck':checkIndex==index}"
                        :id="checkIndex==index ? 'selectFile' : ''"
                        >
                        <span class="check"
                              v-show="checkIndex==index"></span>
                        <span class="fileBox">
                            <img :src="list.UrlMin"
                                 alt="">
                        </span>
                        <p>{{list.FileName}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import cPdf from "./pdf.vue";
export default {
  components: {
    cPdf
  },
  data() {
    return {
      groupList: [], //分组列表
      defaultGroupList: "",
      fileListsAll: "", //文件列表 总
      checkIndex: 0, //当前选择index
      fileLists: "",
      filePkid: "", //文件pkid
      commentInfo: "", //信息
      modifyShow: true, //修改姓名
      FileName: "",
      FileType: "",
      fileItem: "", // 文件预览对象,
      everyFileList: "",
      Url: "",
      oneFilelist: "", //个人文件渲染列表
      isshowpdf: false,
      power: true, //是否有权限显示 修改按钮
      fileProgressList: [], // 上传进度列表
      uploadProgressFlag: false, // 上传进度显示隐藏
      fangdaShow: true, //全屏 缩小显示icon
      commentInfoLists: [],
      loginUser: JSON.parse(localStorage.getItem("staffInfo")), // 当前登录者的信息
      imgLoading: false, // 图片加载
    };
  },
  props: ["info"],
  methods: {
    // 关闭文件详情
    closeDetails() {
      this.$emit("closeDetails");
    },
    // 切换文件
    checkFile(list, index) {
      this.checkIndex = index;
      this.fileItem = list;
      this.filePreview(list);
    },
    // 切换分组
    checkGroup(defaultGroupList) {
      for (let list of this.info.fileList) {
        if (list.pkid == defaultGroupList) {
          this.fileLists = list.fileList;
          if (this.fileLists.length) {
            this.checkFile(this.fileLists[0], 0);
          }
          return;
        }
      }
    },
    sendComment(info) {
      let data = {
        myUserId: this.loginUser.userPkid,
        type: this.info.type,
        descn: info,
        id: this.fileItem.FilePkid
      };
      this.$HTTP("post", "/comment_add", data).then(res => {
        let infoList = {
          userPic: this.loginUser.pic,
          nickName: this.loginUser.realName,
          descn: info,
          createTime: res.result.CreateTime
        };
        this.commentInfoLists.unshift(infoList);
        this.commentInfo = "";
      });
    },
    // 结果展示文件 可以删除
    delResultFile(fileItem) {
      let index = this.fileLists.findIndex(res => {
        return res.FilePkid == fileItem.FilePkid;
      });

      let data = { FilePkid: fileItem.FilePkid };
      this.$HTTP("post", "/stageTaskFile_delete", data).then(res => {
        this.fileLists.splice(index, 1);
        this.checkIndex = 0;
        // console.log()
        this.fileItem = this.fileLists[0];
        this.filePreview(this.fileItem);

        this.fileLists = [...this.fileLists];
      });
    },
    // 点击关闭pdf文件预览
    closepdf() {
      this.isshowpdf = false;
      this.iframeFlag = false;
    },
    // 全屏显示
    fullScreen() {
      this.fangdaShow = !this.fangdaShow;
      var content = document.getElementById("imgType");
      var rfs =
          content.requestFullScreen ||
          content.webkitRequestFullScreen ||
          content.mozRequestFullScreen ||
          content.msRequestFullScreen,
        wscript;

      if (typeof rfs != "undefined" && rfs) {
        rfs.call(content);
        return;
      }

      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    // 关闭全屏显示
    closeFull() {
      this.fangdaShow = !this.fangdaShow;
      var content = document.getElementById("imgType");
      var content = document,
        cfs =
          content.cancelFullScreen ||
          content.webkitCancelFullScreen ||
          content.mozCancelFullScreen ||
          content.exitFullScreen,
        wscript;

      if (typeof cfs != "undefined" && cfs) {
        cfs.call(content);
        return;
      }
      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
    },
    // 修改文件名称
    autofocusFileName(item) {
      let newTitle = item.FileTitle + "." + item.Type;
      if (item.FileTitle === "") {
        this.$message({
          type: "warning",
          message: "文件名不能为空！",
          center: true
        });
        $("#fileNameInput").focus();
        return;
      }
      // 先判重，如果有重复的名字--提示，否则--发送请求
      let repeat = this.fileLists.findIndex(
        ele => ele.FileName === newTitle && ele.FilePkid !== item.FilePkid
      );
      if (repeat !== -1) {
        this.$message({
          type: "error",
          message: "该分组内含有同名文件！",
          center: true
        });
        $("#fileNameInput").focus();
        return;
      }
      if (newTitle === this.fileItem.FileName) {
        this.modifyShow = true;
        return;
      }
      let data = { FilePkid: item.FilePkid, newTitle: newTitle };
      this.$HTTP("post", "/stageTaskFile_update", data).then(res => {
        this.fileItem.FileTitle = item.FileTitle;
        this.fileItem.FileName = newTitle;
      });
      this.modifyShow = true;
    },
    ModifyFileName() {
      this.modifyShow = !this.modifyShow;
      this.$nextTick(res => {
        this.$("#fileNameInput").focus();
      });
    },
    // 下一个文件
    next() {
      if (this.checkIndex < this.everyFileList.length - 1) {
        this.checkIndex = this.checkIndex + 1;
        this.oneFilelist = this.everyFileList[this.checkIndex];
        this.filePreview(this.everyFileList, this.oneFilelist, this.checkIndex);
      } else {
        this.$message("没有更多文件了");
        return;
      }
    },
    // 进度判断是否全部完成
    popFileProgress(list) {
      let indexs = list.findIndex(ele => {
        return ele.progress < 100;
      });
      if (indexs == -1) {
        return true;
      } else {
        return false;
      }
    },
    // 点击文件预览
    filePreview(item) {
      // 1.图片: 1
      // 2.pdf: 6
      // 3.可以用office online预览的文件: 2 3 5
      // 4.音频: 7
      // 5.视屏: 8
      // 6 txt
      // 不可预览的文件: 其他
      // console.log('zhixing', item)
      // console.log('type222222', item.FileType)
      this.imgLoading = false;
     
      if(item.FileType === 1) {
        this.$nextTick(() => {
            $('#fileListBox').css({height: 420 + 'px'});
            let ele = document.getElementById('ImgBg');
            let w, h;
            if(ele.naturalWidth) {
                w = ele.naturalWidth;
                h = ele.naturalHeight;
                let res = {w, h};
                let nowW = $('#ImgBg').width();
                if(res.h <= 420 || res.w > res.h) {
                    $('#fileListBox').css({height: 420 + 'px'});
                }else {
                    // console.log(res, $('#ImgBg').width());
                    if(nowW < res.w) {
                        let present = (nowW / res.w).toFixed(2);
                        $('#fileListBox').css({height: res.h * present + 'px'});
                    }else {
                        $('#fileListBox').css({height: res.h + 'px'});
                    }
                }
            }else {
                this.imgLoading = true;
                let Img = new Image();
                Img.src = ele.src;
                Img.onload = () => {
                    w = Img.width;
                    h = Img.height;
                    this.imgLoading = false;
                    let res = {w, h};
                    let nowW = $('#ImgBg').width();
                    if(res.h <= 420 || res.w > res.h) {
                        $('#fileListBox').css({height: 420 + 'px'});
                    }else {
                        // console.log(res, $('#ImgBg').width());
                        if(nowW < res.w) {
                            let present = (nowW / res.w).toFixed(2);
                            $('#fileListBox').css({height: res.h * present + 'px'});
                        }else {
                            $('#fileListBox').css({height: res.h + 'px'});
                        }
                    }

                }
            }
           
        });
      }else if (item.FileType === 6) {
        this.$nextTick(() => {
          this.isshowpdf = true;
          $('#fileListBox').css({height: "calc(100vh - 198px)"});
          console.log($('#fileListBox').height());

        });
      } else if (
        item.FileType == 2 ||
        item.FileType == 3 ||
        item.FileType == 5
      ) {
        let adds = this.fileItem.Url.indexOf("view.officeapps.live.com");
        if (adds === -1) {
          let url2 = "http://eggs.apexgame.cn/" + item.Url;
          url2 = encodeURIComponent(url2);
          let url3 = "https://view.officeapps.live.com/op/view.aspx?src=";
          this.fileItem.Url = url3 + url2;
        }
        this.$nextTick(() => {
          this.iframeFlag = true;
          $('#fileListBox').css({height: "calc(100vh - 198px)"});
          console.log($('#fileListBox').height());

        });
      } else if (item.FileType == 7 || item.FileType == 8) {
        this.$nextTick(() => {
          this.iframeFlag = true;
          $('#fileListBox').css({height: 420 + 'px'});
        });
      } else if (item.FileType === 11) {
        this.$nextTick(() => {
          this.iframeFlag = true;
          $('#fileListBox').css({height: "calc(100vh - 198px)"});
          console.log($('#fileListBox').height());

        });
      } else {
        // this.$message.warning("此文件类型暂不支持预览，可点击下载");
        this.$nextTick(() => {
            $('#fileListBox').css({height: 420 + 'px'});
          console.log($('#fileListBox').height());

        })
      }

    },
    // 获取图片的宽高
    getImgWH(id) {
        return new Promise((resolve) => {
            this.$nextTick(() => {
                let ele = document.getElementById(id);
                let w, h;
                if(ele.naturalWidth) {
                    w = ele.naturalWidth;
                    h = ele.naturalHeight;
                }else {
                    let Img = new Image();
                    Img.src = ele.src;
                    Img.onload = () => {
                        w = Img.width;
                        h = Img.height;
                    }
                }
                resolve ({w, h});
            });
        });
    },
    // 文件上传超出提示
    handleExceed(files, fileList) {
      this.$message.warning("最多只能选择9个文件");
    },

    // 文件上传之前
    beforeUpload(file) {
      if (!this.uploadProgressFlag) {
        this.uploadProgressFlag = true;
      }
      let sizes = this.conver(file.size);
      let FileType = this.getSuffix(file.name);
      FileType = this.getFlieTyle(FileType);
      let obj = {
        uid: file.uid,
        size: sizes,
        name: file.name,
        type: this.info.type,
        progress: 0,
        status: false,
        FileType: FileType,
        imgUrl: ""
      };
      this.fileProgressList.unshift(obj);
    },

    // 文件上传改变
    uploadChange(file, fileList) {
      // this.uploadListLength = fileList.length;
      // console.log('文件上传改变uploadChange',this.nowUploadSelectedList, fileList);
    },

    // 文件上传成功（返回文件ID）
    uploadSuccess(res, file, fileList) {
      this.fileUpload(res, file);
    },

    // 文件上传进度
    uploadProgress(event, file, fileList) {
      let percents = parseInt(event.percent);
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].progress = percents;
        if (
          !this.fileProgressList[ids].imgUrl &&
          this.fileProgressList[ids].FileType == 1
        ) {
          this.fileProgressList[ids].imgUrl = file.url;
        }
      }
    },

    // 文件上传
    fileUpload(fileIds, file) {
      let obj = { articlePkid: this.teskId, fileIds: fileIds };
      this.$HTTP("post", "/AppendTaskFile", obj)
        .then(res => {
          for (let ele of res.result) {
            this.$set(ele, "checked", false);
            this.$set(ele, "delFlag", false);
            this.$set(ele, "percentFile", null);
            this.$set(ele, "FileType", this.getFlieTyle(ele.FileType));
          }

          this.fileList = res.result.concat(this.fileList);
          console.log("YYYYYY上传成功", this.fileList, res);

          let ids = this.fileProgressList.findIndex(ele => {
            return ele.uid === file.uid;
          });

          if (ids !== -1) {
            this.fileProgressList[ids].status = true;
          }

          let returns = this.popFileProgress(this.fileProgressList);
          if (this.uploadProgressFlag && returns) {
            setTimeout(() => {
              this.closeProgress();
            }, 2000);
          }
        })
        .catch(err => {
          console.log("上传错误", err);
        });
      this.clearCard(2);
    },
    // 设置文件列表的样式
    setLeft() {
        this.$nextTick(() => {
            let left = $('#leftFileOne').offset().left;
            $('#rightFileLists').css({left: left + 880 + 'px'});

        });
    },
    // 获取未分区列表
    getGroupList(info) {
      for (let list of info.fileList) {
        this.groupList.push({ label: list.groupName, value: list.pkid });
        this.defaultGroupList = info.groupIndex;
      }
      this.fileLists = info.fileList[info.groupIndex].fileList;
      this.checkIndex = info.fileIndex;
      this.fileItem = this.fileLists[info.fileIndex];
      this.filePreview(this.fileItem);
      this.getCommenList(this.fileItem.FilePkid);
      this.$nextTick(() => {
        document
          .getElementById("selectFile")
          .scrollIntoView({ behavior: "smooth" });
      });
    },
    // 获取评论列表
    getCommenList(fileId) {
      let data = {
        myUserId: this.loginUser.userPkid,
        type: this.info.type,
        id: fileId,
        page: "",
        number: ""
      };
      this.$HTTP("post", "/comment_get_list", data).then(res => {
        var object2 = [];
        for (let list of res.result) {
          for (let i of list.user) {
            object2.push(Object.assign(list, i));
          }
        }
        this.commentInfoLists = object2;
      });
    }
  },
  created() {
    this.getGroupList(this.info);
    this.setLeft();
    // console.log(this.info);
  },
  mounted() {
        window.onresize = () => {
            this.setLeft();
        }
        this.$nextTick(() => {
            $('.task_detail_yun').eq(0).css({zIndex: 14});
        });
  },
  beforeDestroy() {
    $('.task_detail_yun').eq(0).css({zIndex: 11});
  }
  
};
</script>
<style lang='less'>
@import "../../../assets/css/base.less";
.el-button {
  border: none !important;
  background: none;
  padding: 0 !important;
}

#FileDetails {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 90;
  background: #535353;
  font-size: 14px;

  i {
    font-size: 12px;
  }
  .fileTop {
    height: 50px;
    padding: 0 25px;
    .box_sizing;
    background: #ffffff;
    .leftNav {
      line-height: 50px;
      .el-breadcrumb {
        line-height: 50px;
      }
      .fileName {
        line-height: 50px;
      }
      #fileNameInput {
        // width: ;
      }
    }
    .right {
      line-height: 50px;
      color: #666666;
      span {
        margin-left: 20px;
      }
    }
  }
  .fileContent {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    padding-top: 24px;
    .content_box {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
    }
    .leftFileOne {
      width: 880px;
      height: calc(100% - 100px);
      padding-bottom: 20px;
      position: absolute;
      left: 50%;
      margin-left: -555px;
      .fileBoxBig {
        // width: 100%;
        // min-height: 500px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 25px 20px;
        .box_sizing;
        .fileListBox {
          border: 1px solid rgba(238, 238, 238, 1);
          .box_sizing;
          iframe {
            width: 100% !important;
            height: 100% !important;
          }
        }
      
        .imgBg {
          text-align: center;
          height: 100%;
          width: 100%;
          background: rgba(250, 250, 250, 1);
          position: relative;
          overflow: hidden;
          img {
            position: absolute;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
          }
        }
        .otherType {
          height: 100%;
        }
        .pdfType,
        .audio_div,
        .video_div {
          max-height: 100%;
          overflow: auto;
        }
        .audio_div {
          width: 100%;
          height: 100%;
          position: relative;

          .audioBox {
            width: 80%;
            margin: 0 auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .iframe_title {
              text-align: center;
              height: 60px;
              line-height: 60px;
              width: 100%;
              .word_over;
            }
            audio {
              width: 100%;
            }
          }
        }
        .video_div {
          height: 100%;
          position: relative;
          .videoBox {
            width: 100%;
            height: 100%;
            position: relative;
            video {
              max-width: 100%;
              max-height: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .OtherStyle {
          width: 100%;
          height: 100%;
          position: relative;
          .otherBox {
            width: 250px;
            height: 280px;
            // background: #fff;
            position: absolute;
            top: 40%;
            left: 50%;
            margin-top: -140px;
            margin-left: -125px;
            .topName {
              width: 250px;
              height: 60px;
              line-height: 60px;
              background: rgba(255, 255, 255, 1);
              border-radius: 4px 4px 0px 0px;
              text-align: center;
            }
            .fileImg {
              width: 250px;
              height: 214px;
              line-height: 214px;
              background: rgba(250, 250, 250, 1);
              text-align: center;

              img {
                width: 64px;
                height: 78px;
                vertical-align: middle;
              }
            }
            .dowButton {
              width: 250px;
              height: 40px;
              padding: 10px;
              .box_sizing;
              background: rgba(69, 131, 240, 1);
              border-radius: 4px;
              margin-top: 10px;
              text-align: center;
              a {
                display: block;
                width: 100%;
                height: 100%;
                color: #fff;
              }
            }
          }
        }
      
        .personalInfo {
          height: 30px;
          line-height: 30px;
          width: 100%;
          .box_sizing;
          position: relative;
          margin-top: 20px;
          .userImg {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            overflow: hidden;
            position: absolute;
            top: 5px;
            img {
              position: absolute;
              width: 20px;
              height: 20px;
            }
          }
          .nickName {
            margin-left: 30px;
            font-weight: bold;
          }
          .formatTime {
            font-size: 12px;
            color: #999999;
          }
          .original {
            line-height: 60px;
          }
        }
      }
      //   评论
      .commentBox {
        margin-top: 15px;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        margin-bottom: 100px;
        .commentiInput {
          width: 832px;
          height: 44px;
          background: rgba(250, 250, 250, 1);
          border: 1px solid rgba(242, 242, 242, 1);
          border-radius: 4px;
          padding: 10px;
          .box_sizing;
        }
        .topInputBox {
          padding: 30px 20px;
          .box_sizing;
          height: 148px;
          border-bottom: 1px solid #e6e6e6;
          .atButton {
            line-height: 30px;
            i {
              font-size: 16px;
            }
            .icon-biaoqing {
              margin-left: 15px;
            }
            .commentButton {
              margin-top: 15px;
            }
          }
          textarea {
            resize: none;
          }
        }
        .allComment {
          padding: 20px 20px;
          .box_sizing;
          ul {
            .commentList {
              min-height: 76px;
              padding: 19px 0;
              .box_sizing;
              border-bottom: 1px solid #f2f2f2;
              position: relative;
              .commentator {
                display: inline-block;
                width: 28px;
                height: 28px;
                background: red;
                border-radius: 4px;
                position: absolute;
                overflow: hidden;
                top: 50%;
                margin-top: -14px;
                img {
                  width: 28px;
                  height: 28px;
                }
              }
              .commentatorInfo {
                width: 798px;
                margin-left: 40px;
                .name {
                  font-weight: bold;
                  line-height: 20px;
                }
                .infoBox {
                  width: 100%;
                  height: 100%;
                  line-height: 20px;
                  color: #333333;
                }
              }
              .time {
                position: absolute;
                right: 0;
                top: 22px;
                font-size: 12px;
                color: #999999;
              }
            }
          }
        }
      }
    }
    .rightFileLists {
      position: absolute;
      left: calc(50vw + 322px);
      top: 24px;
      margin-left: 24px;
      width: 207px;
      height: calc(100vh - 50px - 24px * 2);
      overflow: hidden;
      background: #ffffff;
      border-radius: 4px;
      .el_select {
        width: 100%;
        .el-input__inner {
            border: none;
        }
      }
      .allFileLists {
        height: calc(100% - 40px);
        overflow-x: hidden;
        overflow-y: auto;
        .allList {
          width: 207px;
          height: 152px;
          border-radius: 4px;
          background: #ffffff;
          position: relative;
          padding: 7px 0 0 0;
          text-align: center;
          .box_sizing;
          .check {
            width: 0;
            height: 0;
            overflow: hidden;
            font-size: 0;
            /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
            line-height: 0;
            /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
            border-width: 7px;
            border-style: solid dashed dashed dashed; /*IE6下, 设置余下三条边的border-style为dashed,即可达到透明的效果*/
            border-color: transparent transparent transparent #3684ff;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            left: 10px;
          }
          .fileBox {
            display: inline-block;
            margin: 0 auto;
            width: 156px;
            height: 117px;
            line-height: 117px;
            background: #ffffff;
            border: 1px solid rgba(238, 238, 238, 1);
            border-radius: 4px;
            overflow: hidden;
            img {
              max-height: 100%;
              vertical-align: middle;
              line-height: 117px;
            }
          }
          p {
            position: absolute;
            bottom: 5px;
            left: 50%;
            margin-left: -80px;
            width: 160px;
            height: 15px;
            text-align: center;
            font-size: 12px;
            font-family: "PingFang-SC-Regular";
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            .word_over;
          }
        }
        .allListCheck {
          background: rgba(242, 242, 242, 1);
        }
      }
    }
  }
}
</style>


