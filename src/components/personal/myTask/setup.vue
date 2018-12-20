<template>
    <div class="publish_main fl">
            <div v-for="(edit, index) in areaList" :key="edit.id" @click="editSelect(index)">
              <edit-able 
                ref="edit" 
                :editNum="editNum"
                :nowIndex="index"
                :data="edit"
                :areaLength="areaList.length"
                :selectStaff="selectStaff"
                @delAreaHandle="delArea"
                @areaFileChangeHandle="areaFileChange"
              ></edit-able>
            </div>
            <!-- 添加分区 -->
            <span class="add_area" @click="addArea">
              <i class="el-icon-circle-plus-outline"></i>
              <span>添加分区</span>
            </span>
            <!-- 文件上传 -->
            <el-upload
              :action="'/File.ashx?publisher='+userPkid+'&informationType=Pub'"
              :show-file-list="false"
              :multiple="true"
              :on-success="uploadSuccess"
              :on-progress="uploadProgress"
              :limit="9"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload">
              <i class="el-icon-upload2"></i>
              <span>添加附件</span>
            </el-upload>
            <div class="pre_img_a" id="preview">
              <img class="icon_img" src="http://server.apexgame.cn/upload/file/20180917035852/97bc6665-c457-4ec6-b2ea-233926cc4010/b97cde35-b015-40d2-abf9-9c32adcb2c07.png"
                  alt="">
              <span class="pre_name">7.png</span>
              <i fileid="4309" class="pre_del iconfont icon-delete fr">DEL</i>
              <i fileid="4309" class="pre_edit iconfont icon-bi fr">EDIT</i>
          </div>
             <!-- 文件上传进度条 -->
        <upload-progress v-if="uploadProgressFlag" :fileProgressList="fileProgressList" @closeProgress="closeProgress"></upload-progress>
    </div>
</template>
<script>
import editAble from "../common/editable";
import uploadProgress from "../../common/uploadProgress";
export default {
  components: {
    editAble,
    uploadProgress
  },
  data() {
    return {
      areaList: [{ id: 0, title: "", content: "", people: [], files: [] }],
      selectStaff: [
        { id: "001", name: "mark" },
        { id: "002", name: "jerry" },
        { id: "003", name: "tom" },
        { id: "004", name: "祝建云" },
        { id: "005", name: "赵珂" }
      ],
      areaListLength: 1,
      nowEdit: null,
      editNum: 0,
      userPkid: "1184", // 用户id
      uploadProgressFlag: false, // 上传进度显示隐藏
      fileProgressList: [], // 上传进度列表
      uploadList: []
    };
  },
  methods: {
    // 选择当前分区
    editSelect(index) {
      this.nowEdit = this.$refs.edit[index];
      this.editNum = index;
    },

    // 添加分区
    addArea() {
      let lengths = this.areaListLength++;
      this.areaList.push({
        id: lengths,
        title: "",
        content: "",
        people: [],
        files: []
      });
    },

    // 删除分区
    delArea(index) {
      this.areaList.splice(index, 1);
    },

    // 添加文件
    addFile(file) {
      if (!this.nowEdit) {
        this.nowEdit = this.$refs.edit[0];
      }
      this.nowEdit.addFile(file);
    },

    // 文件上传相关方法
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
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
    // 文件上传前
    beforeUpload(file) {
      // 先判断有没有重复
      let index = this.uploadList.findIndex(ele => {
        return ele.name == file.name;
      });
      if (index !== -1) {
        this.$message("文件重复");
        return false;
      }

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

    // 文件上传中
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

    // 文件上传成功
    uploadSuccess(res, file) {
      let type = file.name.split(".")[1];
      this.$set(file, "FileTypeNum", this.getFlieTyle(type));
      this.uploadList.push(file);
      this.addFile(file);

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
    },

    // 监测子元素数据变化
    areaFileChange(index, data) {
      this.areaList[index] = data;
      // console.log("----areaFileChange", this.areaList);
    }
  },
  created() {
    this.areaListLength = this.areaList.length;
  }
};
</script>
<style lang="less">
@import "../../../assets/css/base.less";

.publish_main {
  width: calc(~"100% - 200px");
  min-height: 300px;
  height: calc(~"100% - 50px - 60px");
  overflow: auto;
  padding: 40px;
  .box_sizing;
}

.add_area {
  .cur;
  display: inline-block;
  margin: 20px 0;
}

.pre_img_a {
  z-index: 100;
}

.pre_img_a {
  display: none;
  width: 120px;
  height: 160px;
  background-color: #fff;
  position: absolute;
  top: 30px;
  left: 0;
  box-shadow: 0 0 4px #3b5185;
  padding: 10px;
  .box_sizing;
  .border_radius(@br: 4px);
  .icon_img {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .pre_name,
  .iconfont {
    color: @graySix;
  }
  .pre_name {
    font-size: 12px;
    line-height: 16px;
    width: 100px;
    display: block;
    margin-top: -8px;
    .word_over;
  }
  .iconfont {
    font-size: 14px;
    line-height: 14px;
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>


