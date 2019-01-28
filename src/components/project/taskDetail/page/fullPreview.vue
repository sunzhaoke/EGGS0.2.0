<template>
    <div class="full_preview" @click.stop='() => {}'>
        <div v-if='false' class="top_operate">
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
                v-for='(stage, index) in fullPreview.stageFileList'
                :key='stage.stageTaskId'
                >
                <div class="stage_top">{{stage.title}}</div>
                <div class="stage_file">
                    <template v-if='stage.enabled'>
                        <div 
                            class="file_group"
                            v-for='(group, index1) in stage.fileList'
                            :key='group.pkid'
                            >
                            <p class="group_title">{{group.groupName ? group.groupName : '未分组文件'}}</p>
                            <div class="group_list clearfix">
                                <div 
                                    :class="{file_box: true, file_box_hover: item.FilePkid === file.FilePkid}"
                                    v-for='(item, index2) in group.fileList'
                                    :key='item.FilePkid'
                                    @mouseenter.stop="fileMouseenter($event, item, index2, index1, index)"
                                    @mouseleave="fileMouseleave($event, item)"
                                    @click='enterTheDetails(index2, index1, index)'
                                >
                                    <span class="file_img">
                                        <img :src="item.UrlMins" alt="">
                                        <span class="none"></span>
                                    </span>
                                    <p class="file_title word_over">{{item.FileName}}</p>
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
        <transition name="fade1">
            <div 
                v-if='fileShow' 
                id='hoverFile' 
                class="hover_file" 
                >
                <div 
                    class="every_file"
                    @mouseenter="enterFile(file)"
                    @mouseleave="leaveFile(file)"
                    @click='enterTheDetails(file.index, file.groupIndex, file.stageIndex)'
                    >
                    <span class="file_pic">
                        <template v-if='file.FileType === 11 && file.Desc'>
                        <span class="text_desc"><span>{{file.Desc}}</span></span>
                        </template>
                        <template v-else>
                        <img :src="file.UrlMin" alt="">
                        </template>
                        <span class="none"></span>
                    </span>
                    <div class="file_info">
                        <p class="title">{{file.FileName}}</p>
                        <el-tooltip effect="dark" :content="file.nickName ? file.nickName : file.userName" placement="top" :open-delay="300">
                        <img :src="file.UserPic" alt="" class="from_header">
                        </el-tooltip>
                        <span class="file_message fr">
                        <el-tooltip effect="dark" content="评论" placement="top" :open-delay="300">
                            <i class='iconfont icon-pinglun'></i>
                        </el-tooltip>
                        {{file.Count}}
                        </span>
                        
                    </div>
                    <div class="null"></div>
                </div>
            </div>
        </transition>
        <transition name="fade1">
            <file-details v-if="filedetailsShow"
            :info='enterDetailInfo'
            @closeDetails='closeDetails' />
        </transition>
    </div>
</template>
<script>
import FileDetails from '../../fileDetails';

export default {
    props: ['taskId', 'fullList'],
    components: {
        FileDetails
    },
    data() {
        return {
            fileTypeImgM: [
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
             fileTypeImgB: [
                {
                    src: require("../../../../assets/img/file_b/0.png")
                }, {
                    src: require("../../../../assets/img/file_b/1.png")
                }, {
                    src: require("../../../../assets/img/file_b/2.png")
                }, {
                    src: require("../../../../assets/img/file_b/3.png")
                }, {
                    src: require("../../../../assets/img/file_b/4.png")
                }, {
                    src: require("../../../../assets/img/file_b/5.png")
                }, {
                    src: require("../../../../assets/img/file_b/6.png")
                }, {
                    src: require("../../../../assets/img/file_b/7.png")
                }, {
                    src: require("../../../../assets/img/file_b/8.png")
                }, {
                    src: require("../../../../assets/img/file_b/9.png")
                }, {
                    src: require("../../../../assets/img/file_b/10.png")
                }, {
                    src: require("../../../../assets/img/file_b/11.png")
                },
            ], // 文件类型图片
            fullPreview: {},
            file: {},
            fileShow: false,
            _time: null,
            _time1: null,
            filedetailsShow: false,
        }
    },
    methods: {
        // 进入文件详情
        enterTheDetails(index, groupIndex, stageIndex) {
            let stageInfo = this.fullPreview.stageFileList[stageIndex];
            this.enterDetailInfo = {
                groupIndex: groupIndex,
                fileIndex: index,
                fileList: stageInfo.fileList,
                type: 1,
                menuList: [
                    this.fullPreview.taskTitle, 
                    stageInfo.title, 
                    stageInfo.fileList[groupIndex].groupName, 
                    stageInfo.fileList[groupIndex].fileList[index].FileName
                ]
            }
            this.filedetailsShow = true;
            
        },
        // 关闭文件详情
        closeDetails() {
            this.filedetailsShow = false;
        },
        fileMouseenter(e, item, index2, index1, index) {
            if(this._time || this._time1) {
                clearTimeout(this._time);
                clearTimeout(this._time1);
                this._time = null;
                this._time1 = null;
            }
            this._time = setTimeout(() => {
                this.fileShow = true;
                this.file = Object.assign({}, item, {index: index2, groupIndex: index1, stageIndex: index});
                
                let returns = this.findparent($(e.target));
                let left = returns[0];
                let top = returns[1] + 70;
                this.$nextTick(() => {
                    let left1 = $('#hoverFile').offset().left;
                    let top1 = $('#hoverFile').offset().top;
                    let w = $('#hoverFile').width();
                    let h = $('#hoverFile').height();
                    let appW = $('#app').width();
                    let appH = $('#app').height();
                    if(left + w > appW) {
                        left = appW - w;;
                    }
                    if(top + h > appH) {
                        top = top - h - 70;
                    }
                    $('#hoverFile').css({left: left + 'px', top: top + 'px'});

                });
            }, 200);
            
        },
        fileMouseleave(e, item) {
            if(this._time || this._time1) {
                clearTimeout(this._time);
                clearTimeout(this._time1);
                this._time = null;
                this._time1 = null;
            }
          
            this._time1 = setTimeout(() => {
                this.fileShow = false;
                this.file = {};
            }, 200);

        },
        enterFile() {
            if(this._time) {
                clearTimeout(this._time);
            }
            if(this._time1) {
                clearTimeout(this._time1);
            }
            this.fileShow = true;
        },
        leaveFile() {
            this.fileShow = false;
            this.file = {};
        },
        findparent(e) {
            let attrs = e.attr('class');
            if(attrs && attrs === 'file_box') {
                return [e.offset().left, e.offset().top]
            }else {
               return this.findparent(e.parent()); 
            }
        },
        getData() {
            this.fullPreview = Object.assign({}, this.fullList);
            for(let x of this.fullPreview.stageFileList) {
                for(let y of x.fileList) {
                    for(let z of y.fileList) {
                        this.$set(z, 'FileType', this.getFlieTyle(z.Type));
                        if(z.FileType !== 1) {
                            this.$set(z, 'UrlMin', this.fileTypeImgB[z.FileType].src);
                        }
                        this.$set(z, 'UrlMins', this.fileTypeImgM[z.FileType].src);

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
  top: 51px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: #fff;

  .full_preview_list {
      width: 100%;
      height: 100%;
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
                        &:hover {
                            border: 1px solid #3684FF;
                        }
                      }
                      .file_box_hover {
                          border: 1px solid #3684FF;
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
  .hover_file {
      position: fixed;
      .every_file {
          border: 1px solid #3684FF;
          background: #ffffff;
          box-shadow:0px 1px 8px 0px rgba(59,59,59,0.5);
      }
  }
}
</style>

