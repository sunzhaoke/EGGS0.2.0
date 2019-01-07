<template>
  <div class="project_task">
    <div class="project_task_top">
      <el-select v-model="selectedProject"
                 placeholder="请选择">
        <el-option v-for="item in projectList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   @change="projectChange">
        </el-option>
      </el-select>
      <i class="iconfont project_star"
         :class="starFlag ? 'icon-star' : 'icon-shoucang'"></i>
      <i class="iconfont icon-shuxingliebiaoxiangqing"
         @click="itemInformationShow=true"></i>

      <div class="fr otherButton">
        <i class="iconfont icon-19daoru"
           @click="toLead()"></i>
        <i class="iconfont icon-haoyou"></i>
        <el-dropdown @click.native.stop="parthCommand()">
          <span class="el-dropdown-link">
            <i class="iconfont icon-gengduo"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="parthCommand('editStage')">编辑阶段</el-dropdown-item>
            <el-dropdown-item @click.native="parthCommand('share')">分享</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="project_search fr">
        <el-input placeholder="请输入搜索的任务标题"
                  clearable
                  prefix-icon="el-icon-search"
                  size="small"
                  v-model="searchValue"
                  @input="searchChange">
        </el-input>

        <el-collapse-transition>
          <div v-if="searchLists && searchLists.length"
               class="search_list">
            <ul class="search_list_ul">
              <li class="search_list_li"
                  v-for="(item, index) in searchLists"
                  :key="index"
                  @click="goTo(item)">
                <img :src="item.Images"
                     alt=""
                     class="header">
                <span class="title">{{item.titles}}</span>
                <i class="iconfont icon-star"></i>
                <button v-if="item.state === 1"
                        class="task_state task_state1">已完成</button>
                <button v-else-if="item.state === 2"
                        class="task_state task_state2">今日截止</button>
                <button v-else-if="item.state === 3"
                        class="task_state task_state3">已超时99+天</button>
                <button v-else
                        class="task_state task_state4">11月12日截止</button>
                <span v-if="item.fromParth"
                      class="from_parth">{{item.fromParth}}</span>
              </li>
            </ul>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <div class="project_task_list fl"
         id="taskList">
      <div class="tableBox">
        <div class="topTable"
             :class="{'topTableFixed':isFixed}">
          <div class="topBar">
            <div :class="{'stageHeader':leftFixed}"
                 class="clearfix stageListBox">
              <div class="label partitionTitle">分区</div>
              <div class="label taskTitle">任务/阶段</div>
            </div>
            <div :class="{'stageRight':leftFixed}"
                 class=" clearfix stageListBox">
              <div v-for="(list,index) in stageList"
                   :key="list.pkid"
                   class="stageTitleLists"
                   :class="{'hoverBg':mouseTopIndex==index} ">
                {{list.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="mainContent"
             :class="{'mainContentFixed':isFixed}">
          <draggable v-model="partitionsList"
                     :move="getdata"
                     @update="datadragEnd"
                     @start='starDrag'
                     :options="{ghostClass: 'ghost_file', dragClass: 'drag_file'}">
            <transition-group class="hhah">
              <div v-for="(element,index) in partitionsList"
                   :key="element.partitionId"
                   class="partitionsMain"
                   :data-partitionid='element.partitionId'>
                <transition name="fade">
                  <div class="partitionsAndStages"
                       v-if="!element.autoExpand">
                    <div ref='partitions'
                         class="cur partitionsLabel"
                         style="heigth:100px;"
                         :class="{'partitionsLabelFixed':leftFixed}"
                         :style="'height:'+ ((element.taskList.length )* 72) +'px;'">
                      <span class="iconBox">
                        <span class="icon"
                              @click="move"
                              v-if="element.partitionId!==0">
                          <i class="iconfont icon-pailie cur"
                             @click="movePartitions"></i>
                        </span>
                        <span class="icon"
                              @click="addPartition(element,index)">
                          <i class="iconfont icon-jia1 cur"></i>
                        </span>
                        <span class="icon"
                              @click="openDelPartition(element,index)"
                              v-if="element.partitionId!==0">
                          <i class="iconfont icon-delete cur"></i>
                        </span>
                      </span>
                      <i class="iconfont cur unfold"
                         :class="!element.autoExpand?'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                      <textarea type="text"
                                class="stageTittle"
                                v-model="element.partitionTitle"
                                style="resize:none"
                                @blur="stageBlur(element.partitionTitle,element,index)"></textarea>

                    </div>
                    <!-- 空白占位 -->
                    <span v-if="element.isBlank"
                          class="stageBox">
                      <span class="stageLists">
                        <textarea class="stageName"
                                  style="resize:none"
                                  v-model="element.newStageName"
                                  @blur="newStageBlur(element,element.newStageName)">
                        </textarea>
                      </span>
                      <div class="stageListsBox">
                        <div v-for="(list,index) in stageList"
                             :key="list.pkid"
                             class="stage"></div>
                      </div>
                    </span>
                    <draggable v-model="element.taskList"
                               class="box"
                               :move='getdata2'
                               @update="datadragEnd2"
                               :options="{
                                 group: 'file', 
                                 ghostClass: 'ghost_file', 
                                 dragClass: 'drag_file',
                                 draggable: '.dragging'
                                 }">
                      <transition-group class="taskLists">
                        <!-- 任务及阶段 -->
                        <li v-for="(item,index) in element.taskList"
                            v-if='item.taskId'
                            :key="item.taskId"
                            class="stageBox"
                            @mouseenter="mouseEnter(element,index)"
                            :class="{'stageBoxFixed':leftFixed,'dragging':item.taskId!==''}">
                          <span class="stageLists cur"
                                :class="{'leftTaskFixed':leftFixed,'hoverBg':mouseLeftIndex==index}">
                            <span class="iconBox_">
                              <span class="icon"
                                    @click="move">
                                <i class="iconfont icon-pailie cur"
                                   @click="movePartitions"></i>
                              </span>
                              <span class="icon"
                                    @click="addStage(element.taskList,index)">
                                <i class="iconfont icon-jia1 cur"></i>
                              </span>
                              <span class="icon"
                                    @click="delStage(element.taskList,index,item)">
                                <i class="iconfont icon-delete cur"></i>
                              </span>
                            </span>
                            <textarea v-model="item.taskTitle"
                                      class="stageName"
                                      style="resize:none"
                                      @blur="stageNameBlur(item.taskTitle,item,element,index)">
                            </textarea>
                          </span>
                          <div class="stageListsBox"
                               :class="{'stageListsBoxFixed':leftFixed}">
                            <div class="stage cur"
                                 v-for="(lists,index) in item.stageTaskList"
                                 :key="index"
                                 @mouseenter='mouseTopEnter(item,index)'>
                              <!-- 正常显示状态==================================================================== -->
                              <!-- 1.我参与时 有背景 -->
                              <div class="stageBg"
                                   v-if="lists.isPartIn"></div>
                              <!-- 2.完成时显示 -->
                              <div class="finishPage"
                                   v-if='lists.stageTaskState==true&&lists.enabled===true'>
                                <i class="iconfont icon-wancheng"></i>完成</div>
                              <!-- 3.开启状态 显示内容 -->
                              <div class="stageInfo cur"
                                   v-if="lists.enabled ==true&&lists.stageTaskState==false">
                                <span class="participantImg">
                                  <span class="img"
                                        v-for="(i,index) in lists.userList"
                                        :key="index">
                                    <img :src="i.userPic"
                                         alt="">
                                  </span>
                                </span>
                                <div class="participantMain">
                                  <span class="pieChart">
                                    <span class="pie1"></span>
                                    <span class="pie2"></span>
                                    <span class="pie3"></span>
                                    <span class="pie4"></span>
                                  </span>
                                  <span v-for='(startime,index) of lists.startTimeArr'
                                        :key="1+index">
                                    <span v-if="!startime.year==nowYear">{{startime.year}}/</span>
                                    <span> {{startime.month}}/{{startime.day}} {{startime.hour}}:{{startime.minute}} -</span>
                                  </span>
                                  <span v-for='(end,index) of lists.endTimeArr'
                                        :key="2+index">
                                    <span v-if="!end.year==nowYear">{{end.year}}/</span>
                                    <span> {{end.month}}/ {{end.day}} {{end.hour}}:{{end.minute}}</span>
                                  </span>
                                  <i class="iconfont icon-wenjian1"
                                     v-if="lists.fileCont!=0||lists.fileCont!=''">{{lists.fileCont}}</i>
                                </div>
                              </div>
                              <!-- 4.关闭状态 不显示内容 -->
                              <div v-if='lists.enabled===false'
                                   class="closePage">
                                <span class="closeLine"></span>
                              </div>

                              <!-- hover显示状态 =====================================================================-->
                              <!--1. 参与与不参与 都显示详细内容  -->
                              <div class="stageHover"
                                   v-if="lists.stageTaskState===false&&lists.enabled===true||lists.enabled===''">
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="参与任务"
                                            @click.native="partIn(item,lists)"
                                            placement="top-start"
                                            v-if="!lists.isPartIn">
                                  <el-button>
                                    <span class="iconBg">
                                      <i class="iconfont icon-jiaru-1"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="取消参与"
                                            @click.native="cancelPartIn(item,lists)"
                                            placement="top-start"
                                            v-if="lists.isPartIn">
                                  <el-button>
                                    <span class="iconBg">
                                      <i class="iconfont icon-tuichu-"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="进入详情"
                                            @click.native="enterDetail(item,lists)"
                                            placement="top-start">
                                  <el-button class="timeShow">
                                    <span class="iconBg">
                                      <i class="iconfont icon-xiangqing"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>

                                <el-tooltip class="item"
                                            effect="dark"
                                            content="添加时间"
                                            placement="top-start">
                                  <el-button>
                                    <div class="calendar">
                                      <el-date-picker v-model="value6"
                                                      prefix-icon='iconfont icon-rili1'
                                                      type="datetimerange"
                                                      clearable
                                                      @change="checkTime(item,lists,value6)"
                                                      range-separator="至"
                                                      start-placeholder="开始日期"
                                                      end-placeholder="结束日期">
                                      </el-date-picker>
                                    </div>
                                  </el-button>
                                </el-tooltip>
                                <div class="people">
                                  <div class="add_people_box"
                                       @click.stop="addPeople(item,lists)">
                                    <el-tooltip class="item"
                                                effect="dark"
                                                content="添加成员"
                                                placement="top-start">
                                      <el-button>
                                        <i class="iconfont icon-tianjiarenyuan otherColor"></i>
                                      </el-button>
                                    </el-tooltip>
                                    <el-collapse-transition>
                                      <Participant v-if="lists.addPopShow"
                                                   ref="addPeople"
                                                   id="addPeople"
                                                   :creatorId="userPkid"
                                                   :defaultKeys="defaultKeys"
                                                   :userList="userList"
                                                   @handleSure="addPeopleSure"
                                                   @handleInvite="invitePeople" />

                                    </el-collapse-transition>
                                  </div>
                                </div>
                                <el-dropdown>
                                  <span class="el-dropdown-link">
                                    <el-tooltip class="item"
                                                effect="dark"
                                                content="上传文件"
                                                placement="top-start">
                                      <el-button>
                                        <i class="iconfont icon-shangchuan otherColor"></i>
                                      </el-button>
                                    </el-tooltip>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                      <el-upload ref="demandUpload"
                                                 class="from_local dis-in-bl"
                                                 :action="'/File_Upload.ashx?&projectId='+projectItem.projectid+'&taskId='+taskId+'&userId='+userPkid+'&replyId=-1'"
                                                 :show-file-list="false"
                                                 :multiple="true"
                                                 :on-error="uploadError"
                                                 :on-success="uploadSuccess"
                                                 :on-progress="uploadProgress"
                                                 :limit="9"
                                                 :on-exceed="handleExceed"
                                                 :before-upload="beforeUpload">
                                        <span class="upload_name">本地上传</span>
                                      </el-upload>

                                    </el-dropdown-item>
                                    <el-dropdown-item>从个人文档上传</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="上传文件"
                                            placement="top-start">
                                  <el-button>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item"
                                            effect="dark"
                                            :content="lists.userList.length?'已有内容无法关闭':'关闭阶段'"
                                            @click.native="closeStage(item, lists)"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-jinzhi otherColor "
                                       :class="{'cur_dis':lists.userList.length}"></i>
                                  </el-button>
                                </el-tooltip>

                              </div>

                              <div class="finishHover"
                                   v-if="lists.stageTaskState===true&&lists.enabled===true">
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="进入详情"
                                            @click.native="enterDetail(item,lists)"
                                            placement="top-start">
                                  <el-button class="timeShow">
                                    <span class="iconBg">
                                      <i class="iconfont icon-xiangqing"></i>
                                    </span>
                                  </el-button>
                                </el-tooltip>
                              </div>

                              <div v-if="lists.enabled===false"
                                   class="closeHover">
                                <el-tooltip class="item"
                                            effect="dark"
                                            content="开启阶段"
                                            @click.native="openStage(item, lists)"
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-kaishi otherColor "></i>
                                  </el-button>
                                </el-tooltip>
                              </div>

                            </div>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </div>
                </transition>
                <!-- 缩略列表 -->
                <div class="thumbnailList"
                     v-if="element.autoExpand">
                  <div class="iconBox_">
                    <span class="icon"
                          @click="move"
                          v-if="element.partitionId!==0">
                      <i class="iconfont icon-pailie cur"
                         @click="movePartitions"></i>
                    </span>
                    <span class="icon"
                          @click="addPartition(element,index)">
                      <i class="iconfont icon-jia1 cur"></i>
                    </span>
                    <span class="icon"
                          @click="openDelPartition(element,index)"
                          v-if="element.partitionId!==0">
                      <i class="iconfont icon-delete cur"></i>
                    </span>
                  </div>
                  <li class="">
                    <transition name="flodRotate">
                      <i class="iconfont"
                         :class="!element.autoExpand ? 'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                    </transition>
                    <span>
                      {{element.partitionTitle}}
                    </span>
                  </li>
                </div>
              </div>
            </transition-group>
          </draggable>
          <div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade1">
      <Info v-if="itemInformationShow"
            @closePop='closeInfo'
            num='itemInformation'
            :projectId='projectId'
            :classify='classify'></Info>
    </transition>

    <transition name="fade1">
      <Reminder2 v-if="reminder2Flag"
                 :type="1"
                 :text="errMessage"
                 :sureText="buttonMes"
                 @handleCancle="reminderCancel"
                 @handleSure="reminderSure" />
    </transition>
    <transition name="fade1">
      <ShadePop v-if="popShow"
                @closePop='closePop'
                :projectId='projectId'
                :userPkid='userPkid' />

      <ToLead v-if="toLeadShow"
              @closePop='closePop'></ToLead>
    </transition>
    <!-- 添加人员 -->
    <transition name="fade1">
      <add-people v-if="inviteShow"
                  :defaultTreeKeys="inviteDefaultKeys"
                  @handleCancel="cancelAddPeople" />
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Info from "../common/info";
import ShadePop from "../common/shadePop";
import ToLead from "./common/toLead";
import Participant from "./common/participant";
import UploadProgress from "../../common/uploadProgress";
import AddPeople from "../../common/addPeople";

import Reminder2 from "../../common/reminder2";
// import { searchList } from './data.js';/ 
import draggable from "vuedraggable";
import { WSAESOCKTNOSUPPORT } from 'constants';

export default {
  components: {
    draggable,
    Info,
    Reminder2,
    ShadePop,
    ToLead,
    Participant,
    UploadProgress,
    AddPeople
  },
  data() {
    return {
      mouseLeftIndex: 0,
      mouseTopIndex: 0,

      taskPeopleList: [],
      value6: '',
      toLeadShow: false, //弹框 导入是否显示 
      popShow: false,// 弹框 阶段排序是否显示
      reminder2Flag: false, //确认删除弹框
      errMessage: '',
      newStageName: '',
      buttonMes: '确认',
      itemInformationShow: false, //INFO是否显示
      projectId: JSON.parse(localStorage.getItem('projectItem')).projectid,
      classify: "", //点击进入 是我负责的还是 我参与 权限修改
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      projectList: [
        {
          value: "选项1",
          label: "Eggs0.1.1"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
      ],
      selectedProject: "选项1",
      starFlag: true,
      detailsShow: false,
      taskId: '',

      nowTaskId: '', //当前点击的 id
      nowStageId: '', //当前点击的 id

      searchLists: [],
      searchValue: '',
      //  表格选项
      isFixed: false,
      leftFixed: false,
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      loginUser: JSON.parse(localStorage.getItem('staffInfo')), // 当前登录者的信息
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      stageList: [], //阶段设置
      partitionsList: [],
      // 新建分区
      EmptyData: '',
      // 添加任务
      newTask: '',
      delPartitionLists: [], //当前删除的分区
      delIndex: '', //当前删除的分区的index
      nowYear: '', //当前年
      userList: [], //项目参与人员列表
      addPeopleShow: false, // 添加参与者是否显示
      fileProgressList: '',
      inviteShow: false, // 邀请添加人员

      defaultKeys: [], //默认添加的人员


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
    };
  },
  watch: {

  },
  computed: {
    // defaultKeys() {
    //   let arr = [];
    //   console.log(this.taskPeopleList)
    //   if (this.taskPeopleList) {
    //     for (let x of this.taskPeopleList) {
    //       arr.push(x.userpkid);
    //     }
    //   }

    //   return arr;
    // }
  }
  ,
  methods: {
    ...mapMutations(['DETAILS_CHANGE', 'TASKITEM_CHANGE', 'TASK_POSITION', 'PROJECT_CHANGE']),
    // 展开详情
    // 取消
    mouseEnter(el, index) {
      this.mouseLeftIndex = index;
    },
    mouseTopEnter(el, index) {
      this.mouseTopIndex = index;
    },
    // 点击邀请好友
    invitePeople(ids) {
      // this.addPeopleShow = false;
      this.inviteShow = true;
      this.inviteDefaultKeys = ids;
    },

    // 取消添加人员/邀请人员中发生变化事发送请求
    cancelAddPeople(obj) {
      if (obj) {
        (obj.invite === false) && (this.inviteShow = false);
        // 发送请求，taskPeopleList发生变化
        console.log("add-people", obj);
        this.addPeopleSure(Object.assign(obj, { add: obj.addIds, del: [] }));

      } else {
        this.inviteShow = false;
      }
    },
    // 任务片段操作
    // 1.1. 参与任务
    partIn(item, list) {
      console.log(item, list)

      let obj = { 'addVale': this.userPkid, 'delVale': '', 'stageId': list.stageId, 'taskId': item.taskId, 'myUserId':  this.userPkid }

      this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
        console.log(res)

      })
    },
    // 1.2.取消参与
    cancelPartIn(item, list) {
      let obj = { 'addVale': '', 'delVale': this.userPkid, 'stageId': list.stageId, 'taskId': item.taskId, 'myUserId':  this.userPkid }
      this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
        console.log(res)
      })
    },

    // 3.修改任务时间
    checkTime(item, list, val) {
      console.log(item, list, val)


      // if(val){}
      let data = {
        'stageId': list.stageId,
        'taskId': item.taskId,
        'startTime': this.format(val[0], "yyyy-MM-dd HH:mm:ss"),
        'endTime': this.format(val[1], "yyyy-MM-dd HH:mm:ss"),
      }
        ;
      this.$HTTP('post', '/stageTask_date_update', data).then(res => {
        console.log(res)
      })
    },
    // 关闭阶段
    closeStage(item, list) {
      list.enabled = false;
      this.partitionsList = [...this.partitionsList];

      let data = {
        'stageId': list.stageId,
        'taskId': item.taskId,
        'enabled': 0,
      }

      this.$HTTP('post', '/stageTask_IsOpen', data).then(res => {
        console.log(list)
      })
    },
    // 开启阶段
    openStage(item, list) {
      list.enabled = true;
      this.partitionsList = [...this.partitionsList];

      let data = {
        'stageId': list.stageId,
        'taskId': item.taskId,
        'enabled': 1,
      }
      this.$HTTP('post', '/stageTask_IsOpen', data).then(res => {
      })
    },
    // 获取项目成员列表
    getProjectUser(item) {
      item.addPopShow = true;
      this.partitionsList = [...this.partitionsList];
      return new Promise((resolve, reject) => {
        let obj = {
          projectId: this.projectId,
          myUserId: this.userPkid
        }
        this.$HTTP('post', '/project_usersList_get', obj).then(res => {
          this.userList = res.result;
          resolve(this.userList)
        }).catch(err => {
          reject(err);
        });
      });

    },


    async addPeople(list, item, ) {
      this.nowTaskId = list.taskId;
      this.nowStageId = item.stageId;
      this.taskPeopleList = item.userList;

      if (this.taskPeopleList) {
        for (let x of this.taskPeopleList) {
          this.defaultKeys.push(x.userpkid);
        }
      }




      console.log(this.taskPeopleList)
      try {
        await this.getProjectUser(item);
        // this.addPeopleShow = true;;
      } catch (err) {
        console.log(err);
      }
      let clickHide = e => {
        item.addPopShow = false;
        this.partitionsList = [...this.partitionsList];

        // this.addPeopleShow = false; // 隐藏
        $(document).unbind("click", clickHide)

      };
      $(document).bind("click", clickHide)
    },

    // 添加/删除人员成功
    addPeopleSure(data) {

      this.addPeopleShow = false; // 隐藏
      console.log('participant', data);
      // 发送请求
      if (data && (data.add || data.del)) {
        let add = [...data.add];
        let del = [...data.del];
        let obj = {
          addVale: add.join(','),
          delVale: del.join(','),
          stageId: this.nowStageId,
          taskId: this.nowTaskId,
        }

        this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
          // 发送请求，taskPeopleList发生变化
          let arr = res.result;
          if (del) {
            for (let x = 0; x < del.length; x++) {
              for (let y = 0; y < this.taskPeopleList.length; y++) {
                if (del[x] == this.taskPeopleList[y].userId) {
                  this.taskPeopleList.splice(y, 1);
                  y--;
                }
              }
            }
          }
          // this.taskPeopleList = this.taskPeopleList.concat(arr.taskUserList);
          console.log('任务添加人员', res);
        }).catch(err => {
          console.log('任务添加人员失败', err);
        });
        // 发送请求
      }
    },

    // ================================================================
    // 文件上传


    // 文件上传失败
    uploadError(err, file) {
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].status = 3;
      }
    },
    // 文件上传成功
    uploadSuccess(res, _file) {
      let file = Object.assign({}, _file.response.result);
      // let type = file.name.split(".")[1];
      // this.$set(file, "FileTypeNum", this.getFlieTyle(file.FileType));
      let file1 = Object.assign({}, file);
      file1 = this.handleFile([file1]);
      this.demandFile = this.demandFile.concat(file1);

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
    // 文件上传超出提示
    handleExceed(files, fileList) {
      this.$message.warning("最多只能选择9个文件");
    },
    // 文件上传前
    beforeUpload(file) {
      // 先判断有没有重复
      let index = this.demandFile.findIndex(ele => {
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
    },

    // 文件上传中
    uploadProgress(event, file, fileList) {
      let percents = parseInt(event.percent);
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });

      if (ids !== -1) {
        this.fileProgressList[ids].progress = percents;
        this.fileProgressList[ids].nowSize = this.conver(percents / 100 * this.fileProgressList[ids].size);

        // 测试重新上传
        if (percents > 30 && percents < 35) {
          if (file.reUploadXhr) {
            file.reUploadXhr.abort();
            file.reUploadXhr = null;
          } else {
            this.$refs.demandUpload.abort(file);
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

    // ======================================================

    toLead() {
      console.log('hah')
      this.toLeadShow = true
    },
    // 关闭弹框
    closePop() {
      this.popShow = false;
      this.toLeadShow = false;
    },
    parthCommand(command) {
      if (command == 'editStage') {
        console.log('chufa')
        this.popShow = true;
      }
    },

    // 展开详情
    enterDetail(item, lists) {
      this.$router.push({
        name: 'TaskDetail',
        params: {
          projectId: this.projectId,
          stageId: lists.stageId,
          taskId: item.taskId,
        }
      });
    },

    reminderCancel() {
      this.reminder2Flag = false;
    },
    //  确认
    reminderSure() {
      this.delPartition(this.delPartitionLists, this.delIndex);
      // this.partitionsList.splice(index, 1);
    },
    // 新建任务光标离开
    newStageBlur(el, title) {
      console.log(el.taskList == true, title, el.isnew);

      if (el.isnew === false) {
        // 旧的 空的
        if (title == '') {
          return
        } else {
          // 判断 名字是否需要修改 
          let data = { 'myUserId': this.userPkid, 'projectId': this.projectId, 'partitionId': el.partitionId, 'title': title, 'iSort': 0 }
          this.$HTTP('post', '/task_add', data).then(res => {
            this.getProjectAll();
          })
        }
      }
    },
    projectChange(val) {
      // this.PROJECT_CHANGE(val);
    },
    searchChange(val) {
      if (val) {
        this.searchLists = [...searchList];
      } else {
        this.searchLists = [];
      }
    },

    goTo(item) {
      this.searchChange('');
      this.TASK_POSITION(item.id);
    },

    // 关闭
    closeInfo() {
      this.itemInformationShow = false;
    },
    // 添加分区
    addPartition(el, index) {
      this.partitionsList.splice(index + 1, 0, this.EmptyData);
      this.$nextTick(res => {
        $('.hhah').children().eq(index + 1).find('.stageTittle').focus()
      })
    },

    // 删除分区弹框打开
    openDelPartition(element, index) {
      this.delPartitionLists = element;
      this.delIndex = index;
      this.errMessage = '您确认删除该分区？删除后，分区内的任务将移入到未分区内';
      this.reminder2Flag = true;
    },
    // 删除分区 操作
    delPartition(element, index) {

      // 判断如果有list列表
      if (element.taskList == '') {
        this.partitionsList.splice(index, 1);
      } else {
        let taskIds = [];
        for (let list of element.taskList) {
          // taskId=='' 时 说明没有任务 可以直接删除 不用移动
          if (list.taskId !== '') {
            taskIds.push(list.taskId);
          }
        }
        let arr = { 'vals': taskIds.join(','), 'type': 0 }
        this.$HTTP('post', '/partition_updateType', arr).then(res => {
          this.partitionsList.splice(index, 1);
        })
      }
      let obj = { 'partitionId': element.partitionId }
      this.$HTTP('post', '/partition_delete', obj).then(res => {
        this.reminder2Flag = false;

      })
    },
    // 分区移动
    getdata(evt) {
      // console.log(evt.draggedContext.element.id)
    },
    // 分区移动
    datadragEnd(evt) {

      let obj = { partitionId: evt.item.dataset.partitionid, isSort: evt.newIndex }
      this.$HTTP('post', '/partition_update_isSort', obj).then(res => {
      })
      // console.log('拖动后的索引 :' + evt.newIndex)
    },
    // 添加分区 判断是否有内容
    stageBlur(name, el, index) {
      // 旧的
      if (el.isnew === false) {
        // 旧的 空的
        if (name == '') {
          return
        } else {
          // 判断 名字是否需要修改 
          this.modifyPartitionName(el.partitionId, name);
        }
        // 新建的
      } else {
        if (name == '') {
          this.partitionsList.splice(index, 1);
        } else {
          let obj = { 'myUserId': this.userPkid, 'projectId': this.projectId, title: name }
          this.$HTTP('post', '/partition_add', obj).then(res => {
            this.EmptyData.partitionId = res.result.partitionId;
          })
        }
      }
    },

    // 修改分区名字
    modifyPartitionName(partitionId, title) {
      let data = { 'partitionId': partitionId, 'title': title }
      this.$HTTP('post', '/partition_update', data).then(res => {
        console.log(res)
      })
    },

    // 修改任务名字
    ModifyTaskName(taskId, title) {
      let data = { 'taskId': taskId, 'title': title }
      this.$HTTP('post', '/task_update_title', data).then(res => {
        console.log(res)
      })
    },
    // 添加任务
    addStage(el, index) {
      el.splice(index + 1, 0, this.newTask)
      this.$nextTick(res => {
        $('.taskLists').children().eq(index + 1).find('.stageName').focus()
      })
    },
    // 添加项目 光标离开判断
    stageNameBlur(name, item, el, index) {
      if (item.isnew === false) {
        // 旧的 空的
        if (name == '') {
          return
        } else {
          // 判断 名字是否需要修改 
          this.ModifyTaskName(item.taskId, name);
        }
        // 新建的
      } else {
        if (name == '' || name == undefined) {
          el.taskList.splice(index, 1);
        } else {
          let obj = { 'myUserId': this.userPkid, 'projectId': this.projectId, partitionId: el.partitionId, 'title': name, 'iSort': index }
          this.$HTTP('post', '/task_add', obj).then(res => {
          })
        }
      }
    },
    // 删除任务
    delStage(el, index, item) {
      el.splice(index, 1)
      let obj = { 'taskId': item.taskId }
      this.$HTTP('post', '/task_del', obj).then(res => {

      })
    },

    starDrag() {
      for (let item of this.partitionsList) {
        item.autoExpand = true;
      }
    },
    movePartitions() {
      console.log('ceshi ')
    },

    move() { },

    startDrag(data) {
      console.log('startDrag: ', data)
    },
    endDrag(data) {
      console.log('endDrag: ', data)
    },
    goFlod(el) {
      el.autoExpand = !el.autoExpand;

      let obj = { 'myUserId': this.userPkid, 'projectId': this.projectId, 'partitionId': el.partitionId, 'isState': el.autoExpand }
      this.$HTTP('post', '/partition_operation', obj).then(res => {

      })


    },
    handleScroll() {
      var scrollTop = parseInt($('.tableBox')[0].scrollTop);
      var scrollLeft = parseInt($('.tableBox')[0].scrollLeft);
      // console.log(scrollLeft);
      if (scrollTop >= 40) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      if (scrollLeft >= 224) {
        this.leftFixed = true;
      } else {
        this.leftFixed = false;
      }
    },



    getdata2(evt) {
      evt.preventDefault();
      console.log(evt.draggedContext.element.id, 'element.id')
    },
    datadragEnd2(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
    },
    // 获取阶段列表
    getstageList() {
      let data = { 'projectId': this.projectId, 'state': 0 };
      this.$HTTP('post', '/stage_list_get', data).then(res => {
        this.stageList = res.result;
        let newList = [];
        for (var i = 0; i < this.stageList.length; i++) {
          newList.push({ 'stageId': i });
        }
        this.EmptyData =
          {            'partitionId': -1, 'partitionTitle': '', 'autoExpand': false, 'taskList': [
              { 'taskId': -1, 'stageTaskList': newList },
            ]          }

        this.newTask = { 'taskId': -1, 'stageTaskList': newList }
      })
    },
    // 获取项目所有列表
    getProjectAll() {
      let data = { project: this.projectId, 'myUserId': this.userPkid }
      this.$HTTP('post', '/project_get_info', data).then(res => {
        this.partitionsList = res.result;
        for (let list of this.partitionsList) {
          list.isnew = false;
          if (list.taskList !== '') {
            for (let i of list.taskList) {
              i.isnews = false;
              if (i.taskId === '') {
                list.isBlank = true;
                list.taskList.splice(i, 1)
              }
              this.stageTaskList = i.stageTaskList;
              for (let item of i.stageTaskList) {

                console.log(item, 'hahhha  ')
                item.addPopShow = false;
                if (item.userList.length) {
                  let indexs = item.userList.findIndex(res => {
                    return res.userpkid == this.userPkid;
                  })
                  if (indexs !== -1) {
                    item.isPartIn = true;
                  } else {
                    item.isPartIn = false;
                  }
                } else {
                  item.isPartIn = false;
                }


                if (item.startTime) {


                  console.log(new Date(item.startTime) - new Date(), '时间差');

                  console.log(new Date(item.endTime) - new Date(item.startTime), '时间差');

                  let time = item.startTime.split(' ');
                  time = time[0].split('/').concat(time[1].split(':'));
                  item.startTimeArr = [
                    {                      year: time[0].substring(2, 4),
                      month: time[1],
                      day: time[2],
                      hour: time[3],
                      minute: time[4]
                    }
                  ]
                }
                if (item.endTime) {
                  let time = item.endTime.split(' ');
                  time = time[0].split('/').concat(time[1].split(':'));
                  item.endTimeArr = [
                    {                      year: time[0].substring(2, 4),
                      month: time[1],
                      day: time[2],
                      hour: time[3],
                      minute: time[4]
                    }
                  ]
                }

                // console.log(item.endTime, '是瑟吉欧飞机了解到放了几fi')
                // if()
              }
            }
          }
        }
        console.log(this.partitionsList)
      })
    },
  },
  created() {
    let nowTime = new Date();
    this.nowYear = String(new Date().getFullYear()).slice(2, 4);

    this.getstageList(); //获取阶段列表 
    this.getProjectAll();

  },
  mounted() {
    let _ = this;
    $('.tableBox')[0].addEventListener('scroll', _.handleScroll);
    // window.onresize = () => {
    //   return (() => {
    //     if (this.detailsShow) {
    //       var docEl = document.documentElement,
    //         resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    //         clientWidth = docEl.clientWidth;
    //       let W = $('.project_task').eq(0).width();
    //       $("#taskList").width(clientWidth > 1600 ? W - 780 : W - 600);
    //       $("#taskDetails").width(clientWidth > 1600 ? 779 : 599);
    //     }
    //   })();
    // };

  }
};
</script>

<style lang="less">
@import "../../../assets/css/base.less";
// @import "vue-easytable/libs/themes-base/index.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.iconfontH:hover {
  color: @mainColor !important;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.flodRotate-enter-active {
  animation: bounce-in 0.1s;
}
.flodRotate-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.hoverBg {
  background: #f2f2f2 !important;
}
.shade {
  position: fixed;
  width: 100%;
  height: 100%;
  background: red;
  z-index: 10000;
}
.project_task {
  width: 100%;
  height: 100%;
  // height: calc(~ '100% - 50px');
  overflow: hidden;

  .project_task_top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @bg-f2f2f2;
    padding: 0 25px;
    .box_sizing;
    .iconfont {
      padding: 5px;
      &:not(.project_star) {
        color: @grayNight;
      }
    }

    .project_star {
      color: @starColor;
    }

    .el-select {
      .el-input__inner {
        padding: 0;
        border: none;
        &:focus {
          border: none;
        }
      }
    }
    .project_search {
      position: relative;
      .el-input {
        width: 290px;
      }
      .search_list {
        position: absolute;
        top: 42px;
        left: 0;
        width: 520px;
        max-height: 330px;
        overflow: auto;
        border: 1px solid #e5e5e5;
        background: #fff;
        .border_radius(@br: 4px;);
        z-index: 10;

        .search_list_ul {
          .search_list_li {
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            .cur;
            img,
            span,
            button,
            .iconfont {
              vertical-align: middle;
            }
            img {
              margin-left: 25px;
            }

            .title {
              .dis-in-bl;
              margin-left: 10px;
              width: 160px;
              .word_over;
            }

            .icon-star {
              margin-left: 22px;
              color: @starColor;
            }
            .task_state {
              font-size: 12px;
              padding: 0 !important;
              width: 90px;
              text-align: center;
              margin: 0 7px;
              margin-left: 24px;
            }
            .task_state1 {
              .main_button_unfixed(#169a19, #ECFFED, #ECFFED);
            }
            .task_state2 {
              .main_button_unfixed(#EA3F33, #F7F7F7, #F7F7F7);
            }
            .task_state3 {
              .main_button_unfixed(#EA3F33, #FFE8E6, #FFE8E6);
            }
            .task_state4 {
              .main_button_unfixed(#999999, #F7F7F7, #F7F7F7);
            }

            .from_parth {
              .dis-in-bl;
              margin-left: 10px;
              width: 95px;
              font-weight: bold;
              .word_over;
            }

            &:hover {
              background: @bg-f2f2f2;
            }
          }
        }
      }
    }
    .otherButton {
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
      margin-left: 10px;
      .el-row {
        height: 30px;
        display: inline-block;
      }
      .el-dropdown {
        height: 30px;
      }
    }

    .icon-rili {
      padding: 0 5px;
      margin-right: 19px;
      .box_sizing;
    }
  }
  .project_task_list {
    width: 100%;
    height: calc(~"100vh - 50px - 51px");
    overflow-x: auto;
    .tableBox {
      width: 100%;
      height: 100%;
      color: #333333;
      font-size: 14px;
      overflow-x: auto;
      .topTable {
        height: 40px;
        background: #fff;
        z-index: 100;
        .topBar {
          display: flex;
          flex-direction: row;
          // 左右移动 左侧 两个title 定位
          .stageHeader {
            display: flex;
            flex-direction: row;
            position: fixed;
            z-index: 999;
          }

          .label {
            width: 112px;
            height: 40px;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .box_sizing;
            background: #fff;
            text-align: center;
            line-height: 40px;
          }
          .taskTitle {
            width: 140px;
          }
          .stageListBox {
            display: flex;
            flex-direction: row;
          }
          .stageRight {
            padding-left: 253px;
            display: flex;
            flex-direction: row;
          }
          //4个阶段 标题 内容
          .stageTitleLists {
            z-index: 99;
            width: 252px;
            height: 40px;
            line-height: 40px;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            background: #fff;
            text-align: center;
            line-height: 40px;
            .box_sizing;
          }
        }
      }
      // 上下滚动 定位样式
      .topTableFixed {
        position: fixed;
        z-index: 99;
        box-shadow: 0px 2px 4px 0px rgba(153, 153, 153, 0.4);
      }

      .mainContentFixed {
        padding-top: 40px;
      }
      .mainContent {
        display: flex;
        flex-direction: column;
        z-index: 1;
        //1. 每行内容 包含分区（任务 阶段）
        .partitionsMain {
          display: flex;
          flex-direction: row;
          min-height: 72px;
          .partitionsAndStages {
            display: flex;
            flex-direction: row;
            // 2. 每条任务阶段 及任务片段内容（不含分区）
            .stageBox {
              display: flex;
              flex-direction: row;
              .stageLists {
                height: 72px;
                width: 140px;
                background: #fff;
                line-height: 72px;
                border-left: 1px solid rgba(153, 153, 153, 0);
                border-top: 1px solid rgba(153, 153, 153, 0);
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
                .box_sizing;
                text-align: center;
                position: relative;
                .stageName {
                  padding: 20px 0;
                  width: 100px;
                  border: none;
                  .box_sizing;
                }
                .iconBox_ {
                  position: absolute;
                  height: 30px;
                  line-height: 30px;
                  left: 0px;
                  .icon {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    line-height: 14px;
                    background: rgba(246, 250, 255, 1);
                    border-radius: 4px;
                    margin: 2px;
                    display: none;
                    i {
                      font-size: 12px;
                    }
                  }
                }
              }
              .stageLists:hover {
                border: 1px solid#C4C4C4;
                .icon {
                  display: inline-block;
                }
              }

              .leftTaskFixed {
                z-index: 99;
                position: fixed;
              }
              .stage {
                width: 252px;
                height: 72px;
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
                .box_sizing;
                background: #fff;
              }
              // 阶段（内容）样式
              .stageListsBox {
                display: flex;
                flex-direction: row;
                // z-index: 1;
                // 关闭状态样式
                .closePage {
                  height: 72px;
                  text-align: center;
                  .closeLine {
                    margin-top: 36px;
                    display: inline-block;
                    width: 40px;
                    height: 1px;
                    background: #f2f2f2;
                  }
                }
                // 完成状态
                .finishPage {
                  height: 72px;
                  text-align: center;
                  line-height: 72px;
                  color: #3684ff;
                }
                .stage {
                  position: relative;
                  .stageBg {
                    position: absolute;
                    display: inline-block;
                    height: 52px;
                    width: 100%;
                    background: rgba(171, 204, 255, 0.1);
                    top: 10px;
                    border-left: 2px solid #3684ff;
                    z-index: 1;
                  }
                  .stageHover {
                    position: absolute;
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    z-index: 100;
                    padding: 25px 35px;
                    display: none;
                    .box_sizing;
                    .el-button {
                      background: none;
                      border: none;
                      padding: 0;
                      i {
                        color: #fff;
                        font-size: 14px;
                      }
                      .otherColor {
                        color: #666666;
                      }
                    }
                    .iconBg {
                      display: inline-block;
                      width: 24px;
                      height: 24px;
                      text-align: center;
                      line-height: 24px;
                      background: rgba(54, 132, 255, 1);
                      border-radius: 4px;
                    }

                    .people {
                      display: inline-block;
                      // padding-left: 30px;
                      // margin-top: 10px;
                      .people_header {
                        position: relative;
                        .dis-in-bl;
                        .cur;
                        padding: 0 5px;
                        position: relative;
                        .del_peop {
                          position: absolute;
                          top: 1px;
                          left: 5px;
                          width: 20px;
                          height: 20px;
                          color: #fff;
                          text-align: center;
                          vertical-align: middle;
                          line-height: 20px;
                          background: #5f5f5f;
                          opacity: 0.8;
                          .border_radius(@br: 4px;);
                          .dis-in-bl;
                          z-index: 3;
                        }
                        .icon_finish {
                          bottom: 1px;
                          right: 6px;
                          z-index: 2;
                        }
                      }

                      .add_people_box {
                        .dis-in-bl;
                        position: relative;
                        margin: 0 5px;
                        .add_people {
                          .dis-in-bl;
                          width: 20px;
                          height: 20px;
                          text-align: center;
                          line-height: 20px;
                          .border_radius(@br: 2px;);
                          background: @bg-f2f2f2;
                          font-size: 12px;
                          color: #cdcdcd;
                          font-weight: bold;
                          &:hover {
                            color: @mainColor;
                          }
                        }
                        .add_people_show {
                          color: @mainColor;
                        }
                      }
                    }
                    // 日历
                    .calendar {
                      .el-date-editor {
                        width: 20px;
                        border: none;
                        input,
                        span {
                          display: none;
                        }
                      }
                      i {
                        color: #666666;
                      }
                    }
                  }
                  .finishHover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    z-index: 100;
                    background: #ffffff;
                    text-align: center;
                    display: none;
                    .el-button {
                      background: none;
                      border: none;
                      padding: 0;
                      line-height: 72px;
                      i {
                        color: #fff;
                        font-size: 14px;
                      }
                      .otherColor {
                        color: #666666;
                      }
                    }
                    .iconBg {
                      display: inline-block;
                      width: 24px;
                      height: 24px;
                      text-align: center;
                      line-height: 24px;
                      background: rgba(54, 132, 255, 1);
                      border-radius: 4px;
                    }
                  }
                  .closeHover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    z-index: 3;
                    background: #ffffff;
                    text-align: center;
                    display: none;
                    .el-button {
                      background: none;
                      border: none;
                      padding: 0;
                      line-height: 72px;
                      i {
                        color: #fff;
                        font-size: 14px;
                      }
                      .otherColor {
                        color: #666666;
                      }
                    }
                  }
                  .stageInfo {
                    position: absolute;
                    padding: 7px 0;
                    .box_sizing;
                    top: 10px;
                    display: inline-block;
                    height: 52px;
                    z-index: 2;
                    width: 100%;
                    text-align: center;

                    .participantImg {
                      height: 20px;
                      .img {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                        overflow: hidden;
                        margin: 0 4px;
                        img {
                          width: 20px;
                          height: 20px;
                        }
                      }
                    }
                    .participantMain {
                      color: #666666;
                      .pieChart {
                        display: block;
                        width: 100px;
                        height: 100px;
                        background: skyblue;
                        position: relative;
                        border-radius: 50%;
                        overflow: hidden;
                        .pie1 {
                          position: absolute;
                          left: 0px;
                          top: 0px;
                          display: block;
                          width: 200px;
                          height: 200px;
                          background: yellow;
                          transform: skewX(0deg);
                          // transform:rotate(deg);
                          transform-origin: 100% 100%; /*定义动画的旋转中心点*/
                        }
                        .pie2 {
                          position: absolute;
                          left: 50px;
                          top: 0px;
                          display: block;
                          width: 50px;
                          height: 50px;
                          background: pink;
                          transform: rotate(0deg);
                          transform-origin: 0 100%; /*定义动画的旋转中心点*/
                        }
                        .pie3 {
                          position: absolute;
                          left: 0px;
                          top: 50px;
                          display: block;
                          width: 50px;
                          height: 50px;
                          background: black;
                          transform: rotate(0deg);
                          transform-origin: 100% 100%; /*定义动画的旋转中心点*/
                        }
                        .pie4 {
                          position: absolute;
                          left: 0px;
                          top: 50px;
                          display: block;
                          width: 50px;
                          height: 50px;
                          background: slateblue;
                          transform: rotate(0deg);
                          transform-origin: 100% 100%; /*定义动画的旋转中心点*/
                        }

                        // #3684FF
                      }
                      .wrapper {
                        width: 300px;
                        height: 100px;
                        border: 2px dotted red;
                        margin: 30px auto;
                      }
                      .wrapper div {
                        width: 300px;
                        height: 100px;
                        line-height: 100px;
                        text-align: center;
                        color: #fff;
                        background: orange;
                        // -webkit-transform: skew(45deg);
                        // -moz-transform: skew(45deg)  ;
                        // transform: skew(45deg);
                      }

                      // .pieChart::before {
                      //   content: "";
                      //   display: block;
                      //   margin-left: 50%;
                      //   height: 100%;
                      //   background: yellowgreen;
                      //   border-radius: 0 100% 100% 0/50%;
                      //   transform-origin: left;
                      //   transform: rotate(108deg);
                      // }
                      @keyframes spin {
                        to {
                          transform: rotate(0.5turn);
                        }
                      }
                      @keyframes bg {
                        50% {
                          background: #655;
                        }
                      }
                      span {
                        font-size: 12px;
                      }
                      i {
                        font-size: 12px;
                      }
                    }
                  }
                }
                .stage:hover {
                  .stageHover {
                    position: absolute;
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    background: #ffffff;
                    border: 1px solid #c4c4c4;
                    z-index: 3;
                    display: block;
                    padding: 25px 35px;
                    .box_sizing;
                  }
                  .closeHover {
                    display: block;
                  }
                  .finishHover {
                    display: block;
                  }
                }
              }
              // 阶段定位后左侧padding
              .stageListsBoxFixed {
                padding-left: 253px;
              }
            }
            .stageBoxFixed {
              // 阶段（内容）样式
              // background: yellow;
              // position: fixed;
              padding-left: 112px;
            }
          }
          .defaultMainBox {
            display: flex;
            flex-direction: column;
            .defaultStage {
              display: flex;
              flex-direction: row;
            }
            .stage {
              width: 253px;
              height: 72px;
              border-right: 1px solid #eeeeee;
              border-bottom: 1px solid #eeeeee;
            }
          }
          // 折叠样式
          .thumbnailList {
            height: 72px;
            width: 100%;
            line-height: 72px;
            padding: 0 14px;
            .box_sizing;
            background: #fff;
            border-bottom: 1px solid #eeeeee;
            position: relative;
            .iconBox_ {
              position: absolute;
              height: 30px;
              line-height: 30px;
              left: 14px;
              opacity: 0;
              // top: 10px;
              .icon {
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                background: rgba(246, 250, 255, 1);
                border-radius: 4px;
                margin: 2px;
                i {
                  font-size: 12px;
                }
              }
            }
            .iconBox_:hover {
              opacity: 1;
            }
          }
        }
        // .
        // 任务阶段 左侧2 列表样式
        .partitionsLabel {
          display: block;
          width: 112px;
          min-height: 72px;
          background: #fff;
          border-right: 1px solid #eeeeee;
          border-left: 1px solid rgba(153, 153, 153, 0);
          border-top: 1px solid rgba(153, 153, 153, 0);
          border-bottom: 1px solid #eeeeee;
          .box_sizing;
          text-align: center;
          position: relative;
          .unfold {
            position: absolute;
            left: 14px;
            top: 50%;
            margin-top: -10px;
          }
          .box_sizing;
          .iconBox {
            position: absolute;
            display: none;
            top: 7px;
            left: 14px;
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              background: rgba(246, 250, 255, 1);
              border-radius: 4px;
              i {
                font-size: 12px;
              }
            }
          }
        }
        .partitionsLabel:hover {
          border: 1px solid #c4c4c4;
          .iconBox {
            display: block;
          }
        }
        // 任务阶段 定位样式
        .partitionsLabelFixed {
          z-index: 99;
          position: fixed;
        }
        .stageTittle {
          width: 55px;
          max-height: 57px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          position: absolute;
          right: 14px;
          top: 50%;
          margin-top: -10px;
          border: none;
          i {
            position: absolute;
          }
        }
      }
    }
  }
  .ghost_file {
    // 折叠样式
    .thumbnailList {
      background: rgba(255, 255, 255, 0.2) !important;
      border-bottom: 1px solid #3684ff !important;
    }
  }
  .drag_file {
    // background: pink !important;
    .thumbnailList {
      background: -webkit-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        #ffffff,
        #ffffff
      ) !important; /* Firefox 3.6 - 15 */
      background: linear-gradient(#ffffff, #ffffff) !important; /* 标准的语法 */
      border: 1px solid rgba(196, 196, 196, 1) !important;
      box-shadow: 1px 1px 14px 0px rgba(153, 153, 153, 1) !important;
      z-index: 99 !important;
    }
  }
}
</style>


