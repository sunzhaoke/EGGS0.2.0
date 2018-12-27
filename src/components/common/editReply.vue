<template>
    <div class="edit_reply" id="editReplay">
        <img class="header fl" src="../../../assets/img/demo.jpg" alt="">
        <div class="edit_box fl" id="editBox">
            <div 
                id="editArea"
                class="edit_area"
                ref="editArea"
                spellcheck="false"
            ></div>
            <div class="operate" id="operate">
                    <!-- 文件上传 -->
                <el-upload
                    ref="elUpload"
                    class="upload_flag fl"
                    :action="'/File_Upload.ashx?projectId='+projectId+'&taskId='+taskId+'&userId='+userId"
                    :show-file-list="false"
                    :multiple="true"
                    @click.native="uploadClick"
                    :on-change="uploadChange"
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    :on-progress="uploadProgress"
                    :limit="9"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUpload">
                    <i class="iconfont icon-shangchuan- upload_flag"></i>
                    <span class="upload_name upload_flag">本地上传</span>
                </el-upload>
                <button class="main_button_bg fr" @click="publish">发布</button>
                <button class="main_button_ fr" @click="cancelPublish">取消</button>
            </div>
            <ul class="at_pop" ref="atPop" v-show="showPop && selectStaff.length">
                <li
                v-for="item in selectStaff" 
                :key="item.userId"
                @click="addStaffClick(item)"
                >{{item.nickname ? item.nickname : item.userName}}</li>
            </ul>
             <!-- <div class="at_pop" ref="atPop" v-show="showPop && !selectStaff.length">
               <p>暂无参与者</p>
            </div> -->
        </div>
        <!-- 文件上传进度条 -->
        <upload-progress 
          id="editReplayProgress"
          v-if="uploadProgressFlag" 
          :fileProgressList="fileProgressList" 
          @closeProgress="closeProgress"
          @handleCancel="cancelUpload"
          @handleRe="reUpload"
        />
    </div>
</template>
<script>
import caret from "jquery.caret";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import uploadProgress from "../../common/uploadProgress";

export default {
  components: {
    uploadProgress
  },
  props: ["selectStaff", "projectId", "taskId", "userId"],

  data() {
    return {
      userPkid: "1184",
      fileTypeImgIcon: [
        {
          src: require("../../../assets/img/file_s/0.png")
        },
        {
          src: require("../../../assets/img/file_s/1.png")
        },
        {
          src: require("../../../assets/img/file_s/2.png")
        },
        {
          src: require("../../../assets/img/file_s/3.png")
        },
        {
          src: require("../../../assets/img/file_s/4.png")
        },
        {
          src: require("../../../assets/img/file_s/5.png")
        },
        {
          src: require("../../../assets/img/file_s/6.png")
        },
        {
          src: require("../../../assets/img/file_s/7.png")
        },
        {
          src: require("../../../assets/img/file_s/8.png")
        },
        {
          src: require("../../../assets/img/file_s/9.png")
        },
        {
          src: require("../../../assets/img/file_s/10.png")
        },
        {
          src: require("../../../assets/img/file_s/11.png")
        }
      ],
      fileTypeImg: [
        {
          src: require("../../../assets/img/file_b/0.png")
        },
        {
          src: require("../../../assets/img/file_b/0.png")
        },
        {
          src: require("../../../assets/img/file_b/2.png")
        },
        {
          src: require("../../../assets/img/file_b/3.png")
        },
        {
          src: require("../../../assets/img/file_b/4.png")
        },
        {
          src: require("../../../assets/img/file_b/5.png")
        },
        {
          src: require("../../../assets/img/file_b/6.png")
        },
        {
          src: require("../../../assets/img/file_b/7.png")
        },
        {
          src: require("../../../assets/img/file_b/8.png")
        },
        {
          src: require("../../../assets/img/file_b/9.png")
        },
        {
          src: require("../../../assets/img/file_b/10.png")
        },
        {
          src: require("../../../assets/img/file_b/11.png")
        }
      ],
      eidtHtml: "",
      datas: Object.assign(
        {},
        { id: 0, title: "", content: "", people: [], files: [] }
      ),
      showPop: false,
      range: null,

      // new
      quill: {},
      curP: 0,
      delFlag: true,
      addFileFlag: false,
      nowFileId: "",
      replayText: "", // 回复内容
      uploadProgressFlag: false,
      fileProgressList: [],
      uploadList: [],
    };
  },
  watch: {
    uploadProgressFlag(val) {
      if(val) {
        this.$nextTick(() => {
          $('#editReplayProgress').css({'bottom': $('#editReplay').outerHeight() + 'px', width: $('#taskDetails').width()});
        });
        
      }
    }
  },

  methods: {
    // 文件上传相关方法
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
    },
    // 取消上传
    cancelUpload(file) {
      this.getDelFile(file.uid, true);
      if(file.reUploadXhr) {
        file.reUploadXhr.abort();
      }else {
        this.$refs.elUpload.abort(file);
      }
      let id = file.uid;
      let img = $('#editArea').find('u#'+id).eq(0).prev();
      let u = $('#editArea').find('u#'+id).eq(0);
      img.remove();
      u.remove();
      this.curP = this.curP - (file.name.length + 2);
    },
    // 重新上传
    reUpload(file) {
      file.status = 1;
      file.reUploadXhr = 1;
      var formData = new FormData();
      formData.append('file', file.file);
      this.$refs.elUpload.httpRequest = this.uploadFile(formData, file);
      
    },
    // 重新上传的请求
    uploadFile(formData, file) {
      let _ = this;
      file.reUploadXhr = $.ajax({
          url: "/File_Upload.ashx?projectId=188&taskId=5&userId=1184",
          type: "post",
          dataType: "json",
          data: formData,
          // async: false,
          cache: false,
          contentType: false,
          processData: false,
          xhr:function(e){ 
              let uploadXhr = $.ajaxSettings.xhr(); 
              if(uploadXhr.upload){ // check if upload property exists 
                uploadXhr.upload.addEventListener('progress', function(e) {
                  let loaded = e.loaded;//已经上传大小情况
                  let tot = e.total;//附件总大小
                  let per = Math.floor(100*loaded/tot);  //已经上传的百分比
                  _.uploadProgress({percent: per}, file);
                }, false); // for handling the progress of the upload
                 
              }  
            return uploadXhr;  
        },success(data){
                _.uploadSuccess(data, file);
        },error(err){
          _.uploadError('err', file);
          if(file.reUploadXhr) {
            file.reUploadXhr = null;
          }
        } 
      });
    },

    // 判断是否上传完
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
    // 文件上传超出提示
    handleExceed(files, fileList) {
      this.$message.warning("最多只能选择9个文件");
    },
    uploadClick() {
       
    },
    // 文件上传前
    beforeUpload(file) {
      // 先限制文件大小
      let size = file.size / 1024 / 1024 / 1024;
      if(size > 1) {
        this.$message.warning('上传文件大小不能超过1GB');
        return;
      }
      // 再判断有没有重复
      let index = this.uploadList.findIndex(ele => {
        return (ele.name == file.name) && (ele.size == file.size);
      });
      if (index !== -1) {
        this.$message("文件重复");
        return;
      }

      if (!this.uploadProgressFlag) {
        this.uploadProgressFlag = true;
      }
      let sizes = this.conver(file.size);
      let FileTypeNum = this.getSuffix(file.name);
      FileTypeNum = this.getFlieTyle(FileTypeNum);
      let obj = {
        uid: file.uid,
        size: file.size,
        sizes: sizes,
        nowSize: 0,
        name: file.name,
        type: 2,
        progress: 0,
        status: 1,
        FileTypeNum: FileTypeNum,
        imgUrl: "",
        file: file
      };
      this.fileProgressList.unshift(obj);

      // 无论有没有上传成功， 都先加入列表回复框中
      let type = file.name.split(".")[1];
      this.$set(file, "FileTypeNum", this.getFlieTyle(type));
      this.uploadList.push(file);
      this.addFile(obj);
    },

    // 文件上传中
    uploadProgress(event, file) {
      let percents = parseInt(event.percent);
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });

      if (ids !== -1) {
        this.fileProgressList[ids].progress = percents;
        this.fileProgressList[ids].nowSize = this.conver(percents / 100 * this.fileProgressList[ids].size);
        // 测试重新上传
        if(this.fileProgressList[ids].size > 1024 * 1024 * 500 && percents > 50 && percents < 55) {
          if(file.reUploadXhr) {
            file.reUploadXhr.abort();
            file.reUploadXhr = null;
          }else {
            this.$refs.elUpload.abort(file);
          }
          this.uploadError('err', file);
        }
        if (
          !this.fileProgressList[ids].imgUrl &&
          this.fileProgressList[ids].FileTypeNum == 1
        ) {
          this.fileProgressList[ids].imgUrl = file.url;
        }
      }
    },

    // 文件上传成功
    uploadSuccess(res, file) {
      // 上传成功后再加入列表中
      // let type = file.name.split(".")[1];
      // this.$set(file, "FileTypeNum", this.getFlieTyle(type));
      // this.uploadList.push(file);
      // this.addFile(file);
      let id = file.response.result.Pkid;
      let files =  $(".ql-editor").eq(0).find('.u_file');
      files.each(function(e) {
        $(this).attr('fileid', id);
        console.log($(this), e);
      });
      let x = this.uploadList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (x !== -1) {
        this.uploadList[x].Pkid = file.response.result.Pkid;
      }

      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].status = 2;
      }
      let returns = this.popFileProgress(this.fileProgressList);
      if (this.uploadProgressFlag && returns) {
        setTimeout(() => {
          this.closeProgress();
        }, 2000);
      }
    },

    // 文件上传失败
    uploadError(err, file) {
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].status = 3;
      }
    },

    uploadChange(file) {
      // console.log('---uploadChange', this.$refs.elUpload);
    },

    // 添加附件
    addFile(file) {
      let types = file.FileTypeNum;
      if (!file.FileTypeNum) {
        file.urlIcon = this.fileTypeImgIcon[0].src;
        file.url = this.fileTypeImg[0].src;
      } else if (file.FileTypeNum === 1) {
        file.urlIcon = this.fileTypeImgIcon[1].src;
      } else {
        file.urlIcon = this.fileTypeImgIcon[file.FileTypeNum].src;
        file.url = this.fileTypeImg[file.FileTypeNum].src;
      }

      this.addFileFlag = true;
     
      this.quill.insertEmbed(this.curP, "image", file.urlIcon);
      this.curP = this.quill.getSelection()
        ? this.quill.getSelection().index
        : this.curP;
      this.quill.setSelection(this.curP + 1);

      this.quill.insertText(
        this.curP + 1,
        file.name,
        { color: "#253ca6", underline: true },
        true
      );
      this.quill.insertText(
        this.curP + file.name.length + 1,
        " ",
        { color: "#000000", underline: false },
        true
      );

      this.quill.setSelection(this.curP + file.name.length + 2);
      this.addFileFlag = false;

      let selection = window.getSelection();
      let targetNode = $(selection.extentNode.parentNode).prev();
      if (targetNode.prop("tagName") == "U") {
        targetNode.attr({ fileid: '', filename: file.name, id: file.uid, class: 'u_file' });
        targetNode = targetNode.prev();
        if (targetNode.prop("tagName") == "IMG") {
          targetNode = targetNode.prev();
          targetNode.attr({ fileid: '', filename: file.name, id: file.uid, class: 'u_file' });
        }
      }
      this.datas.files.push(file.uid);
    },

    // 删除文件时改变数组，触发父组件的方法
    getDelFile(fileid, cancel) {
      // datas
      let indexs = this.datas.files.findIndex(el => {
        return el == fileid;
      });
      if (indexs !== -1) {
        this.datas.files.splice(indexs, 1);
      }


      // uploadList
      let indexs2 = this.uploadList.findIndex(el => {
        return el.uid == fileid;
      });
      if (indexs2 !== -1) {
        this.uploadList.splice(indexs2, 1);
      }

      // fileProgressList
      let indexs1 = this.fileProgressList.findIndex(el => {
        return el.uid == fileid;
      });
      if (indexs1 !== -1) {
        if(cancel == undefined && this.fileProgressList[indexs1].progress < 100) {
          this.cancelUpload(this.fileProgressList[indexs1]);
        }
        this.fileProgressList.splice(indexs1, 1);
        if(!this.fileProgressList.length) {
          this.closeProgress();
        }
      }

    },

    // 展示弹出层
    showAtPop() {
      let pos = $(".ql-editor")
        .eq(0)
        .caret("position");
      $(this.$refs.atPop).css({
        top: pos.top - $(".ql-editor") .eq(0) .scrollTop(),
        left: pos.left + 10
      });
      if (!this.showPop) this.showPop = true;
    },

    // 选中列表项添加到文本域中
    addStaffClick(item, curchar) {
      let name, lengths;
      name = item.userName;
      this.quill.formatText(this.curP - 1, 1, {
        color: "#253ca6",
        bold: true
      });
      this.quill.insertText(
        this.curP,
        name,
        {
          color: "#253ca6",
          bold: true
        },
        true
      );
      lengths = name.length;
      this.quill.insertText(
        this.curP + lengths,
        " ",
        { color: "#000000", bold: false },
        true
      );
      setTimeout(() => {
        let selection = window.getSelection();
        let targetNode = $(selection.extentNode.parentNode).prev();
        if (targetNode.prop("tagName") == "STRONG") {
          targetNode.attr({ ids: item.userId });
        }
      }, 0);
     
      this.datas.people.push(item.userId);
      this.quill.setSelection(this.curP + lengths + 1);
      this.showPop = false;
    },

    // 发布回复
    publish() {
      let text = $('.ql-editor').eq(0).text();
      if(text) {
        let arr = [];
        for(let x of this.uploadList) {
          arr.push({id: x.Pkid, title: x.name});
        }
        this.datas = Object.assign(this.datas, {names: arr});
        this.datas.content = $('.ql-editor').eq(0).html();
        this.$emit('handleReply', this.datas);
      }
      this.replayAnimate(false);

    },

    // 取消发布回复
    cancelPublish() {
      this.replayAnimate(false);
    },

    // flag=true展开 flag=false收起
    replayAnimate(flag) {
      if (flag) {
        $("#operate").animate({ height: "38px" });
        $("#editArea").animate({ height: "74px" });
      } else {
        $("#operate").animate({ height: "0" });
        $("#editArea").animate({ height: "30px" });
        this.datas = Object.assign( {}, { id: 0, title: "", content: "", people: [], files: [] });
        this.uploadList = [];
        for(let ele of this.fileProgressList) {
          if(ele.status != 2) {
            this.cancelUpload(ele);
          }
        }
        this.fileProgressList = [];
        this.uploadProgressFlag = false;
      }
      this.quill.setText("");
      this.replayText = "";

    }
  },
  mounted() {
    let _ = this;
    _.quill = new Quill("#editArea", {
      theme: "snow",
      placeholder: "点击回复任务，上传成果"
    });
    _.curP = _.quill.getLength();
    _.quill.setSelection(_.curP);
    _.quill.blur();

    // 获取焦点
    $(".ql-editor")
      .eq(0)
      .focus(function(e) {
        let h = $(this).innerHeight();
        if (h === 30) {
          _.replayAnimate(true);
        }
        return false;
      });

    // 失去焦点时，保存光标的位置
    $(".ql-editor")
      .eq(0)
      .blur(function(e) {
        _.curP = _.quill.getSelection() ? _.quill.getSelection().index : 0;
        _.replayText = $(this).text();
      });

    $(document).on("click", function(e) {
      return;
      let target = $(e.target);
      let cla = target.attr("class");

      let claFind = cla ? cla.indexOf("upload_flag") : -1;

      if (claFind === -1 && !_.replayText) {
        _.replayAnimate(false);
      }
    });

    // 输入框变化时出发
    _.quill.on("text-change", function(delta, oldDelta, source) {
      // console.log('log------text-change', delta);
      let ops = delta.ops[delta.ops.length - 1];
      var selection,
        node = null,
        length = 0,
        parentNode,
        innerHtml;

      // 添加 @人员
      if (ops.insert) {
        if (_.showPop) _.showPop = false;

        selection = window.getSelection();
        parentNode = selection.extentNode.parentNode;
        if (
          ops.insert == " " &&
          parentNode.tagName !== "STRONG" &&
          parentNode.tagName !== "U"
        ) {
          return;
        }

        if (
          parentNode.tagName === "STRONG" ||
          (parentNode.tagName === "U" && !_.addFileFlag)
        ) {
          // 不允许插入 this.delFlag true
          length = ops.insert.length;
          _.curP = _.quill.getSelection().index;
          _.delFlag = false;
          _.quill.deleteText(_.curP - 1, length);
          setTimeout(() => {
            _.quill.setSelection(_.curP - 1);
          }, 0);
        }
        if (ops.insert === "@") {
          _.curP = _.quill.getSelection().index;
          _.showAtPop();
        } else {
          if (_.showPop) _.showPop = false;
        }
      } else if (ops.delete && _.delFlag) {
        // 删除 @人员/附件
        if (_.showPop) _.showPop = false;
        selection = window.getSelection();
        parentNode = selection.extentNode.parentNode;
        if (parentNode.tagName === "STRONG" || parentNode.tagName === "U") {
          if(parentNode.tagName === "STRONG") {
            let ids = $(parentNode).attr('ids');
            if(ids) {
              let i = _.datas.people.findIndex(ele => ele == ids);
              (i != -1) && (_.datas.people.splice(i, 1));
            }

          }

          innerHtml = parentNode.innerHTML;
          length = innerHtml.length;
          _.curP = _.quill.getSelection().index;
          // 循环看现在前面有几个字符要删除
          let num = 0,
            cont;
          for (let x = _.curP - 1; x > 0; x--) {
            cont = _.quill.getContents(x, 1);
            if (
              cont.ops[0].attributes &&
              cont.ops[0].attributes.color === "#253ca6"
            ) {
              num++;
            } else {
              break;
            }
          }
          selection = window.getSelection();
          parentNode = selection.extentNode.parentNode;
          node = $(parentNode).empty();
          setTimeout(() => {
            _.quill.setSelection(_.curP - num);
            _.curP = _.quill.getSelection().index;
            cont = _.quill.getContents(_.curP, 1);
            if (cont.ops[0].insert && cont.ops[0].insert == " ") {
              _.quill.deleteText(_.curP, 1);
            }
            if (parentNode.tagName === "U") {
              // 删除附件前面的图片
              _.curP = _.quill.getSelection().index;
              _.quill.deleteText(_.curP - 1, 1);

              let fileid = $(parentNode).attr("id");
              let filename = $(parentNode).attr("filename");
              _.getDelFile(fileid,filename);
            }
          }, 0);
        }
      } else {
        if (_.showPop) _.showPop = false;
      }

      if (!_.delFlag) {
        _.delFlag = true;
      }
    });

    // 鼠标经过文件的时候
    $(".ql-editor")
      .eq(0)
      .on("mouseover", function(e) {
       
        let target = $(e.target);
         _.$emit('handleMouseEnter', target);
        return;
        if (target.prop("tagName") == "IMG" || target.prop("tagName") == "U") {
          let text = "";
          if (target.prop("tagName") == "IMG") {
            text = target.next().text();
          } else {
            text = target.text();
          }
          let files = file.find(el => {
            return text == el.name;
          });
          if (files) {
            _.nowFileId = files.ids;
          }

          var X = target.offset().top;
          var Y = target.offset().left;
          $("#preview")
            .show()
            .css({ top: X + 24, left: Y });
        } else {
          // $('#preview').hide();
        }
      });
  }
  
};
</script>
<style lang="less">
@import "../../../assets/css/base.less";
.edit_reply {
  width: 100%;
  padding: 10px 24px 10px 54px;
  background: @bg-f2f2f2;
  .box_sizing;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
  @media screen and (max-width: 1366px) {
    // bottom: 12px;
  }

  .ql-toolbar {
    display: none;
  }

  .header {
    margin-top: 4px;
  }

  .ql-container.ql-snow {
    border: 0 solid #ccc;
  }

  .edit_box {
    width: calc(~"100% - 24px - 10px");
    // height: 30px;
    background: #fff;
    .border_radius(@br: 4px;);
    padding: 0 10px;
    .box_sizing;
    margin-left: 10px;
    position: relative;

    .edit_area {
      outline: none;
      width: 100%;
      height: 30px;
      line-height: 1.7;
      max-height: 180px;

      .ql-editor {
        font-size: 14px;
        line-height: 20px;
        position: relative;
        padding: 4px 0;
        &:before {
          left: 0;
          color: @grayNight;
          font-family: "PingFang SC", "Microsoft YaHei";
          font-style: normal;
        }

        .add_file_wrap {
          display: inline;
        }

        strong {
          font-weight: normal;
        }
        u {
          word-wrap: break-word;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }

        img {
          width: 22px;
          height: 16px;
          display: inline-block;
          padding: 0 4px;
          cursor: pointer;
          margin-bottom: 4px;
          vertical-align: middle;
        }
      }
    }

    .operate {
      //   display: none;
      width: 100%;
      height: 0px;
      line-height: 38px;
      overflow: hidden;
      .upload_flag:hover {
        .icon-shangchuan-, .upload_name {
          color: @mainHover;
        }
      }

      .icon-shangchuan- {
        color: @grayNight;
        font-size: 16px;
        vertical-align: middle;
      }

      .upload_name {
        color: @grayNight;
        vertical-align: middle;
      }
      .main_button_ {
        .main_button_unfixed(@grayNight, #fff, #fff);
      }

      button {
        margin-top: 4px;
      }
    }
  }

  .at_pop {
    position: absolute;
    background: #fff;
    color: #333;
    border: 1px solid @bg-f2f2f2;
    border-radius: 2px;
    // padding: 2px;
    box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.2);
    font: 12px/1.3 "Arial", "Microsoft YaHei";
    z-index: 101;
    width: 154px;
    .box_sizing;

    li {
      height: 30px;
      width: 100%;
      padding: 10px;
      .box_sizing;
      .word_over;
      .cur;
      &:hover {
        background-color: #dcdcdc;
      }
    }
  }

      
  #editReplayProgress {
    position: absolute;
    left: 0;
  }

}

</style>


