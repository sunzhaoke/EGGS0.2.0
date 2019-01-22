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

      <i class="iconfont  icon-star"
         :class="starFlag ? 'project_star' : ''"
         @click="projectStart"></i>
      <i class="iconfont icon-shuxingliebiaoxiangqing"
         @click="itemInformationShow=true"></i>

      <div class="fr otherButton">
        <i class="iconfont icon-19daoru"
           @click="toLead()"></i>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="iconfont icon-haoyou"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="searchUser">
              <i class="iconfont icon-sousuo"></i>
              <input type="text"
                     placeholder="搜索">
            </div>

            <div class="projectUserLists">
              <p class="projecttTitle">项目成员列表</p>
              <draggable v-model="userList"
                         @choose='userListChoose'
                         class="userlist"
                         :options="{
                                group:{name: 'article',pull:'clone'},
                                 dragClass: 'drag_userImg',
                                 }">
                <el-dropdown-item v-for="(list,index) in userList"
                                  :key="index"
                                  :data-pkid='list.userId'>
                  <img :src="list.userPic"
                       class="">
                  <span> {{list.nickName ||list.userName}}</span>
                </el-dropdown-item>
              </draggable>
              <div class="inviteButton cur">邀请好友</div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown @click.native.stop="parthCommand()">
          <span class="el-dropdown-link">
            <i class="iconfont icon-gengduo"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="projectItem.creater.createrId ==userPkid"
                              @click.native="parthCommand('editStage')">编辑阶段</el-dropdown-item>
            <el-dropdown-item v-else>
              <el-tooltip class="item"
                          effect="dark"
                          content="您没有权限"
                          placement="top-start">
                <el-button>编辑阶段</el-button>
              </el-tooltip>
            </el-dropdown-item>
            <el-dropdown-item @click.native="parthCommand('share')">分享</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="project_search fr">
        <el-input placeholder="请输入搜索的任务标题"
                  :clearable='false'
                  prefix-icon="el-icon-search"
                  size="small"
                  v-model="searchValue"
                  @input="searchChange">
        </el-input>
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
          <!-- 未分区 -->
          <div class="partitionsMain noPartitions"
               :data-partitionid='noPartitions.partitionId'>
            <transition name="fade">
              <div class="partitionsAndStages"
                   v-if="!noPartitions.autoExpand &&noPartitions.partitionId==0">
                <div ref='partitions'
                     class="partitionsLabel"
                     :class="{'partitionsLabelFixed':leftFixed}"
                     :style="'height:'+ ((noPartitions.taskList.length )* 72) +'px;'">
                  <span class="iconBox">
                    <el-tooltip class="item cur_dis"
                                effect="dark"
                                content="默认分区无法移动"
                                placement="top-start">
                      <span class="icon">
                        <i class="iconfont icon-pailie"></i>
                      </span>
                    </el-tooltip>
                    <el-tooltip class="item"
                                effect="dark"
                                content="添加"
                                placement="top-start">
                      <span class="icon"
                            @click="addPartition(noPartitions,0,'noPartitions')">
                        <i class="iconfont icon-jia1 cur"></i>
                      </span>
                    </el-tooltip>
                    <el-tooltip class="item cur_dis"
                                effect="dark"
                                content="默认分区无法删除"
                                placement="top-start">
                      <span class="icon cur_dis">
                        <i class="iconfont icon-delete cur"></i>
                      </span>
                    </el-tooltip>
                  </span>
                  <i class="iconfont cur unfold"
                     :class="!noPartitions.autoExpand?'icon-unfold':'icon-packup'"
                     @click="goFlod(noPartitions)"></i>
                  <div class="stageTittle">{{noPartitions.partitionTitle}}</div>
                </div>
                <!-- 空白占位 -->
                <draggable v-model="userList"
                           @choose='userListChoose'
                           class="userlist"
                           @remove='moveNopartitonTask(noPartitions,$event)'
                           :options="{
                                group:{name: 'file',pull:'clone'},
                                 dragClass: 'drag_userImg',
                                 }">
                  <li v-if="noPartitions.isBlank"
                      class="stageBox ">
                    <span class="stageLists">
                      <textarea class="stageName"
                                style="resize:none"
                                @keydown='checkEnter'
                                v-model="noPartitions.newStageName"
                                @blur="newStageBlur(noPartitions,noPartitions.newStageName)">
                      </textarea>
                    </span>
                    <div class="stageListsBox ">
                      <div v-for="(list,index) in newTask.stageTaskList"
                           :key="list.stageId"
                           class="stage">
                        <!-- {{list}} -->
                      </div>
                    </div>
                  </li>
                </draggable>

                <draggable v-model="noPartitions.taskList"
                           class="box"
                           @update="datadragEnd2(noPartitions,$event)"
                           @remove='moveNopartitonTask(element,$event)'
                           :options="{
                                 group: 'file', 
                                 ghostClass: 'ghost_file', 
                                 dragClass: 'drag_file',
                                 draggable: '.dragging',
                                 handle:'.moveStageHandel'
                                 }">
                  <transition-group class="taskLists"
                                    :data-partitionid='noPartitions.partitionId'>
                    <!-- 任务及阶段 -->
                    <li v-for="(item,index) in noPartitions.taskList"
                        v-if='item.taskId'
                        :key="item.taskId"
                        class="stageBox"
                        :data-taskid='item.taskId'
                        @mouseenter="mouseEnter(item,index)"
                        :class="{'stageBoxFixed':leftFixed,'dragging':item.taskId!==''}">
                      <span class="stageLists cur"
                            :class="{'leftTaskFixed':leftFixed,'hoverBg':mouseLeftIndex==item.taskId}">
                        <span class="iconBox_">
                          <el-tooltip class="item moveHandel"
                                      effect="dark"
                                      content="移动"
                                      placement="top-start">
                            <span class="icon moveStageHandel cur">
                              <i class="iconfont icon-pailie"></i>
                            </span>
                          </el-tooltip>
                          <el-tooltip class="item"
                                      effect="dark"
                                      content="添加"
                                      placement="top-start">
                            <span class="icon"
                                  @click.stop="addStage(noPartitions.taskList,index,'noPartitions',noPartitions)">
                              <i class="iconfont icon-jia1 cur"></i>
                            </span>
                          </el-tooltip>
                          <el-tooltip class="item"
                                      effect="dark"
                                      content="删除"
                                      placement="top-start">
                            <span class="icon"
                                  @click="delStage(item,noPartitions,index,'noPartitions')">
                              <i class="iconfont icon-delete cur"></i>
                            </span>
                          </el-tooltip>
                        </span>
                        <textarea v-model="item.taskTitle"
                                  class="stageName"
                                  style="resize:none"
                                  @keydown='checkEnter'
                                  @blur="stageNameBlur(item.taskTitle,item,noPartitions,index)">
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
                               v-if='lists.stageTaskState==true'>
                            <i class="iconfont icon-wancheng"></i>完成</div>
                          <!-- 3.开启状态 显示内容 -->
                          <!-- {{lists.enabled}} -->
                          <div class="stageInfo cur"
                               v-if="lists.enabled==''||lists.enabled==true">
                            <div class="participantImg">
                              <draggable :list="lists.userList"
                                         :class="{'red':!lists.isRepeat}"
                                         :options="{group:!lists.isRepeat?'article':'', disabled: false}">
                                <span class="img"
                                      v-for="(i,index) in lists.userList"
                                      :key="index"
                                      v-if="index<5">
                                  <img :src="i.userPic"
                                       alt="">
                                </span>
                                <span class="numsInfo"
                                      v-if="lists.userList.length > 5">+{{lists.userList.length-5}}人</span>
                              </draggable>
                            </div>
                            <div class="participantMain"
                                 :class="{'fontRed':lists.taskTime==0}">
                              <span class="pieChart"
                                    v-if="lists.taskTime==0"></span>
                              <svg viewBox="0 0 32 32"
                                   v-if='lists.taskTime'>
                                <circle r="16"
                                        cx="16"
                                        cy="16"
                                        :style='{"stroke-dasharray":lists.ratio + " 100"}' />
                              </svg>
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
                                                  :clearable='false'
                                                  @change="checkTime(item,lists,value6)"
                                                  range-separator="至"
                                                  start-placeholder="开始日期"
                                                  end-placeholder="结束日期">
                                  </el-date-picker>
                                </div>
                              </el-button>
                            </el-tooltip>
                            <div class="people ml-5">
                              <div class="add_people_box"
                                   @click.stop="addPeople(item,lists,index,noPartitions)">
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
                            <!-- 文件上传 -->
                            <el-dropdown placement="bottom">
                              <span class="el-dropdown-link">
                                <i class='iconfont icon-shangchuan'></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="handleClickUpload(item,lists,noPartitions,'noPartitions')">
                                  <el-upload ref="fileUpload"
                                             class="upload_file"
                                             :action="'/ProjectFile.ashx?&myUserId='+userPkid+'&projectId='+item.taskId+'&stageTaskId='+lists.stageTaskId+'&filePartitionId=0'"
                                             :show-file-list="false"
                                             :multiple="true"
                                             :on-error="uploadError"
                                             :on-success="uploadSuccess"
                                             :on-progress="uploadProgress"
                                             :limit="9"
                                             :on-exceed="handleExceed"
                                             :before-upload="beforeUpload">本地上传
                                  </el-upload>
                                </el-dropdown-item>
                                <el-dropdown-item>从个人文档上传</el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>

                            <el-tooltip class="item ml-5"
                                        effect="dark"
                                        v-if="lists.userList.length"
                                        content='已有内容无法关闭'
                                        placement="top-start">
                              <el-button>
                                <i class="iconfont icon-jinzhi otherColor "
                                   :class="{'cur_dis':lists.userList.length}"></i>
                              </el-button>
                            </el-tooltip>
                            <el-tooltip class="item ml-5"
                                        effect="dark"
                                        v-else
                                        content="关闭阶段"
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
                 v-if="noPartitions.autoExpand && noPartitions.partitionId==0">
              <div class="iconBox_">
                <el-tooltip class="item"
                            effect="dark"
                            :content="noPartitions.partitionId==0?'默认分区无法移动':'移动'"
                            placement="top-start">
                  <span class="icon moveHandel"
                        :class="{'cur_dis':noPartitions.partitionId==0}">
                    <i class="iconfont icon-pailie"
                       :class="{'cur_dis':noPartitions.partitionId==0 ,'cur':noPartitions.partitionId!==0}"></i>
                  </span>
                </el-tooltip>
                <el-tooltip class="item"
                            effect="dark"
                            content="添加"
                            placement="top-start">
                  <span class="icon"
                        @click.stop="addPartition(noPartitions,0,'noPartitions')">
                    <i class="iconfont icon-jia1 cur"></i>
                  </span>
                </el-tooltip>
                <el-tooltip class="item"
                            effect="dark"
                            :content="noPartitions.partitionId==0?'默认分区无法删除':'删除'"
                            placement="top-start">
                  <span class="icon"
                        @click.stop="openDelPartition(noPartitions,index)"
                        :class="{'cur_dis':noPartitions.partitionId==0}">
                    <i class="iconfont icon-delete cur"
                       :class="{'cur_dis':noPartitions.partitionId==0 ,'cur':noPartitions.partitionId!==0}"></i>
                  </span>
                </el-tooltip>
              </div>
              <li class="">
                <transition name="flodRotate">
                  <i class="iconfont"
                     :class="!noPartitions.autoExpand ? 'icon-unfold':'icon-packup'"
                     @click.stop="goFlod(noPartitions)"></i>
                </transition>
                <span>
                  {{noPartitions.partitionTitle}}
                </span>
              </li>
            </div>
          </div>

          <!-- ================================================================== -->

          <!-- 分区内容 -->
          <draggable v-model="partitionsList"
                     :move="getdata"
                     @update="datadragEnd"
                     @start='starDrag'
                     :options="{ghostClass: 'ghost_file', dragClass: 'drag_file',handle:'.moveHandel'}">
            <transition-group class="hhah">
              <div v-for="(element,index) in partitionsList"
                   :key="element.partitionId"
                   class="partitionsMain"
                   :data-partitionid='element.partitionId'
                   v-if=" element.partitionId!==0">
                <transition name="fade">
                  <div class="partitionsAndStages"
                       v-if="!element.autoExpand && element.partitionId!==0">
                    <div ref='partitions'
                         class="partitionsLabel"
                         style="heigth:100px;"
                         :class="{'partitionsLabelFixed':leftFixed}"
                         :style="'height:'+ ((element.taskList.length )* 72) +'px;'">
                      <span class="iconBox">
                        <!-- 移动分区 -->
                        <el-tooltip class="item"
                                    effect="dark"
                                    content="移动"
                                    placement="top-start">
                          <span class="icon moveHandel">
                            <i class="iconfont icon-pailie cur"></i>
                          </span>
                        </el-tooltip>
                        <!-- 添加分区 -->
                        <el-tooltip class="item"
                                    effect="dark"
                                    content="添加"
                                    placement="top-start">
                          <span class="icon"
                                @click.stop="addPartition(element,index,'addPartition')">
                            <i class="iconfont icon-jia1 cur"></i>
                          </span>
                        </el-tooltip>
                        <!-- 删除分区 -->
                        <el-tooltip class="item"
                                    effect="dark"
                                    :content="element.partitionUserId==userPkid ? '删除':'删除(您没有权限)'"
                                    placement="top-start">
                          <span class="icon"
                                v-if="element.partitionUserId==userPkid"
                                @click.stop="openDelPartition(element,index)">
                            <i class="iconfont icon-delete cur"></i>
                          </span>
                          <span class="icon"
                                v-else>
                            <i class="iconfont icon-delete cur"
                               :class="{'cur_dis':element.partitionUserId!==userPkid}"></i>
                          </span>
                        </el-tooltip>
                      </span>
                      <i class="iconfont cur unfold"
                         :class="!element.autoExpand?'icon-unfold':'icon-packup'"
                         @click="goFlod(element)"></i>
                      <div type="text"
                           class="stageTittle"
                           contenteditable="true"
                           v-html="element.partitionTitle"
                           @keydown='checkEnter'
                           ref="haha"
                           style="resize:none"
                           @blur="partitionBlur(element,index,element.partitionTitle)"
                           @focus="partitionFocus(element.partitionTitle,element,index)">1</div>
                      
                    </div>
                    <!-- 空白占位 -->
                    <span v-if="element.isBlank"
                          class="stageBox dragging">
                      <span class="stageLists">
                        <textarea class="stageName"
                                  style="resize:none"
                                  @keydown='checkEnter'
                                  v-model="element.newStageName"
                                  @blur="newStageBlur(element,element.newStageName)">
                        </textarea>
                      </span>
                      <div class="stageListsBox ">
                        <div v-for="(list,index) in newTask.stageTaskList"
                             :key="list.stageId"
                             class="stage">
                        </div>
                      </div>
                    </span>
                    <draggable v-model="element.taskList"
                               class="box"
                               @remove='moveNopartitonTask(element,$event)'
                               @update="datadragEnd2(element,$event)"
                               :options="{
                                 group: 'file', 
                                 ghostClass: 'ghost_file', 
                                 dragClass: 'drag_file',
                                 draggable: '.dragging',handle:'.moveStageHandel'
                                 }">
                      <transition-group class="taskListsTwo"
                                        :data-partitionId='element.partitionId'>
                        <!-- 任务及阶段 -->
                        <li v-for="(item,index) in element.taskList"
                            v-if='item.taskId'
                            :key="item.taskId"
                            class="stageBox"
                            :data-taskid='item.taskId'
                            @mouseenter="mouseEnter(item,index)"
                            :class="{'stageBoxFixed':leftFixed,'dragging':item.taskId!==''}">
                          <span class="stageLists cur"
                                :class="{'leftTaskFixed':leftFixed,'hoverBg':mouseLeftIndex==item.taskId}">
                            <span class="iconBox_">
                              <el-tooltip class="item moveHandel"
                                          effect="dark"
                                          content="移动"
                                          placement="top-start">
                                <span class="icon moveStageHandel cur">
                                  <i class="iconfont icon-pailie"></i>
                                </span>
                              </el-tooltip>

                              <el-tooltip class="item"
                                          effect="dark"
                                          content="添加"
                                          placement="top-start">
                                <span class="icon"
                                      @click="addStage(element.taskList,index,'Partitions',element)">
                                  <i class="iconfont icon-jia1 cur"></i>
                                </span>
                              </el-tooltip>
                              <el-tooltip class="item"
                                          effect="dark"
                                          content="删除"
                                          placement="top-start">
                                <span class="icon"
                                      @click="delStage(item,element,index,'Partitions')">
                                  <i class="iconfont icon-delete cur"></i>
                                </span>
                              </el-tooltip>
                            </span>
                            <textarea v-model="item.taskTitle"
                                      name='intro'
                                      class="stageName"
                                      style="resize:none"
                                      @keydown='checkEnter'
                                      @blur="stageNameBlur(item.taskTitle,item,element,index)"
                                      @focus="stageFocus(item.taskTitle,item,element,index)">
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
                                   v-if='lists.stageTaskState==true'>
                                <i class="iconfont icon-wancheng"></i>完成</div>
                              <!-- 3.开启状态 显示内容 -->
                              <!-- {{lists.stageTaskState}}任务是否完成 {{lists.enabled}}是否开启 -->
                              <div class="stageInfo cur"
                                   v-if="lists.enabled==true||lists.enabled==''">
                                <div class="participantImg">
                                  <draggable :list="lists.userList"
                                             :options="{group:{'article':lists.isRepeat}, disabled: false}">
                                    <span class="img"
                                          v-for="(i,index) in lists.userList"
                                          :key="index"
                                          v-if="index <5">
                                      <img :src="i.userPic"
                                           alt="">
                                      <span class="numsInfo"
                                            v-if="lists.userList.length>5">+{{lists.userList.length-5}}人</span>
                                    </span>
                                  </draggable>
                                </div>
                                <div class="participantMain"
                                     :class="{'fontRed':lists.taskTime==0}">
                                  <!-- {{lists.startTimeArr}}开始时间 -->
                                  <span class="pieChart"
                                        v-show="lists.taskTime==0"></span>
                                  <svg viewBox="0 0 32 32"
                                       v-show='lists.taskTime'>
                                    <circle r="16"
                                            cx="16"
                                            cy="16"
                                            :style='{"stroke-dasharray":lists.ratio + " 100"}' />
                                  </svg>
                                  <span v-for='(startime,index) of lists.startTimeArr'
                                        :class="{'redCl':!lists.taskTime}"
                                        :key="1+index">
                                    <span v-if="!startime.year==nowYear">{{startime.year}}/</span>
                                    <span> {{startime.month}}/{{startime.day}} {{startime.hour}}:{{startime.minute}} -</span>
                                  </span>
                                  <span v-for='(end,index) of lists.endTimeArr'
                                        :class="{'redCl':!lists.taskTime}"
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

                                <el-tooltip class="item ml-5"
                                            effect="dark"
                                            content="添加时间"
                                            placement="top-start">
                                  <el-button>
                                    <div class="calendar">
                                      <el-date-picker v-model="value6"
                                                      prefix-icon='iconfont icon-rili1'
                                                      type="datetimerange"
                                                      :clearable='false'
                                                      @change="checkTime(item,lists,value6)"
                                                      range-separator="至"
                                                      :start-placeholder="lists.startTime"
                                                      :end-placeholder="lists.endTime">
                                      </el-date-picker>
                                    </div>
                                  </el-button>
                                </el-tooltip>
                                <div class="people ml-5 ">
                                  <div class="add_people_box"
                                       @click.stop="addPeople(item,lists,index,element)">
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
                                <!-- 文件上传 -->
                                <el-dropdown placement="bottom">
                                  <span class="el-dropdown-link">
                                    <i class='iconfont icon-shangchuan'></i>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="handleClickUpload(item,lists,element,'partitions')">
                                      <el-upload ref="fileUpload"
                                                 class="upload_file"
                                                 :action="'/ProjectFile.ashx?&myUserId='+userPkid+'&projectId='+item.taskId+'&stageTaskId='+lists.stageTaskId+'&filePartitionId=0'"
                                                 :show-file-list="false"
                                                 :multiple="true"
                                                 :on-error="uploadError"
                                                 :on-success="uploadSuccess"
                                                 :on-progress="uploadProgress"
                                                 :limit="9"
                                                 :on-exceed="handleExceed"
                                                 :before-upload="beforeUpload">本地上传
                                      </el-upload>
                                    </el-dropdown-item>
                                    <el-dropdown-item>从个人文档上传</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>

                                <el-tooltip class="item ml-5"
                                            effect="dark"
                                            v-if="lists.userList.length"
                                            content='已有内容无法关闭'
                                            placement="top-start">
                                  <el-button>
                                    <i class="iconfont icon-jinzhi otherColor "
                                       :class="{'cur_dis':lists.userList.length}"></i>
                                  </el-button>
                                </el-tooltip>
                                <el-tooltip class="item ml-5"
                                            effect="dark"
                                            v-else
                                            content="关闭阶段"
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
                     v-if="element.autoExpand && element.partitionId!==0">
                  <div class="iconBox_">
                    <el-tooltip class="item "
                                effect="dark"
                                :content="element.partitionId==0?'默认分区无法移动':'移动'"
                                placement="top-start">
                      <span class="icon moveHandel"
                            :class="{'cur_dis':element.partitionId==0}">
                        <i class="iconfont icon-pailie"
                           :class="{'cur_dis':element.partitionId==0 ,'cur':element.partitionId!==0}"></i>
                      </span>
                    </el-tooltip>
                    <el-tooltip class="item"
                                effect="dark"
                                content="添加"
                                placement="top-start">
                      <span class="icon"
                            @click.stop="addPartition(element,index,'addPartition')">
                        <i class="iconfont icon-jia1 cur"></i>
                      </span>
                    </el-tooltip>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="element.partitionId==0?'默认分区无法删除':'删除'"
                                placement="top-start">
                      <span class="icon"
                            @click="openDelPartition(element,index)"
                            :class="{'cur_dis':element.partitionId==0}">
                        <i class="iconfont icon-delete cur"
                           :class="{'cur_dis':element.partitionId==0 ,'cur':element.partitionId!==0}"></i>
                      </span>
                    </el-tooltip>
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
        </div>
      </div>
    </div>
    <!-- <div class="guide">
      <img src="../../../assets" alt="">
    </div> -->
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
    <!-- 温馨提示2_删除文件的提示 -->
    <transition name="fade1">
      <Reminder2 v-if="delFileFlag"
                 :type="1"
                 :text="reminderText"
                 @handleCancle="delFileCancel"
                 @handleSure="delFileSure" />
    </transition>
    <!-- 文件上传进度条 -->
    <upload-progress v-if="uploadProgressFlag"
                     :fileProgressList="fileProgressList"
                     @closeProgress="closeProgress"
                     @handleCancel="cancelUpload"
                     @handleRe="reUpload" />
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Info from "../common/info";
import ShadePop from "../common/shadePop";
import ToLead from "./common/toLead";
import Participant from "../common/participant";
import UploadProgress from "../../common/uploadProgress";

import AddPeople from "../../common/addPeople";

import Reminder2 from "../../common/reminder2";
import draggable from "vuedraggable";
import { WSAESOCKTNOSUPPORT, POINT_CONVERSION_COMPRESSED } from 'constants';
import { setTimeout } from 'timers';

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
      abg: '10 100',
      mouseLeftIndex: -1,
      mouseTopIndex: -1,
      topAddPopShow: true, //顶部添加人员
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
          label: "Eggs0.1.1",
          userPkid: 11
        },
        {
          value: "选项2",
          label: "双皮奶",
          userPkid: 22

        },
      ],
      selectedProject: "选项1",
      starFlag: JSON.parse(localStorage.getItem('projectItem')).isStar,
      detailsShow: false,
      taskId: '',

      nowTaskId: '', //当前点击的 任务id
      nowStageId: '', //当前点击的 片段id
      nowPartitionId: '',//当前点击的 分区id
      searchValue: '',
      //  表格选项
      isFixed: false,
      leftFixed: false,
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 当前选择的项目
      loginUser: JSON.parse(localStorage.getItem('staffInfo')), // 当前登录者的信息
      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      stageList: [], //阶段设置
      partitionsList: [], // 所有内容列表
      noPartitions: [], //未分区列表
      // 新建分区
      EmptyData: '',
      // 添加任务
      newTask: '',
      delPartitionLists: [], //当前删除的分区
      delIndex: '', //当前删除的分区的index

      delStageLists: [], //当前删除的任务的集合 大
      delNowStageLists: [], //当前删除的任务
      delStageIndex: '', //当前删除的任务的index
      delFlage: '', //删除对象

      nowYear: '', //当前年
      userList: [], //项目参与人员列表
      addPeopleShow: false, // 添加参与者是否显示
      inviteShow: false, // 邀请添加人员

      defaultKeys: [], //默认添加的人员
      isNewP: false,// 是否是新建分区
      isNewS: false, // 是否是新建任务
      nowPartitionsName: '',// 当前选择分区的名字
      nowStageName: '',// 当前选择分区的名字
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
      blurTime: '', // 失去焦点时的时间
      // 文件上传

      uploadProgressFlag: false,
      fileProgressList: [],
      delFileFlag: false, // 删除文件的提示
      notGroupedList: [], // 未分组文件列表 
      fileNum: '',

      nowTime: '', //当前时间
      nowBlurTime: "",//当前失焦时间

      nowUploadId: [], //当前上传片段id集合
    };
  },
  watch: {
    noPartitions: {
      deep: true,
      handler(val, old) {
        if (!val.taskList.length) {
          val.isBlank = true;
        } else {
          val.isBlank = false;
        }
      }
    },
    partitionsList: {
      deep: true,
      handler(val, old) {
        for (let i of val) {
          if (!i.taskList.length) {
            i.isBlank = true;
          }
        }
      }
    }
  },
  computed: {
  }
  ,
  methods: {
    ...mapMutations(['DETAILS_CHANGE', 'TASKITEM_CHANGE', 'TASK_POSITION', 'PROJECT_CHANGE']),
    // 项目列表人员拖拽 放下

    userListChoose(evt) {
      let userId = evt.item.dataset.pkid;
      for (let list of this.noPartitions.taskList) {
        for (let i of list.stageTaskList) {
          for (let j of i.userList) {
            if (j.userId == userId) {
              i.isRepeat = true;
            } else {
              i.isRepeat = false;
              console.log(i)
            }
          }
        }
      }
      this.noPartitions.taskList = [...this.noPartitions.taskList];
    },

    // 获取项目成员列表
    getProjectUsers() {
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

    checkEnter(e) {
      var et = e || window.event;
      var keycode = et.charCode || et.keyCode;
      if (keycode == 13) {
        if (window.event) {
          $('.stageTittle').blur();
          $('.stageName').blur();
          window.event.returnValue = false;
        } else {
          $('.stageTittle').blur();
          $('.stageName').blur();
          e.preventDefault(); //for firefox
        }
      }
    },

    //项目星标
    projectStart() {
      this.starFlag = !this.starFlag;
      let obj = { 'projectId': this.projectId, 'userId': this.userPkid }
      this.$HTTP('post', '/project_update_isStar', obj).then(res => {
        // localStorage.setItem('projectItem', this.starFlag);
      })
    },

    // 上下分区判断位置
    mouseEnter(el, index) {
      this.mouseLeftIndex = el.taskId;
    },
    // 左右阶段 定位判断
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
      let obj = { 'addVale': this.userPkid, 'delVale': '', 'stageId': list.stageId, 'taskId': item.taskId, 'myUserId': this.userPkid, 'projectId': this.projectId }
      this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
        this.enterDetail(item, list);
      })
    },

    // 1.2.取消参与
    cancelPartIn(item, list) {
      console.log(list.userList, item);
      let index = list.userList.findIndex(res => {
        return res.userpkid == this.userPkid;
      })
      list.userList.splice(index, 1);
      this.partitionsList = [...this.partitionsList];
      list.isPartIn = false;
      let obj = { 'addVale': '', 'delVale': this.userPkid, 'stageId': list.stageId, 'taskId': item.taskId, 'myUserId': this.userPkid, 'projectId': this.projectId }
      this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
        console.log(res)
      })
    },

    // 3.修改任务时间
    checkTime(item, list, val) {
      let starttime = this.format(val[0], "yyyy-MM-dd HH:mm:ss").split(' ');
      let endTime = this.format(val[1], "yyyy-MM-dd HH:mm:ss").split(' ');
      let data = {
        'stageId': list.stageId,
        'taskId': item.taskId,
        'startTime': this.format(val[0], "yyyy-MM-dd HH:mm:ss"),
        'endTime': this.format(val[1], "yyyy-MM-dd HH:mm:ss"),
        'myUserId': this.userPkid
      };
      this.$HTTP('post', '/stageTask_date_update', data).then(res => {
        console.log(res)
        if (starttime && endTime) {
          starttime = starttime[0].split('-').concat(starttime[1].split(':'));
          endTime = endTime[0].split('-').concat(endTime[1].split(':'));
          list.startTimeArr = [{
            year: starttime[0].substring(2, 4),
            month: starttime[1],
            day: starttime[2],
            hour: starttime[3],
            minute: starttime[4]
          }];
          list.endTimeArr =
            [{
              year: endTime[0].substring(2, 4),
              month: endTime[1],
              day: endTime[2],
              hour: endTime[3],
              minute: endTime[4]
            }];
          if (new Date(list.endTime) - new Date() <= 0) {
            list.taskTime = 0;
          } else {
            console.log(3);
            let ratio = (new Date() - new Date(list.startTime)) / (new Date(list.endTime) - new Date(list.startTime));
            list.ratio = ratio * 100;
            list.taskTime = 1;
            console.log(1, list)
            console.log(1, this.partitionsList)
          }
        }
        list = JSON.parse(JSON.stringify(list));
        this.partitionsList = [...this.partitionsList];
        // this.partitionsList = JSON.parse(JSON.stringify(this.partitionsList));
      })

    },
    // 5.1关闭阶段
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
    // 5.2开启阶段
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
      return new Promise((resolve, reject) => {
        let obj = {
          projectId: this.projectId,
          myUserId: this.userPkid
        }
        this.$HTTP('post', '/project_usersList_get', obj).then(res => {
          this.userList = res.result;
          resolve(this.userList)
          if (this.taskPeopleList) {
            for (let x of this.taskPeopleList) {
              this.defaultKeys.push(x.userpkid);
            }
          }
          item.addPopShow = true;
          this.partitionsList = [...this.partitionsList];
        }).catch(err => {
          reject(err);
        });
      });
    },
    async addPeople(list, item, index, element) {
      let userlist = [];
      for (let i of item.userList) {
        userlist.push(i.userpkid);
      }
      this.defaultKeys = userlist;
      this.nowPartitionId = element.partitionId;
      this.nowTaskId = list.taskId;
      this.nowStageId = item.stageId;
      this.taskPeopleList = item.userList;


      try {
        await this.getProjectUser(item);
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
      // 发送请求
      if (data && (data.add || data.del)) {
        let add = [...data.add];
        let del = [...data.del];
        let obj = {
          'addVale': add.join(','),
          'delVale': del.join(','),
          'stageId': this.nowStageId,
          'taskId': this.nowTaskId,
          'myUserId': this.userPkid,
          'projectId': this.projectId
        }
        this.$HTTP('post', '/stageTask_user_update', obj).then(res => {
          // 发送请求，taskPeopleList发生变化
          let arr = res.result;
          for (let list of this.partitionsList) {
            if (list.partitionId == this.nowPartitionId) {
              for (let item of list.taskList) {
                if (item.taskId == this.nowTaskId) {
                  let index = item.stageTaskList.findIndex(res => {
                    return res.stageId == this.nowStageId;
                  })
                  item.stageTaskList[index].addPopShow = false;
                  item.stageTaskList[index].userList = arr.userList;
                }
              }
            }
            console.log(this.partitionsList, ' this.partitionsList')
            this.partitionsList = [...this.partitionsList]
          }
          console.log('任务添加人员', res);
        }).catch(err => {
          console.log('任务添加人员失败', err);
        });
        // 发送请求
      }
    },

    // ================================================================
    // 文件上传




    // ======================================================
    // 导入功能
    toLead() {
      console.log('hah')
      this.toLeadShow = true
    },
    // 关闭弹框 导入功能
    closePop() {
      this.popShow = false;
      this.toLeadShow = false;
      this.getstageList();
      this.getProjectAll();
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
    // 取消确认
    reminderCancel() {
      this.reminder2Flag = false;
    },
    //  确认
    reminderSure() {
      if (this.delFlage == 'stage') {
        console.log('fileNames 任务')
        this.okdelStage(this.delStageLists, this.delNowStageLists, this.delStageIndex);
      } else if (this.delFlage == 'project') {
        // 删除任务
        console.log('fileNames 分区')
        this.delPartition(this.delPartitionLists, this.delIndex);
      }
      // this.partitionsList.splice(index, 1);
    },
    // 新建任务光标离开
    newStageBlur(el, title) {
      if (!title) {
        return
      }
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
    // 搜索功能
    searchChange(val) {
      let data = { project: this.projectId, myUserId: this.userPkid, 'keys': val }
      this.$HTTP('post', '/project_get_info2', data).then(res => {
        console.log(res.result);
        // this.partitionsList = res.result;

      })
    },

    // 关闭
    closeInfo() {
      this.itemInformationShow = false;
    },

    // 未分区
    // 1.添加分区操作
    // el:大数组 index:位置 name:分区名字
    addPartition(el, index, name) {

      this.nowTime = new Date().getTime();
      if (this.nowTime - this.nowBlurTime >= 1000) {
        this.isNewP = true;
        this.EmptyData.partitionTitle = ' ';
        if (name == 'addPartition') {
          this.partitionsList.splice(index + 1, 0, this.EmptyData);
          this.EmptyData.partitionId = this.partitionsList.length + 1;
          this.$nextTick(res => {
 
            $('.hhah').children().eq(index).find('.stageTittle').focus();
          })
        } else {
          return
          this.partitionsList.splice(1, 0, this.EmptyData);
          this.EmptyData.partitionId = this.partitionsList.length + 1;
          this.$nextTick(res => {
            $('.hhah').children().eq(0).find('.stageTittle').focus();
          })
        }
      }
    },
    // 分区失去焦点 
    partitionBlur(el, index, name) {
      this.nowBlurTime = new Date().getTime();
      // 先判断 是否是新建项目
      if (this.isNewP) {
        if (name) {
          let obj = { 'myUserId': this.userPkid, 'projectId': this.projectId, title: name, 'iSort': index + 1 }
          this.$HTTP('post', '/partition_iSort_add', obj).then(res => {
            res.result.isBlank = true;
            res.result.isnew = false;
            this.isNewP = false;
            console.log(name)
            this.partitionsList.splice(index, 1, res.result);
          })
        } else {
            console.log('没有内容')
          
          this.isNewP = false;
          this.partitionsList.splice(index, 1);
        }
      } else {
        if (this.nowPartitionsName !== name) {
          this.modifyPartitionName(el.partitionId, name);
        }
      }
      // 判断 名字是否需要修改 
    },
    // 分区获取焦点
    partitionFocus(name, el, index) {
      // 1.判断是不是新创建的 
      // 2.新创建 走创建
      // 3.不是 保存原本值 、判断值改变
      if (!this.isNewP) {
        this.nowPartitionsName = name;
        // console.log(this.isNewP, '不是新创建的', nowStageName)
      } else {
        // console.log(this.isNewP, '新创建的')
      }
    },
    // 删除分区弹框打开
    openDelPartition(element, index) {
      this.delPartitionLists = element;
      this.delIndex = index;
      this.errMessage = '您确认删除该分区？删除后，分区内的任务将移入到未分区内';
      this.reminder2Flag = true;
      this.delFlage = 'project'; //删除对象
    },
    // 删除分区 操作
    delPartition(element, index) {
      // 判断如果有list列表
      if (!element.taskList.length) {
        this.partitionsList.splice(index, 1);
      } else {
        let taskIds = [];
        for (let list of element.taskList) {
          // taskId=='' 时 说明没有任务 可以直接删除 不用移动
          if (list.taskId !== '') {
            this.noPartitions.taskList.push(list);
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
    // 分区移动 start
    getdata(evt) {
      // console.log(evt.draggedContext.element.id)
    },
    // 分区移动 end
    datadragEnd(evt) {
      let obj = { partitionId: evt.item.dataset.partitionid, isSort: evt.newIndex }
      this.$HTTP('post', '/partition_update_isSort', obj).then(res => {
      })
      // console.log('拖动后的索引 :' + evt.newIndex)
    },

    // 分区 值改变
    stageChange(name, el, index) {
      console.log(name)
    },
    // 分区 修改名字
    modifyPartitionName(partitionId, title) {
      let data = { 'partitionId': partitionId, 'title': title }
      this.$HTTP('post', '/partition_update', data).then(res => {
        console.log(res)
      })
    },

    // 任务操作
    // 1.添加任务
    addStage(el, index, name, element) {
      let t = setTimeout(() => {
        let taskIndex = this.partitionsList.findIndex(res => {
          return res.partitionId == element.partitionId;
        })
        if (name == 'Partitions') {
          this.newTask.taskTitle = '';
          this.isNewS = true;
          el.splice(index + 1, 0, this.newTask);
          this.$nextTick(res => {
            $(".hhah").children().eq(taskIndex - 1).find('.stageName').eq(index + 1).focus();
          })
        } else {
          this.newTask.taskTitle = '';
          this.isNewS = true;
          el.splice(index + 1, 0, this.newTask);
          this.$nextTick(res => {
            $('.taskLists').children().eq(index + 1).find('.stageName').focus();
          })
        }
      }, 600);
    },
    // 添加任务 失焦判断
    stageNameBlur(name, item, el, index) {
      console.log(name, item, el, index);
      // 先判断 是否是新建阶段
      if (this.isNewS) {
        if (name) {
          let obj = {
            'myUserId': this.userPkid,
            'projectId': this.projectId,
            'partitionId': el.partitionId,
            'title': name,
            'iSort': index          }
          this.$HTTP('post', '/task_add', obj).then(res => {
            el.taskList.splice(index, 1, res.result);
            res.result.isnew = false;
            this.isNewS = false;
          })
        } else {
          this.isNewS = false;
          el.taskList.splice(index, 1);
        }
      } else {
        if (this.nowStageName !== name) {
          this.ModifyTaskName(item.taskId, name);
        }
        return
      }
    },
    // 添加任务 获取焦点
    stageFocus(name, item, el, index) {
      console.log(this.isNewS, name);
      if (!this.isNewS) {
        this.nowStageName = name;
      } else {
      }
    },
    // 修改任务名字
    ModifyTaskName(taskId, title) {
      let data = { 'taskId': taskId, 'title': title }
      this.$HTTP('post', '/task_update_title', data).then(res => {
        console.log(res)
      })
    },
    // 删除任务
    delStage(el, item, index, name) {
      console.log(index, '当前删除的任务的index')
      // 您确认删除该任务？
      // 删除后文件内容也会被删除
      this.delStageLists = item; //当前删除的任务
      this.delNowStageLists = el; //当前删除的任务
      this.delStageIndex = index; //当前删除的任务的index
      this.delFlage = 'stage'; //删除对象
      // console.log(this.delStageLists, this.delNowStageLists)
      // return
      this.reminder2Flag = true;
      this.errMessage = ' 您确认删除该任务？删除后文件内容也会被删除';
    },
    // 确认删除任务
    okdelStage(item, el, index) {

      let obj = { 'taskId': el.taskId };
      this.$HTTP('post', '/task_del', obj).then(res => {
        this.delFlage == '';
        this.reminder2Flag = false;
        item.taskList.splice(index, 1);
      })
    },

    starDrag() {
      for (let item of this.partitionsList) {
        item.autoExpand = true;
      }
    },

    goFlod(el) {
      el.autoExpand = !el.autoExpand;
      let obj = { 'myUserId': this.userPkid, 'projectId': this.projectId, 'partitionId': el.partitionId, 'isState': el.autoExpand }
      this.$HTTP('post', '/partition_operation', obj).then(res => {
      })
    },
    // 跨分区移动
    moveNopartitonTask(element, evt) {
      // console.log(element, evt.to.dataset.partitionid)
      let data = { 'taskId': evt.item.dataset.taskid, 'partitionId': evt.to.dataset.partitionid, 'isSort': evt.newIndex }
      this.$HTTP('post', '/task_group_update_isSort', data).then(res => {
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
    // 任务 任务移动
    datadragEnd2(elment, evt) {
      let data = { 'taskId': evt.item.dataset.taskid, 'partitionId': elment.partitionId, 'isSort': evt.newIndex }
      this.$HTTP('post', '/task_group_update_isSort', data).then(res => {
      })
    },
    // 获取阶段列表
    getstageList() {
      let data = { 'projectId': this.projectId, 'state': 1 };
      this.$HTTP('post', '/stage_list_get', data).then(res => {
        this.stageList = res.result;
        let newList = [];
        for (var i = 0; i < this.stageList.length; i++) {
          newList.push({ 'stageId': i });
        }
        this.EmptyData =
          {            'partitionId': -1, 'partitionTitle': '222', 'autoExpand': false, 'taskList': [
              { 'taskId': -1, 'stageTaskList': newList },
            ]          }

        this.newTask = { 'taskId': -1, 'stageTaskList': newList }
        console.log(this.stageList, this.newTask, '=================')
      })
    },
    // 获取项目所有列表
    getProjectAll() {
      let data = { project: this.projectId, 'myUserId': this.userPkid, 'keys': '' };
      this.$HTTP('post', '/project_get_info2', data).then(res => {
        this.partitionsList = res.result;
        for (let list of this.partitionsList) {
          list.isnew = false;
          if (list.taskList !== '') {
            for (let i of list.taskList) {
              i.isnews = false;
              if (i.taskId == '') {
                list.isBlank = true;
                list.taskList.splice(i, 1);
              }
              this.stageTaskList = i.stageTaskList;
              for (let item of i.stageTaskList) {
                item.addPopShow = false;
                item.isRepeat = false;
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
                //  0超期  1没超期 
                if (item.endTime) {
                  // 超期了
                  if (new Date(item.endTime) - new Date() <= 0) {
                    item.taskTime = 0;
                  } else {

                    item.taskTime = 1;
                    let ratio = (new Date() - new Date(item.startTime)) / (new Date(item.endTime) - new Date(item.startTime));
                    // console.log(ratio * 100)
                    item.ratio = ratio * 100;
                  }
                }

                if (item.startTime) {
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
              }
            }
          }
        }
        this.noPartitions = this.partitionsList[0];
      })
    },
    // 获取项目参与人员列表
    getProjectUserList() {
      let obj = {
        projectId: this.projectId,
        myUserId: this.userPkid
      }
      this.$HTTP('post', '/project_usersList_get', obj).then(res => {
        this.userList = res.result;
      })
    },


    // 文件上传--------------------------------start
    // 当前点击的是哪个分组的上传
    handleClickUpload(item, lists, element, name) {
      this.fileNum = lists.fileCont;
      this.filePartitionId = 0;
      console.log(lists)

      this.notGroupedList = lists.fileNames;
      console.log(this.notGroupedList)
      this.nowUploadId = { 'name': name, 'taskId': item.taskId, 'stage': lists.stageId, 'partitionId': element.partitionId };
    },
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
    },

    // 取消上传
    cancelUpload(file) {
      this.getDelFile(file.uid, true);
      if (file.error) { return; }
      if (file.reUploadXhr) {
        file.reUploadXhr.abort();
      } else {
        this.$nextTick(() => {
          if (Array.isArray(this.$refs.fileUpload)) {
            this.$refs.fileUpload[0].abort(file);
          } else {
            this.$refs.fileUpload.abort(file);
          }
        });
      }
    },
    // 重新上传
    reUpload(file) {
      file.status = 1;
      file.reUploadXhr = 1;
      var formData = new FormData();
      formData.append('file', file.file);
      this.$nextTick(() => {
        if (Array.isArray(this.$refs.fileUpload)) {
          this.$refs.fileUpload[0].httpRequest = this.uploadFile(formData, file);
        } else {
          this.$refs.fileUpload.httpRequest = this.uploadFile(formData, file);
        }
      });

    },
    // 重新上传的请求
    uploadFile(formData, file) {
      let _ = this;
      file.reUploadXhr = $.ajax({
        url: `/ProjectFile.ashx?&myUserId${this.userId}&projectId=${this.projectId}&stageTaskId=${this.stageTaskId}&filePartitionId=0}`,
        type: "post",
        dataType: "json",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        xhr: function (e) {
          let uploadXhr = $.ajaxSettings.xhr();
          if (uploadXhr.upload) { // check if upload property exists 
            uploadXhr.upload.addEventListener('progress', function (e) {
              let loaded = e.loaded;//已经上传大小情况
              let tot = e.total;//附件总大小
              let per = Math.floor(100 * loaded / tot);  //已经上传的百分比
              _.uploadProgress({ percent: per }, file);
            }, false); // for handling the progress of the upload

          }
          return uploadXhr;
        }, success(data) {
          _.uploadSuccess(data, file);
        }, error(err) {
          _.uploadError('err', file);
          if (file.reUploadXhr) {
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
    // 文件上传前
    beforeUpload(file) {
      const id = this.filePartitionId;
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
      console.log(file, 'file')
      // 判重--该目录下已包含同名文件
      if (this.notGroupedList) {
        let index = this.notGroupedList.findIndex(ele => {
          return ele == file.name;
        });
        if (index !== -1) {
          this.$set(obj, 'error', 1);
          this.fileProgressList.unshift(obj);
          this.$message.error("该目录下已含有同名文件");
          return false;
        }
      }


      // 文件过大--文件大于1G，无法上传
      const _size = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      if (_size >= 1) {
        this.$set(obj, 'error', 2);
        this.fileProgressList.unshift(obj);
        this.$message.error("文件大于1G，无法上传");
        return false;
      }
      this.fileProgressList.unshift(obj);
      console.log(this.fileProgressList, 'this.fileProgressList')
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
        if (
          !this.fileProgressList[ids].imgUrl &&
          this.fileProgressList[ids].FileTypeNum == 1
        ) {
          this.fileProgressList[ids].imgUrl = file.url;
        }
      }
      console.log(this.fileProgressList)
    },

    // 文件上传成功
    uploadSuccess(res, _file) {
      this.fileNum++;

      if (this.nowUploadId.name == 'noPartitions') {
        let index = this.noPartitions.taskList.findIndex(res => {
          return res.taskId == this.nowUploadId.taskId;
        })
        for (let list of this.noPartitions.taskList[index].stageTaskList) {
          if (list.stageId == this.nowUploadId.stage) {
            list.fileCont = this.fileNum;
          }
        }
        // this.noPartitions = [...this.noPartitions];
      } else {
        for (let list of this.partitionsList) {
          if (list.partitionId == this.nowUploadId.partitionId) {
            for (let item of list.taskList) {
              if (item.taskId == this.nowUploadId.taskId) {
                for (let i of item.stageTaskList) {
                  if (i.stageId == this.nowUploadId.stage) {
                    i.fileCont = this.fileNum;
                  }
                }
              }
            }
          }
        }
      }

      // console.log(res)
      console.log('2chengogng', this.fileNum);

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

    // 删除文件时改变数组，触发父组件的方法
    getDelFile(fileid, cancel) {
      // fileProgressList
      let indexs1 = this.fileProgressList.findIndex(el => {
        return el.uid == fileid;
      });
      if (indexs1 !== -1) {
        if (
          cancel == undefined &&
          this.fileProgressList[indexs1].progress < 100
        ) {
          this.cancelUpload(this.fileProgressList[indexs1]);
        }
        this.fileProgressList.splice(indexs1, 1);
        if (!this.fileProgressList.length) {
          this.closeProgress();
        }
      }
    },


    // 文件上传--------------------------------end
  },
  created() {
    let nowTime = new Date();
    this.nowYear = String(new Date().getFullYear()).slice(2, 4);
    // console.log
    this.getstageList(); //获取阶段列表 
    this.getProjectAll();
    this.getProjectUserList();
  },
  mounted() {
    let _ = this;
    $('.tableBox')[0].addEventListener('scroll', _.handleScroll);
    var $textarea = $('textarea[name=intro]');

    var html = $textarea.val();

    $textarea.val($(html).text());
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
.drag_userImg {
  img {
    width: 18px;
    height: 18px;
  }
}
// 引导页面
.guide {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.ml-5 {
  margin-left: 5px !important;
}
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
.el-popper {
  padding: 0;
  .searchUser {
    width: 100%;
    height: 35px;
    line-height: 35px;
    padding-left: 15px;
    .box_sizing;
  }
  .projectUserLists {
    border-top: 1px solid #e5e5e5;

    .projecttTitle {
      line-height: 30px;
      margin-left: 15px;
      font-weight: bold;
    }
    .userlist {
      padding: 10px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    img {
      width: 18px;
      height: 18px;
      border-radius: 2px;
      vertical-align: middle;
    }
    .el-dropdown-menu__item {
      padding: 0 15px;
    }
  }
  .inviteButton {
    line-height: 50px;
    margin-left: 14px;
    color: #3684ff;
  }
}
// 拖拽项目人员列表

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
  .icon-unfold {
    font-size: 12px !important;
  }
  .icon-packup {
    font-size: 12px !important;
  }
  .project_task_top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @bg-f2f2f2;
    padding: 0 25px;
    .box_sizing;
    .add_people_box {
      position: relative;
      top: 20px;
    }
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

    .otherButton {
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
      margin-left: 10px;

      .add_people_box {
        position: relative;
      }
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
                  height: 50%;
                  width: 100px;
                  border: none;
                  margin-top: 22px;
                  .box_sizing;
                  overflow: hidden;
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
                position: relative;
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
                  // position: relative;
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
                    padding: 15px 35px;
                    display: none;
                    .box_sizing;
                    i {
                      font-size: 14px !important;
                    }
                    .el-button {
                      border: none !important;
                      background: none;
                      padding: 0 !important;
                      i {
                        color: #fff;
                        font-size: 14px;
                      }
                      .otherColor {
                        color: #666666;
                      }
                      .calendar {
                        width: 14px;
                        .el-date-editor {
                          width: 14px;
                        }
                      }
                    }

                    .el-button:focus,
                    .el-button:hover {
                      color: red !important;
                      background-color: #ffffff !important;
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
                      border: none !important;
                      background: none;
                      padding: 0 !important;
                      line-height: 72px;
                      i {
                        color: #fff;
                        font-size: 14px;
                      }
                      .otherColor {
                        color: #666666;
                      }
                    }
                    .el-button:hover {
                      border: none !important;
                      background: none;
                      padding: 0 !important;
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
                      line-height: 72px;
                      border: none;
                      padding: 0;
                      background: none;
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
                    .box_sizing;
                    display: inline-block;
                    height: 72px;
                    z-index: 2;
                    width: 100%;
                    text-align: center;
                    .participantImg {
                      max-width: 155px;
                      height: 20px;
                      margin: 17px auto;
                      position: relative;
                      .numsInfo {
                        position: absolute;
                        top: 0;
                        right: -20px;
                        color: #999999;
                      }
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
                      .red {
                        // background: red;
                      }
                    }
                    .participantMain {
                      position: absolute;
                      bottom: 15px;
                      width: 100%;
                      // margin: 0 auto;
                      color: #666666;
                      // 饼状图样式
                      svg {
                        width: 10px;
                        height: 10px;
                        transform: rotate(-90deg);
                        border-radius: 50%;
                      }
                      circle {
                        fill: #eeeeee;
                        stroke: #3684ff;
                        stroke-width: 32;
                        // stroke-dasharray: 38 100; /* for 38% */
                      }
                      .redCl {
                        color: red;
                      }
                      .pieChart {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        background: red;
                        position: relative;
                        border-radius: 50%;
                        overflow: hidden;
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
                      }
                      span {
                        font-size: 12px;
                      }
                      i {
                        font-size: 12px;
                      }
                    }
                    .fontRed {
                      color: red;
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
                    padding: 15px 35px;
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
            margin-top: -5px;
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
          min-width: 1px;
          width: 56px;
          max-height: 50%;
          position: absolute;
          top: calc(50% + 4px);
          left: calc(50% + 7px);
          transform: translate(-50%, -50%);
          border: none;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: inline-block;
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
    background: pink !important;
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


