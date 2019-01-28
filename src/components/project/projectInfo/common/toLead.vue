<template>
    <div id="toLead"
         class="popup">
        <div class="editStage"
             v-show="toLeadShow">
            <div class="titleTop">导入
                <i class="iconfont icon-guanbijiantou fr"
                   @click="closePop"></i>
            </div>
            <div class="toLeadMainBox">
                <span>
                    <img src="../../../../assets/img/tolead.png"
                         width="278px"
                         alt="">
                </span>
                <span class="icon">
                    <i class="iconfont icon-chaoxian_right"
                       @click="closePop"></i>
                </span>
                <span>
                    <img src="../../../../assets/img/datalog.png"
                         width="278px"
                         alt="">
                </span>
                <p>
                    通过将Xmind中的思维导图导出为Excel格式，再导入我们系统，就能将思维导图转换为我们的任务目录 您也可以直接下载Excel模板，填写目录内容后批量导入
                </p>
            </div>

            <div class="bottomButton">
                <div class="buttonBox fr">
                    <el-upload class="upload-demo fl"
                               :action="'/ExcelFile.ashx?&projectId='+projectId+'&myUserId='+userPkid"
                               :on-preview="handlePreview"
                               :on-remove="handleRemove"
                               :before-remove="beforeRemove"
                               :show-file-list="false"
                               multiple
                               :on-success="uploadSuccess"
                               accept=".xls,.xlsx"
                               :limit="3"
                               :on-exceed="handleExceed">
                        <button class="main_button_bg">上传Excel文件</button>
                    </el-upload>
                    <button class="main_button_border downloadMould">
                        <a href="http://eggs.apexgame.cn/upload/Excel/Excel下载模板 .xlsx">下载Excel模板</a>
                    </button>
                </div>
            </div>
        </div>
        <!-- 没有内容 确认 是否导入取消 -->
        <div class="affirmPop"
             v-show="isLeadShow">
            <div class="top">
                <i class="iconfont icon-return fl"
                   @click="closePop"></i>
                <span> 导入确认</span>
            </div>
            <div class="main">
                <p class="promptText">Excel文件已上传成功，是否开始导入？</p>
                <span class="fileBox">
                    <img src="../../../../assets/img/file_m/3.png"
                         alt="">
                    <span class="fileName">{{fileTittle}}</span>
                </span>
            </div>
            <div class="bottom">
                <span class="agin cur">
                    <el-upload class="upload-demo"
                               :action="'/ExcelFile.ashx?&projectId='+projectId+'&myUserId='+userPkid"
                               :on-preview="handlePreview"
                               :on-remove="handleRemove"
                               :before-remove="beforeRemove"
                               :show-file-list="false"
                               multiple
                               :on-success="uploadSuccess"
                               accept=".xls,.xlsx"
                               :limit="3"
                               :on-exceed="handleExceed">
                        重新选择
                    </el-upload>
                </span>
                <span class="start cur"
                      @click="startTolead">开始导入</span>
            </div>
        </div>

        <!-- 有内容 温馨提示 -->
        <div class="affirmPop"
             v-show="isShowGroupAndTask"
             @click.stop='isShowGroup=false'>
            <div class="top">
                <span> 温馨提示</span>
            </div>
            <div class="main">
                <p class="promptText">
                    系统监测到您的目录已存在内容，您可以选择要保留的内容
                </p>
                <span class="fileBox">
                    <span class="pleaseChoose">
                        {{checkNum}}
                        <i class="iconfont icon-unfold"
                           @click.stop="isShowGroupList"></i>
                    </span>
                    <div class="groupAndTask"
                         v-show="isShowGroup">
                        <ul v-for="(list,index) of groupAndTask"
                            :key="list.partitionId"
                            class="groupLists">
                            <li class="groupTitle cur"
                                @click.stop="checkGroup(list)">
                                <span class="isfold"
                                      @click.stop="isfold(list)">
                                    <i :class="list.isfold ?'icon-unfold':'icon-enter'"
                                       class="iconfont"></i>
                                </span>
                                <span class="partitionTitle">{{list.partitionTitle}}</span>
                                <i class="iconfont icon-xuanzhong"
                                   v-show="list.isChecked"></i>
                            </li>
                            <li v-for="(item,index) of list.taskList"
                                :key="index"
                                class="taskTitle cur"
                                @click.stop="checkTask(item)"
                                v-show="list.isfold">
                                {{item.taskTitle}}
                                <i class="iconfont icon-xuanzhong"
                                   v-show="item.isChecked"></i>
                            </li>
                        </ul>
                    </div>
                </span>
            </div>
            <div class="bottom">
                <span class="agin cur"
                      @click="closePop">取消 </span>
                <span class="start cur"
                      @click="startTolead">确认</span>
            </div>
        </div>

        <!-- 导入内容 -->
        <div class="importContent"
             v-if="importContentShow">
            <div class="top">
                <span> 温馨提示</span>
            </div>
            <div class="Contentmain">
                <div class="lable">
                    <ul class="lableTitle">
                        <li>
                            <span>分区</span>
                            <span>任务/阶段</span>
                            <span></span>
                        </li>
                    </ul>
                    <div class="partition  clearfix"
                         v-for="(list,index) of itemList"
                         :key="index">
                        <span class="groupTittle fl">
                            <span class="TittleBox">
                                <i class="iconfont icon-unfold"></i>
                                <span class="name">{{list.Title}}</span>
                            </span>
                        </span>
                        <div class="lists fl">
                            <div class="taskTittle"
                                 v-for="(item ,index) of list.Child"
                                 :key="index">
                                <span> {{item}}</span>
                                <span></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="ContentBottom">
                <span class="main_button_bg fr"
                      @click="ok">确认</span>
                <span class="main_button fr"
                      @click="cancelImport">取消</span>
            </div>
        </div>

    </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
    data() {
        return {
            checkNum: '请选择',
            toLeadShow: true, //导入是否显示
            projectId: JSON.parse(localStorage.getItem('projectItem')).projectid,
            userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
            fileTittle: '',
            groupAndTask: [],
            isShowGroupAndTask: false,
            importContentShow: false,
            itemList: [],
            isLeadShow: false, //没有内容 提示是否导入
            isShowGroup: false, //
            group: 0,
        }
    },
    components: {
        draggable,
    },
    watch: {
        groupAndTask(val, old) {
            let group = 0;
            for (let list of val) {
                var groupNum = 0;
                for (let item of list.taskList) {
                    if (item.isChecked) {
                        groupNum += 1;
                        console.log(item)
                        group = group + 1;
                    }
                    if (groupNum == list.taskList.length) {
                        list.isChecked = true;
                    } else {
                        list.isChecked = false;
                    }
                }
            }
            this.checkNum = '已选择' + group + '项内容';
        }
    },
    props: [],
    methods: {
        // 取消导入
        cancelImport() {
            this.importContentShow = false;
        },
        ok() {
            let gropLists = [];
            let taskLists = [];
            for (let list of this.groupAndTask) {
                if (!list.isChecked) {
                    gropLists.push(list.partitionId);
                }
                for (let item of list.taskList) {
                    if (!item.isChecked) {
                        taskLists.push(list.partitionId);
                    }
                }
            }
            let data = { 'projectId': this.projectId, 'myUserId': this.userPkid, 'delPartitionVale': gropLists.join(','), 'delTaskVale': taskLists.join(','), 'itemList': JSON.stringify(this.itemList).toString() }
            this.$HTTP('post', '/project_Import', data).then(res => {
                this.$emit('closePop');
            })
        },
        isShowGroupList() {
            this.isShowGroup = !this.isShowGroup;
        },
        isfold(item) {
            item.isfold = !item.isfold;
            this.groupAndTask = [...this.groupAndTask];
        },
        closePop() {
            this.$emit('closePop');
        },
        checkTask(item) {
            item.isChecked = !item.isChecked;
            this.groupAndTask = [...this.groupAndTask];
        },
        checkGroup(item) {
            item.isChecked = !item.isChecked;
            if (item.isChecked) {
                for (let i of item.taskList) {
                    i.isChecked = true;
                }
            } else {
                for (let i of item.taskList) {
                    i.isChecked = false;
                }
            }
            this.groupAndTask = [...this.groupAndTask];

        },
        uploadSuccess(res) {
            let arr = res.result;
            this.fileTittle = arr.FileName;
            this.toLeadShow = false;
            this.itemList = arr.ItemList;
            for (let list of this.groupAndTask) {
                if (list.taskList.length) {
                    this.isShowGroupAndTask = true;
                } else {
                    this.isLeadShow = true;
                }
            }
        },
        startTolead() {
            this.importContentShow = true;
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {

        },
        handlePreview(file) {
            console.log(file);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        // 获取当前分区及任务列表
        getGroupList() {
            let data = { 'project': this.projectId };
            this.$HTTP('post', '/project_get_Catalog', data).then(res => {
                this.groupAndTask = res.result;
                for (let i of this.groupAndTask) {
                    i.isfold = false;
                    i.isChecked = false;
                    for (let j of i.taskList) {
                        j.isChecked = false;
                    }
                }
                console.log(this.groupAndTask);
            })
        }
    },
    mounted() {

    },
    created() {
        this.getGroupList();
    }
}
</script>

<style lang='less'>
@import "../../../../assets/css/base.less";
#toLead {
  .editStage {
    width: 800px;
    min-height: 490px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .icon-xuanzhong {
      color: red !important;
    }
    .titleTop {
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      font-size: 16px;
      font-family: "PingFang-SC-Bold";
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      padding: 0 20px;
      .box_sizing;
    }
    .toLeadMainBox {
      padding: 70px 83px 38px 83px;
      .box_sizing;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      span {
        display: inline-block;
        float: left;
      }
      img {
        margin-bottom: 60px;
      }
      .icon {
        height: 165px;
        line-height: 165px;
        text-align: center;
        width: 68px;
        display: inline-block;
        i {
          font-size: 32px;
          color: #3684ff;
        }
      }
    }
    .bottomButton {
      width: 100%;
      height: 70px;
      line-height: 70px;
      padding: 0 25px;
      position: absolute;
      bottom: 0;
      .box_sizing;
      #File1 {
        width: 130px;
        position: absolute;
        top: 20px;
        opacity: 0;
      }
      .downloadMould {
        margin-left: 10px;
      }
    }
    p {
      text-align: center;
      line-height: 1.5;
    }
  }
  .affirmPop {
    width: 400px;
    height: 212px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 15px 0px rgba(59, 81, 133, 0.3);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -106px;
    .top {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #f2f2f2;
      padding: 0 20px;
      .box_sizing;
      i {
        text-align: left;
      }
      span {
        color: #333333;
        font-weight: bold;
      }
    }
    .main {
      text-align: center;
      .promptText {
        line-height: 60px;
      }
      .fileBox {
        display: inline-block;
        width: 180px;
        .pleaseChoose {
          display: inline-block;
          width: 180px;
          height: 32px;
          line-height: 32px;
          border: 1px solid rgba(54, 132, 255, 1);
          border-radius: 4px;
          position: relative;
          text-align: left;
          padding-left: 15px;
          .box_sizing;
          .icon-unfold {
            position: absolute;
            right: 15px;
          }
        }
        .groupAndTask {
          width: 180px;
          max-height: 231px;
          overflow: scroll;
          position: absolute;
          z-index: 99;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(229, 229, 229, 1);
          box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        }
        .fileName {
          max-width: 235px;
          margin-top: 10px;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .groupLists {
          width: 100%;
          .groupTitle {
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            font-weight: bold;
            position: relative;
            text-align: left;
            padding: 0 43px;
            .box_sizing;
            .partitionTitle {
              padding: 0 30px;
              width: 170px;
              .box_sizing;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: absolute;
              left: 0;
            }
            .isfold {
              display: inline-block;
              width: 20px;
              height: 20px;
              left: 10px;
              position: absolute;
              z-index: 99;
              i {
                font-size: 14px;
                font-weight: normal;
              }
            }
            .icon-xuanzhong {
              position: absolute;
              right: 15px;
              color: #3684ff;
            }
          }
          .taskTitle {
            height: 32px;
            line-height: 32px;
            text-align: left;
            padding: 0 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .box_sizing;
            position: relative;
            .icon-xuanzhong {
              position: absolute;
              right: 15px;
              color: #3684ff;
            }
          }
        }
        .groupLists :hover {
          background: #f2f2f2;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 0;
      height: 40px;
      width: 100%;
      border-top: 1px solid #f2f2f2;
      .agin {
        border-right: 1px solid #f2f2f2;
        color: #999999;
      }
      .start {
        color: #3684ff;
      }

      span {
        // position: absolute;
        display: inline-block;
        height: 40px;
        width: 49%;
        line-height: 40px;
        text-align: center;
      }
    }
  }
  .importContent {
    width: 535px;
    height: 540px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #f2f2f2;
      padding: 0 20px;
      .box_sizing;
    }
    .Contentmain {
      height: 415px;
      border-bottom: 1px solid #f2f2f2;
      padding: 13px 20px;
      .box_sizing;
      .lable {
        width: 100%;
        height: 100%;
        overflow: scroll;
        border: 1px solid rgba(54, 132, 255, 1);
        border-radius: 4px;
        .lableTitle {
          height: 40px;
          line-height: 40px;
          li {
            display: flex;
            flex-direction: row;
            span {
              line-height: 40px;
              text-align: center;
              border-right: 1px solid #eeeeee;
              border-bottom: 1px solid #eeeeee;
            }
            span:nth-child(1) {
              display: inline-block;
              width: 112px;
              height: 40px;
            }
            span:nth-child(2) {
              display: inline-block;
              width: 140px;
              height: 40px;
            }
            span:nth-child(3) {
              display: inline-block;
              width: 252px;
              height: 40px;
            }
          }
        }

        .partition {
          display: flex;
          flex-direction: row;
          .groupTittle {
            width: 108px;
            display: inline-block;
            text-align: center;
            position: relative;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .TittleBox,
            i {
              position: absolute;
              top: 50%;
              left: 10px;
              transform: translateY(-50%);
              .name {
                display: inline-block;
                line-height: 1.5;
                margin-left: 25px;
                width: 60px;
              }
            }
          }
          .lists {
            width: calc(100% - 120px);
            .taskTittle {
              height: 70px;
              width: 380px;
              text-align: left;
              display: flex;
              flex-direction: row;
              span {
                padding: 0 20px;
                .box_sizing;
                line-height: 70px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                display: inline-block;
                height: 70px;
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
              }
              span:nth-child(1) {
                width: 136px;
              }
              span:nth-child(2) {
                width: 252px;
              }
            }
          }
        }
      }
    }
    .ContentBottom {
      height: 70px;
      padding: 0 25px;
      .box_sizing;
      span {
        margin-top: 27px;
      }
    }
  }
}
</style>
