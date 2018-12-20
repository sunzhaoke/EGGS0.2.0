<template>
  <div class="filePreview">
    <div class="topNav">
      <span>
        <span v-if="modifyShow"
              class="cur">{{FileName}} . {{FileType}}
          <i v-if='power'
             class="el-icon-edit"
             @click="ModifyFileName"></i>
        </span>
        <input v-if='!modifyShow'
               type="text"
               v-model="FileName"
               id="fileName"
               v-on:blur="autofocusFileName(FileName)">
      </span>
      <div class="right_button fr">
        <span class="button">
          <i class="el_icon hovers el-icon-download"
             title="下载">下载
            <a class="download_a"
               :href="YimageUrl || Url"
               :download="FileName+'.'+FileType"></a>
          </i>
        </span>
        <span class="button"
              @click="isStar=!isStar">
          <i :class="isStar? '' : 'icon-shoucang3'"
             class="iconfont icon-shoucang2  hovers"></i>
          <span v-if="isStar">收藏</span>
          <span v-else>取消收藏</span>
        </span>
        <!-- <span class="button"
              v-if='power'>
          <el-upload class="file_replace"
                     :action="'/File.ashx?publisher='+userID+'&informationType=coll&edition='+nowSelectedEdition+'&information='+teskId+'&groupedition='+(groupEdition+1)"
                     :show-file-list="false"
                     :limit="9"
                     :on-exceed="handleExceed"
                     :on-success="uploadSuccessEveryReplace"
                     :on-change="uploadChangeEveryReplace"
                     :on-progress="uploadProgress"
                     :before-upload="beforeUpload">
            <i class="el_icon hovers el-icon-refresh"
               title="文件替换"
               v-if="power"
               @click="fileEveryReplace(fileItem,checkIndex)">文件替换</i>
          </el-upload>

        </span> -->

        <!-- <span class="el_icon versionChoice button"
              title="版本选择"
              @click.stop="fileVisionIconClick">V{{nowSelectedEdition}} 版本选择</span> -->
        <ul v-if="versionChoiceShow"
            class="versionChoiceShow">
          <li>
            <span class="dian"></span>
            <span class="timeInfo"> V {{nowSelectedEdition}} 7月23日 12：00</span>
          </li>
        </ul>
        <span class="button">
          <i class="el_icon hovers el-icon-close"
             @click.stop='closePreview'></i>
        </span>
      </div>
    </div>
    <div class="main">
      <div class="mainBox_k"
           id="">
        <div class="pdfType"
             v-if='fileItem.FileTypeNum == 6'>
          <c-pdf @closepdf="closepdf"
                 :pdfurl="this.fileItem.Url"></c-pdf>
        </div>
        <iframe v-if="fileItem.FileTypeNum == 2 || fileItem.FileTypeNum == 3 || fileItem.FileTypeNum == 5 || fileItem.FileType == 'txt'"
                :src="fileItem.Url"
                width='90%'
                height='90%'
                frameborder='0'>
        </iframe>
        <div v-if="fileItem.FileTypeNum == 7"
             class="audio_div">
          <div class="audioBox">
            <div class="iframe_title">{{fileItem.Title}}</div>
            <audio v-if="fileItem.FileTypeNum == 7"
                   :src="fileItem.Url"
                   controls="controls"
                   autoplay="autoplay"
                   preload="preload">亲 您的浏览器不支持html5的audio标签</audio>
          </div>
        </div>
        <div v-if="fileItem.FileTypeNum == 8"
             class="video_div">
          <div class="videoBox">
            <video v-if="fileItem.FileTypeNum == 8"
                   :src="fileItem.Url"
                   controls="controls"
                   autoplay="autoplay"
                   preload="preload">亲 您的浏览器不支持html5的video标签</video>

          </div>
        </div>
        <!-- 不支持预览的样式 -->
        <div class="OtherStyle"
             v-if="fileItem.FileTypeNum == 0||fileItem.FileTypeNum == 4 || fileItem.FileTypeNum == 9 || fileItem.FileTypeNum ==10">
          <div class="otherBox">
            <div class="topName">
              <div class="c"> {{FileName}}.{{FileType}} </div>
            </div>
            <div class="fileImg">
              <img class="typeTwo"
                   v-if="fileItem.FileTypeNum === 0"
                   src="../../assets/img/file_b/0.png">
              <img class="typeTwo"
                   v-if="fileItem.FileTypeNum === 4"
                   src="../../assets/img/file_b/4.png">
              <img class="typeTwo"
                   v-if="fileItem.FileTypeNum === 9"
                   src="../../assets/img/file_b/9.png">
              <img class="typeTwo"
                   v-if="fileItem.FileTypeNum === 10"
                   src="../../assets/img/file_b/10.png">
            </div>
            <div class="dowButton cur">
              <a :href="fileItem.Url">下载文件（{{size}}）</a>
            </div>
          </div>
        </div>
        <div class="imgType"
             v-if="fileItem.FileTypeNum == 1 "
             id="imgType">
          <img :src="fileItem.Url"
               alt=""
               :class="{'active':isChoose}"
               draggable="true"
               :style="'height:'+ num +'%' ">
          <div class="zoomButton">
            <i class="el-icon-zoom-out cur hovers"
               @click="imgZoomOut"></i>
            &nbsp;{{imgSize}}&nbsp;
            <i class="el-icon-zoom-in cur hovers"
               @click="imgZoomIn"></i>
            <i class="iconfont  cur icon-_zuidahuadaosuoping fr"
               v-if='fangdaShow'
               @click="fullScreen() "></i>
            <i class="iconfont cur icon-suoxiao fr"
               v-if='!fangdaShow'   
               @click="closeFull() "></i>

          </div>
        </div>
        <!-- <img src="../../assets/img/bg.jpg" alt=""> -->
      </div>
      <div class="el-icon-arrow-left switchover left"
           @click="last"></div>
      <div class="el-icon-arrow-right switchover right"
           @click="next"></div>
      <!--  -->
    </div>
    <uploadProgress v-if="uploadProgressFlag"
                    :fileProgressList="fileProgressList"
                    @closeProgress="closeProgress"></uploadProgress>
 
  </div>
</template>
<script>
import uploadProgress from "./uploadProgress";

export default {
  components: {
    uploadProgress
  },
  props: ["allFileLists", "personFilelist", "clickIndex", "teskId"],
  data() {
    return {
      isStar: true, //是否星标
      filePkid: "", //文件pkid
      nowSelectedEdition: "", //版本号
      versionChoiceShow: false, //版本选择弹框,
      modifyShow: true, //修改姓名
      FileName: "",
      FileType: "",
      items: "", // 图片预览列表,
      fileItem: "", // 文件预览对象,
      everyFileList: "",
      YimageUrl: "",
      Url: "",
      fileEveryReplaceItem: "", // 当前选择人员的文件单个要替换的详情
      checkIndex: "",
      oneFilelist: "", //个人文件渲染列表
      newList: [], //新所有数据渲染列表
      size: "",
      isChoose: false,
      imgSize: "",
      groupEdition: 1, // 单文件版本替换时当前版本
      teskIds: "", // 详细任务的ID
      publishID: "", // 当前发布人的ID
      num: "", //图片展示 百分比
      windowHeight: "",
      isshowpdf: false,
      ArticleFileId: "", // 卡片id
      power: true, //是否有权限显示 修改按钮
      userID: "", //当前登录用户id,
      fileUserid: "", //文件发布人 userid
      fileProgressList: [], // 上传进度列表
      uploadProgressFlag: false, // 上传进度显示隐藏
      Selectgroupedition: "", //当前文件最高版本,
      fangdaShow: true //全屏 缩小显示icon
    };
  },
  watch: {},
  methods: {
    // 点击关闭pdf文件预览
    closepdf() {
      this.isshowpdf = false;
      this.iframeFlag = false;
    },
    // 全屏显示
    fullScreen() {
      console.log(22222)
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
    autofocusFileName(newFileName) {
      console.log(newFileName);

      let data = { pkid: this.filePkid, fileName: newFileName };
      this.$HTTP("post", "/UpdateFileName", data).then(res => {
        console.log();
      });
      this.modifyShow = true;
    },
    // 分配人员的文件单个替换
    fileEveryReplace(item, index) {
      console.log(1111, item, index);

      this.fileEveryReplaceItem = item;
      // this.articleFilePkid = item.ArticleFileId;
      // this.fileEveryReplaceFlag = index;
      // this.groupEdition = Number(item.Groupedition);
    },
    imgZoomOut() {
      if (this.imgSize <= 10) {
        return false;
      }
      this.num = this.num - 10;
      this.imgSize = this.imgSize - 10;
    },
    imgZoomIn() {
      if (this.imgSize >= 300) {
        return false;
      }
      this.num = this.num + 10;
      this.imgSize = this.imgSize + 10;
    },
    fileVisionIconClick() {
      this.versionChoiceShow = !this.versionChoiceShow;
    },
    closePreview() {
      this.$emit("previewClose", false);
    },
    //
    ModifyFileName() {
      this.modifyShow = !this.modifyShow;
    },

    // 上一个文件
    last() {
      if (this.checkIndex > 0) {
        this.checkIndex = this.checkIndex - 1;
        this.oneFilelist = this.everyFileList[this.checkIndex];
        this.filePreview(this.everyFileList, this.oneFilelist, this.checkIndex);
      } else {
        this.$message('这是第一个文件')
        return
      }
    },
    // 下一个文件
    next() {
      if (this.checkIndex < this.everyFileList.length - 1) {
        this.checkIndex = this.checkIndex + 1;
        this.oneFilelist = this.everyFileList[this.checkIndex];
        this.filePreview(this.everyFileList, this.oneFilelist, this.checkIndex);
      } else {
        this.$message('没有更多文件了');
        return

      }
    },
    // 分配人员文件单个替换上传成功
    uploadSuccessEveryReplace(res, file, fileList) {
      if (this.fileEveryReplaceFlag !== null) {
        this.fileUploadEveryReplace(res, file);
      }
    },
    // 分配人员的文件单个替换上传
    fileUploadEveryReplace(fileId, file) {
      let obj = {
        articleFilePkid: this.articleFilePkid,
        fileId: fileId,
        edition: this.groupEdition + 1
      };
      this.$HTTP("post", "/UpdateOneTaskFileList", obj)
        .then(res => {
          let results = res.result;
          this.$set(results, "checked", false);
          this.$set(results, "delFlag", false);
          this.$set(results, "FileTypeNum", this.getFlieTyle(results.FileType));
          if (this.fileEveryReplaceFlag !== null) {
            this.everyFileList[this.fileEveryReplaceFlag] = results;
            this.fileEveryReplaceFlag = null;
          }
          if (this.fileEveryReplaceItem.checked) {
            let haves = this.everyFileCheckedList.findIndex(ele => {
              return ele.checked === this.fileEveryReplaceItem.checked;
            });
            if (haves !== -1) {
              this.everyFileCheckedList.splice(haves, 1);
            }
          }

          this.everyFileList = this.everyFileList.concat();
          console.log("文件单个替换上传成功", this.everyFileList, res.result);
          this.fileItem = res.result;
          // this.filePreview(
          //   this.everyFileList,
          //   res.result,
          //   this.clickIndex
          // );

          this.$message.success("文件单个替换上传成功");

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
          this.$message.error("文件单个替换上传失败");
          console.log("上传错误", err);
        });
    },
    // 分配人员文件单个替换上传成功
    uploadSuccessEveryReplace(res, file, fileList) {
      if (this.fileEveryReplaceFlag !== null) {
        this.fileUploadEveryReplace(res, file);
      }
    },
    // 分配人员文件单个替换上传改变
    uploadChangeEveryReplace(file, fileList) { },
    // 分配人员文件单个替换上传之前
    beforeUploadEveryReplace(file, fileList) {
      //        console.log('beforeUploadEvery', file);
    },

    // 分配人员的文件单个替换
    fileEveryReplace(item, index) {
      this.fileEveryReplaceItem = item;
      this.articleFilePkid = item.ArticleFileId;
      this.fileEveryReplaceFlag = index;
      this.groupEdition = Number(item.Groupedition);
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
    filePreview(file, item, index) {
      // 1.图片: 1
      // 2.pdf: 6
      // 3.可以用office online预览的文件: 2 3 5
      // 4.音频: 7
      // 5.视屏: 8
      // 6 txt
      // 不可预览的文件: 其他

      // 图片比
      // this.imgSize = Math.floor(
      //   item.ImageHeight / (this.windowHeight - 50) * 0.9 * 100
      // );

      // 图片比窗口实际高度大 压缩到 90%
      // 图片比窗口实际高度小 压缩到 原本的图片比例
      let widowH = this.windowHeight - 50;
      if (item.ImageHeight > widowH) {
        this.num = 90;
        this.imgSize = Math.floor(widowH * 0.9 / item.ImageHeight * 100);
      } else {
        this.num = Math.floor(item.ImageHeight / widowH * 100);
        this.imgSize = 100;
      }
      if (this.userID !== this.fileUserid) {
        this.power = false;
      }

      this.fileItem = JSON.parse(JSON.stringify(item));
      this.FileName = this.fileItem.Title;
      this.FileType = this.fileItem.FileType;
      this.YimageUrl = this.fileItem.YimageUrl;
      this.Url = this.fileItem.Url;
      this.filePkid = this.fileItem.Pkid;

      this.size = this.conver(this.fileItem.Size);
      if (item.FileTypeNum == 1) {
        return false;
        this.items = [];
        var pswpElement = document.querySelectorAll(".pswp")[0];
        for (let i of file) {
          if (i.ImageWidth) {
            this.items.push({
              src: i.Url,
              w: i.ImageWidth,
              h: i.ImageHeight,
              Pkid: i.Pkid
            });
          }
        }
        let indexs = this.items.findIndex(ele => {
          return ele.Pkid == item.Pkid;
        });

        var options = {
          index: indexs,
          escKey: false,
          timeToIdle: 4000
        };
        var gallery = new PhotoSwipe(
          pswpElement,
          PhotoSwipeUI_Default,
          this.items,
          options
        );
        gallery.init();
      } else if (item.FileTypeNum === 6) {
        this.$nextTick(() => {
          this.isshowpdf = true;
        });
      } else if (
        item.FileTypeNum == 2 ||
        item.FileTypeNum == 3 ||
        item.FileTypeNum == 5
      ) {
        // let url1 = domain.url;
        let url2 = 'http://eggs.apexgame.cn/' + item.Url;
        url2 = encodeURIComponent(url2);
        let url3 = "https://view.officeapps.live.com/op/view.aspx?src=";
        this.fileItem.Url = url3 + url2;
        this.$nextTick(() => {
          this.iframeFlag = true;
        });
      } else if (
        item.FileTypeNum == 7 ||
        item.FileTypeNum == 8 ||
        item.FileTypeNum == 11
      ) {
        this.$nextTick(() => {
          this.iframeFlag = true;
        });
      } else if (item.FileTypeNum === 0 && item.FileType == "txt") {
        this.$nextTick(() => {
          this.iframeFlag = true;
        });
      } else {
        // this.$message.warning("此文件类型暂不支持预览，可点击下载");
      }
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
      let FileTypeNum = this.getSuffix(file.name);
      FileTypeNum = this.getFlieTyle(FileTypeNum);
      let obj = {
        uid: file.uid,
        size: sizes,
        name: file.name,
        type: 2,
        progress: 0,
        status: false,
        FileTypeNum: FileTypeNum,
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
          this.fileProgressList[ids].FileTypeNum == 1
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
            this.$set(ele, "FileTypeNum", this.getFlieTyle(ele.FileType));
            // ele.FileType = this.getFlieTyle(ele.FileType);
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
    // 分配人员文件单个替换上传之前
    beforeUploadEveryReplace(file, fileList) {
      //        console.log('beforeUploadEvery', file);
    },
    // 文件类型判断
    getFlieTyle(surffix) {
      if (
        surffix === "png" ||
        surffix === "jpeg" ||
        surffix === "jpg" ||
        surffix === "gif" ||
        surffix === "bmp"
      ) {
        return 1; // 图片
      } else if (surffix === "doc" || surffix === "docx") {
        return 2; // 文档
      } else if (surffix === "xls" || surffix === "xlsx") {
        return 3; // 表格
      } else if (surffix === "psd") {
        return 4; // PS
      } else if (surffix === "ppt" || surffix === "pptx") {
        return 5; // ppt
      } else if (surffix === "pdf") {
        return 6; // pdf
      } else if (
        surffix === "mp3" ||
        surffix === "wma" ||
        surffix === "wav" ||
        surffix === "ogg" ||
        surffix === "ra"
      ) {
        return 7; // 音频
      } else if (
        surffix === "wmv" ||
        surffix === "avi" ||
        surffix === "mpg" ||
        surffix === "rmvb" ||
        surffix === "mp4"
      ) {
        return 8; //视频
      } else if (surffix === "zip" || surffix === "rar") {
        return 9; // 压缩包
      } else if (surffix === "ai") {
        return 10; // ai
      } else if (surffix === "txt") {
        return 11; //txt
      } else {
        return 0; // 其他
      }
    },
    fullScreens(el) {
      var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen,
        wscript;

      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
      }

      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
          wscript.SendKeys("{F11}");
        }
      }
    }
  },
  created() {
    // function fullScreen(el) {}
  },
  mounted() {
    // console.log($(window).height()); //浏览器当前窗口可视区域高度
    // console.log($(window).width()); //浏览器当前窗口可视区域宽度
    this.windowHeight = $(window).height();
    this.everyFileList = this.allFileLists;
    this.checkIndex = this.clickIndex; //选择的index
    this.oneFilelist = this.personFilelist;
    this.filePreview(this.everyFileList, this.personFilelist, this.clickIndex);
    this.FileName = this.personFilelist.Title;
    this.FileType = this.personFilelist.FileType;
    this.YimageUrl = this.personFilelist.YimageUrl;
    this.Url = this.personFilelist.Url;
    this.fileUserid = this.personFilelist.Publisher;

    console.log(this.everyFileList);
    this.Selectgroupedition = this.personFilelist.Selectgroupedition;
    this.userID = JSON.parse(localStorage.getItem("staffInfo")).Pkid;
    // this.userID = this.userID.toString();
    this.nowSelectedEdition = this.personFilelist.SelectEdition;

    if (this.userID !== this.fileUserid) {
      this.power = false;
    }
  }
};
</script>
<style lang='less'>
.box_sizing {
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}
@br: 6px;
.border_radius(@br:6px) {
  -webkit-border-radius: @br;
  -moz-border-radius: @br;
  border-radius: @br;
}

.filePreview {
  width: 100%;
  height: 100%;
  background: #f2f3f9;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  .topNav {
    height: 50px;
    line-height: 50px;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    padding: 0 100px;
    .box_sizing;
    .right_button {
      .button {
        cursor: pointer;
        margin-left: 30px;
        .file_replace {
          display: inline-block;
        }
        // a {icon-webicon311
        //   display: inline-block;
        //   width: 100%;
        //   height: 100%;
        // }
      }
      .icon-shoucang3 {
        color: #ffa62f;
      }
      .versionChoiceShow {
        width: 170px;
        min-height: 56px;
        background: #fff;
        position: absolute;
        .border_radius(@br:6px);
        right: 100px;
        top: 50px;
        padding: 10px;
        z-index: 1000;
        .box_sizing;
        .dian {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #4583f0;
          .border_radius(@br:50%);
        }
        .timeInfo {
          margin-left: 10px;
          color: #999999;
        }
        li {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    #fileName {
      width: 65%;
      background: #f2f2f2;
    }
  }
  .main {
    width: 100%;
    height: calc(~"100% - 50px");
    position: relative;
    .mainBox_k {
      width: 100%;
      height: 100%;
      iframe {
        width: 100%;
        height: 100%;
      }
      .audio_div {
        width: 100%;
        height: calc(100vh - 5vh);
        position: relative;
        .box_sizing;
        .audioBox {
          position: absolute;
          width: 80%;
          height: 70px;
          background: #fff;
          top: 50%;
          left: 50%;
          -webkit-transform: translateX(-50%) translateY(-50%);
        }
        audio {
          width: 100%;
        }
        .iframe_title {
          font-size: 14px;
          text-align: center;
          margin: 10px;
        }
      }
      // 音视频预览样式
      .video_div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .videoBox {
          width: 50%;
          text-align: center;
          background-color: #fff;
          video {
            width: 100%;
            max-height: 90vh;
          }
        }
      }

      .pdfType {
        width: 100%;
        height: 100%;
        background: #4a4a4a;
      }
      .imgType {
        width: 100%;
        height: 100%;
        position: relative;
        img {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: auto;
          height: auto;
          margin: auto;
          z-index: -1;
          transition: all ease 0.5s;
        }
        .zoomButton {
          position: fixed;
          left: 50%;
          margin-left: -75px;
          bottom: 40px;
          width: 150px;
          height: 36px;
          line-height: 36px;
          background: rgba(102, 102, 102, 1);
          border-radius: 4px;
          color: #fff;
          padding: 0 20px;
          .box_sizing;
          i {
            font-size: 14px;
          }
        }
      }
      .OtherStyle {
        width: 100%;
        height: 100%;
        .otherBox {
          width: 250px;
          height: 250px;
          // background: #fff;
          position: absolute;
          top: 150px;
          left: 50%;
          margin-left: -125px;
          .topName {
            width: 250px;
            height: 32px;
            line-height: 32px;
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
    }

    .switchover {
      width: 30px;
      height: 50px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      text-align: center;
      line-height: 50px;
      color: #999999;
      position: absolute;
      top: 40%;
      cursor: pointer;
    }
    .switchover:hover {
      color: #333333;
    }
    .left {
      left: 30px;
    }
    .right {
      right: 30px;
    }
  }
}
</style>