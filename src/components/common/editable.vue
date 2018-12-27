<template>
    <div class="eidtable">
      <div class="area_title">
        <span class="title_prefix">##</span>
        <input 
        type="text" 
        placeholder="输入分区标题"
        v-model="datas.title"
        @keyup.enter="titleEnter"
        />
        <i v-if="areaLength > 1" class="area_del iconfont icon-delete" @click="delArea"></i>
      </div>
     <div 
        :id="'editArea'+nowIndex"
        class="edit_area"
        ref="editArea"
        spellcheck="false"
      
     ></div>
     
      <ul class="at_pop" ref="atPop" v-show="showPop">
        <li
          v-for="item in selectStaff" 
          :key="item.id"
          @click="addStaffClick(item)"
        >{{item.name}}</li>
      </ul>
    </div>
</template>
<script>
import caret from "jquery.caret";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default {
  props: ["nowIndex", "areaLength", "data", "selectStaff", "editNum"],
  data() {
    return {
      fileTypeImgIcon: [
        {
          src: require("../../assets/img/file_s/0.png")
        },
        {
          src: require("../../assets/img/file_s/1.png")
        },
        {
          src: require("../../assets/img/file_s/2.png")
        },
        {
          src: require("../../assets/img/file_s/3.png")
        },
        {
          src: require("../../assets/img/file_s/4.png")
        },
        {
          src: require("../../assets/img/file_s/5.png")
        },
        {
          src: require("../../assets/img/file_s/6.png")
        },
        {
          src: require("../../assets/img/file_s/7.png")
        },
        {
          src: require("../../assets/img/file_s/8.png")
        },
        {
          src: require("../../assets/img/file_s/9.png")
        },
        {
          src: require("../../assets/img/file_s/10.png")
        },
        {
          src: require("../../assets/img/file_s/11.png")
        }
      ],
      fileTypeImg: [
        {
          src: require("../../assets/img/file_b/0.png")
        },
        {
          src: require("../../assets/img/file_b/0.png")
        },
        {
          src: require("../../assets/img/file_b/2.png")
        },
        {
          src: require("../../assets/img/file_b/3.png")
        },
        {
          src: require("../../assets/img/file_b/4.png")
        },
        {
          src: require("../../assets/img/file_b/5.png")
        },
        {
          src: require("../../assets/img/file_b/6.png")
        },
        {
          src: require("../../assets/img/file_b/7.png")
        },
        {
          src: require("../../assets/img/file_b/8.png")
        },
        {
          src: require("../../assets/img/file_b/9.png")
        },
        {
          src: require("../../assets/img/file_b/10.png")
        },
        {
          src: require("../../assets/img/file_b/11.png")
        }
      ],
      eidtHtml: "",
      isTitle: true,
      datas: Object.assign({}, this.data),
      showPop: false,
      range: null,

      // new
      quill: {},
      curP: 0,
      delFlag: true,
      addFileFlag: false,
      nowFileId: ""
    };
  },

  methods: {
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
      this.quill.insertEmbed(this.curP, 'image', file.urlIcon);
      this.curP = this.quill.getSelection() ? this.quill.getSelection().index : this.curP;
      this.quill.setSelection(this.curP + 1);
      this.quill.insertText(this.curP + 1, file.name, { 'color': '#253ca6', 'underline': true}, true);
      this.quill.insertText(this.curP + file.name.length + 1, ' ', { 'color': '#000000', 'underline': false }, true);
      this.quill.setSelection(this.curP + file.name.length + 2);
      this.addFileFlag = false;

      let selection = window.getSelection();
      let targetNode = $(selection.extentNode.parentNode).prev();

      if(targetNode.prop("tagName") == 'U') {
        targetNode.attr({'fileid': file.response});
        targetNode = targetNode.prev();
        if(targetNode.prop("tagName") == 'IMG') {
          targetNode = targetNode.prev();
          targetNode.attr({'fileid': file.response});
        }
      }

      this.datas.files.push(file.response);
      this.$emit("areaFileChangeHandle", this.editNum, this.datas);

    },

    // 删除分区
    delArea() {
      this.$emit("delAreaHandle", this.nowIndex);
    },

    // 分区标题enter
    titleEnter() {
      this.isTitle = false;
    },

    // 删除文件时改变数组，触发父组件的方法
    getDelFile(fileid) {
      let indexs = this.datas.files.findIndex(el => {
        return el == fileid;
      });
      if (indexs !== -1) {
        this.datas.files.splice(indexs, 1);
        this.$emit("areaFileChangeHandle", this.nowIndex, this.datas);
      }
    },


    // 展示弹出层
    showAtPop() {
      let pos = $(".ql-editor").eq(this.editNum).caret("position");
      $(this.$refs.atPop).css({
        top: pos.top + 60 - $(".ql-editor").eq(this.editNum).scrollTop(),
        left: pos.left
      });
      if (!this.showPop) this.showPop = true;
    },

    // 选中列表项添加到文本域中
    addStaffClick(item, curchar) {
       let name, lengths;
        name = item.name;
        this.quill.formatText(this.curP - 1, 1, {
            'color': '#253ca6',
            'bold': true
        });
        this.quill.insertText(this.curP, name, {
            'color': '#253ca6',
            'bold': true
        }, true);
        lengths = name.length;
        this.quill.insertText(this.curP + lengths, ' ', { 'color': '#000000', 'bold': false }, true);
        this.quill.setSelection(this.curP + lengths + 1);
        this.showPop = false;
    },
  },
  mounted() {
    let _ = this;
    let ids = "#editArea" + _.nowIndex;
    _.quill = new Quill(ids, {
      theme: "snow"
    });
    _.curP = _.quill.getLength();
    _.quill.setSelection(_.curP);

    // 失去焦点时，保存光标的位置
    $(".ql-editor").eq(_.nowIndex).blur(function() {
      _.curP = _.quill.getSelection().index;
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

              let fileid = $(parentNode).attr('fileid');
              _.getDelFile(fileid);
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
    $(".ql-editor").eq(_.editNum).on('mouseover', function (e) {
      return;
      let target = $(e.target);
      if (target.prop("tagName") == 'IMG' || target.prop("tagName") == 'U') {
          let text = '';
          if(target.prop("tagName") == 'IMG') {
              text = target.next().text();
          }else {
              text = target.text();
          }
          let files = file.find( el => {
              return text == el.name;
          });
          if(files) {
              _.nowFileId = files.ids;
          }

          var X = target.offset().top;
          var Y = target.offset().left;
          $('#preview').show().css({ top: X + 24, left: Y });
      } else {
          // $('#preview').hide();
      }
  });



  }
};
</script>
<style lang="less">
@import "../../assets/css/base.less";

.eidtable {
  width: 100%;
  min-height: 100px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  position: relative;
  .box_sizing;

  .area_title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #f2f2f2;
    .box_sizing;
    position: relative;
    .title_prefix {
      display: inline-block;
      height: 100%;
      line-height: 36px;
      color: #333333;
      font-size: 18px;
      font-weight: 700;
    }

    input {
      display: inline-block;
      height: 100%;
      line-height: 36px;
      color: #333333;
      font-size: 18px;
      font-weight: 700;
    }

    .area_del {
      position: absolute;
      right: 4px;
      top: 12px;
      .cur;
    }
  }

  .ql-toolbar {
    display: none;
  }

  .ql-container.ql-snow {
    border: 0 solid #ccc;
  }

  .edit_area {
    outline: none;
    // min-height: 90px;
    // background: url("../../../assets/img/lines.png") repeat;
    // line-height: 30px;

    .ql-editor {
      font-size: 14px;
      line-height: 30px;
      position: relative;
      background: url("../../assets/img/lines.png") repeat;
      padding: 0 10px;
      strong {
        font-weight: normal;
      }
      u {
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

  .at_pop {
    position: absolute;
    background: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 2px;
    // padding: 2px;
    box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.2);
    font: 12px/1.3 "Arial", "Microsoft YaHei";
    z-index: 100;
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
}
</style>


