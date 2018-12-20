<template>
    <!-- 上传进度 -->
    <transition name="fade">
        <div class="upload_progress">
        <p class="upload_progress_title">上传进度</p>
        <i class="upload_progress_close el-icon-close" @click="close"></i>
        <ul class="upload_progress_ul">
            <li class="upload_progress_li" v-for="(progress, index) in fileProgressList" :key="index">
            <span class="upload_progress_img">
                <img v-if="progress.FileTypeNum == 1" :src="progress.imgUrl" alt="">
                <img v-else :filetype="progress.FileTypeNum" :src="progress.FileTypeNum > 0 ? fileTypeImg[progress.FileTypeNum - 2].src : fileTypeImg[fileTypeImg.length - 1].src">
                </span>
            <span class="upload_progress_name">{{progress.name}}</span>
            <span class="upload_progress_percent"><el-progress :stroke-width="4" :percentage="Number(progress.progress)" :show-text="false"></el-progress></span>
            <span v-if="Number(progress.progress) < 100" class="upload_progress_size">{{progress.nowSize}}/{{progress.sizes}}</span>
            <span v-else class="upload_progress_size">{{progress.sizes}}</span>
            <el-tooltip v-if="progress.status == 1" class="item" effect="dark" content="取消上传" placement="top">
                <i class="iconfont icon-close" @click.stop="cancel(progress)"></i>
            </el-tooltip>
            <i v-if="progress.status == 2" class="iconfont icon-xuanzhong"></i>
             <el-tooltip v-if="progress.status == 3" class="item" effect="dark" content="重新上传" placement="top">
                <i class="iconfont icon-shuaxin" @click.stop="reUpload(progress)"></i>
            </el-tooltip>
            
            </li>
        </ul>
        </div>
    </transition>
</template>
<script>
export default {
    props: ['fileProgressList'],
    data() {
        return {
            fileTypeImg: [
            {
                src: require("../../assets/img/file_m/2.png")
            }, {
                src: require("../../assets/img/file_m/3.png")
            }, {
                src: require("../../assets/img/file_m/4.png")
            }, {
                src: require("../../assets/img/file_m/5.png")
            }, {
                src: require("../../assets/img/file_m/6.png")
            }, {
                src: require("../../assets/img/file_m/7.png")
            }, {
                src: require("../../assets/img/file_m/8.png")
            }, {
                src: require("../../assets/img/file_m/9.png")
            }, {
                src: require("../../assets/img/file_m/10.png")
            }, {
                src: require("../../assets/img/file_m/0.png")
            },
            ], // 文件类型图片
        }
    },
    filters: {
        
    },
    methods: {
      // 关闭文件上传视图
      close() {
        this.$emit('closeProgress');
      },
      // 取消上传
      cancel(item) {
          let x = this.fileProgressList.findIndex(ele => ele.uid == item.uid);
          (x != -1) && (this.fileProgressList.splice(x, 1));
          (!this.fileProgressList.length) && (this.close());
          this.$emit('handleCancel', item);

      },
      // 重新上传
      reUpload(item) {
          this.$emit('handleRe', item);

      },
    },

    // 取消上传
    cerated() {
        
    },


}
</script>

