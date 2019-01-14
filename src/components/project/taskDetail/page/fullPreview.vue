<template>
    <div class="full_preview" @click.stop='() => {}'>
        <div class="top_operate">
            <div class="t_o_left fl">
              <span>{{fullPreview.taskTitle}}</span>
            </div>
            <div class="t_o_right fr">
              <i class='iconfont icon-haoyou1'></i>
              <i class='iconfont icon-rili1'></i>
            </div>
        </div>
        <div class="full_preview_list clearfix">
            <div    
                class="every_stage"
                v-for='stage in fullPreview.stageFileList'
                :key='stage.stageTaskId'
                >
                <div class="stage_top">{{stage.title}}</div>
                <div class="stage_file">
                    <template v-if='stage.enabled'>
                        <div 
                            class="file_group"
                            v-for='group in stage.fileList'
                            :key='group.pkid'
                            >
                            <p class="group_title">{{group.groupName ? group.groupName : '未分组文件'}}</p>
                            <div class="group_list clearfix">
                                <div class="file_box"
                                    v-for='file in group.fileList'
                                    :key='file.FilePkid'
                                >
                                    <span class="file_img">
                                        <img :src="file.UrlMin" alt="">
                                        <span class="none"></span>
                                    </span>
                                    <p class="file_title word_over">{{file.FileName}}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-if='!stage.enabled' class="file_group_empty">
                        <span class="empty_img">
                            <img src="../style/file_empty.png" alt="">
                        </span>
                        <p>该阶段已关闭</p>
                    </div>
                    <div v-if='!stage.fileList.length && stage.enabled' class="file_group_empty">
                        <span class="empty_img">
                            <img src="../style/file_empty.png" alt="">
                        </span>
                        <p>暂无文件</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['taskId', 'fullList'],
    data() {
        return {
            fileTypeImg: [
                {
                    src: require("../../../../assets/img/file_m/0.png")
                }, {
                    src: require("../../../../assets/img/file_m/1.png")
                }, {
                    src: require("../../../../assets/img/file_m/2.png")
                }, {
                    src: require("../../../../assets/img/file_m/3.png")
                }, {
                    src: require("../../../../assets/img/file_m/4.png")
                }, {
                    src: require("../../../../assets/img/file_m/5.png")
                }, {
                    src: require("../../../../assets/img/file_m/6.png")
                }, {
                    src: require("../../../../assets/img/file_m/7.png")
                }, {
                    src: require("../../../../assets/img/file_m/8.png")
                }, {
                    src: require("../../../../assets/img/file_m/9.png")
                }, {
                    src: require("../../../../assets/img/file_m/10.png")
                }, {
                    src: require("../../../../assets/img/file_m/11.png")
                },
            ], // 文件类型图片
            fullPreview: {},
        }
    },
    methods: {
        getData() {
            this.fullPreview = Object.assign({}, this.fullList);
            for(let x of this.fullPreview.stageFileList) {
                for(let y of x.fileList) {
                    for(let z of y.fileList) {
                        this.$set(z, 'FileType', this.getFlieTyle(z.Type));
                        this.$set(z, 'UrlMin', this.fileTypeImg[z.FileType].src);
                    }
                }
            }

        }
    },
    created() {
        this.getData();
    }
};
</script>
<style lang='less'>
.full_preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: #fff;

  .full_preview_list {
      width: 100%;
      height: calc(100% - 51px);
      background: #fff;
      overflow-y: hidden;
      overflow-x: auto;
      white-space: nowrap;
      // 用这行的话就不能固定宽度了
      // display: flex;  
      .every_stage {
          width: 290px;
          height: 100%;
          border-right: 1px solid #EEEEEE;
            display: -webkit-inline-flex;
            display: -ms-inline-flexbox;
            display: inline-flex;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-align-items: stretch;
            -ms-flex-align: stretch;
            align-items: stretch;
          .stage_top {
              width: 100%;
              height: 40px;
              line-height: 40px;
              border-bottom: 1px solid #EEEEEE;
              text-align: center;
          }
          .stage_file {
              position: relative;
              width: 100%;
              height: calc(100% - 41px);
              padding: 6px 0 18px 24px;
              box-sizing: border-box;
              overflow-y: auto;
              .file_group {
                  .group_title {
                      font-weight: bold;
                      margin-bottom: 10px;
                      margin-top: 12px;
                  }
                  .group_list {
                      .file_box {
                          float: left;
                          width: 74px;
                          height: 70px;
                          border: 1px solid #EEEEEE;
                          border-radius: 2px;
                          box-sizing: border-box;
                          margin: 0 10px 6px 0;
                          cursor: pointer;
                          .file_img {
                              display: inline-block;
                              width: 100%;
                              height: 48px;
                              text-align: center;
                              img {
                                 width: 24px;
                                 height: 30px;
                                 margin-top: 10px;
                              }
                              .none {
                                height: 100%;
                                display: inline-block;
                                vertical-align: middle;
                              } 
                          }
                          .file_title {
                              width: 100%;
                              padding: 0 2px;
                              box-sizing: border-box;
                              font-size: 12px;
                              text-align: center;
                              
                          }
                      }
                  }
              }
              .file_group_empty {
                  position: absolute;
                  width: 74px;
                  top: 35%;
                  left: 50%;
                  margin-left: -37px;
                  .empty_img {
                      display: inline-block;
                      width: 74px;
                      height: 70px;
                      background: #FBFBFF;
                      border-radius: 2px;
                      position: relative;
                      img {
                          width: 36px;
                          height: 40px;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          margin-top: -20px;
                          margin-left: -18px;
                      }
                  }
                  p {
                      font-size: 12px;
                      margin-top: 12px;
                      color: #666;
                  text-align: center;

                  }
              }
          }
      }
  }
}
</style>

