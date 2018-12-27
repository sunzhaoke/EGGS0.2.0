<template>
  <div class="project_task_details fl"
       id="taskDetails">

    <div v-if="this.taskId == 'new'"
         class="not_creator">
      <img src="../../../../assets/img/creatorTask.png"
           alt="">
      <p>请在左侧输入任务标题并点击创建按钮完成创建</p>
    </div>

    <div v-if="this.taskId !== 'new'"
         class="details_top">
      <button v-if="isFinish"
              class="button main_button_"
              @click="remarkFinish"></button>
      <button v-else
              class="button main_button"
              @click="remarkFinish">标记完成</button>
      <div class="but_state_manage dis-in-bl">
        <button class="button main_button"
                :class="stateManageFlag ? 'button_border' : ''"
                @click.stop="stateManageChange">状态管理</button>
        <el-collapse-transition>
          <state-manage v-if="stateManageFlag"
                        ref="stateManage"
                        id="stateManage"
                        :data="[]" />
        </el-collapse-transition>

      </div>
      <div class="operate fr">
        <i class="iconfont icon-fenxiang"></i>
        <el-dropdown class="more_operate"
                     trigger="hover"
                     @click.native.stop="taskCommand()">
          <i class="iconfont icon-gengduo"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="preTask"
                              @click.native="taskCommand('preTask')">设置前置任务</el-dropdown-item>
            <!-- <el-dropdown-item  command="preTask" @click.native="taskCommand('preTask')">{{pre ? '取消前置任务' : '设置前置任务'}}</el-dropdown-item> -->
            <el-dropdown-item command="log"
                              @click.native="taskCommand('log')">任务记录</el-dropdown-item>
            <el-dropdown-item command="delete"
                              @click.native="taskCommand('delete')">删除任务</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="iconfont icon-close"
           @click="closeDetails"></i>
      </div>
    </div>

    <div v-if="this.taskId !== 'new'"
         class="details">
      <!-- 任务标题 -->
      <div class="titles"
           id="titles">
        <div v-if="!titleFocusFlag"
             placeholder="请输入任务标题"
             class="titles_edit"
             contenteditable="false"
             @click="titleFocus"
             v-html="taskTitles"></div>
        <div v-else
             id="editTitles"
             :contenteditable="titleFocusFlag"
             placeholder="请输入任务标题"
             :class="titleFocusFlag ? 'titles_edit title_focus' : 'titles_edit'"
             @focus="titleFocus"
             @blur="titleBlur"
             @input="changeTitle"
             @keydown="titleEnter"
             v-html="taskTitleCopy"></div>
        <i v-if="taskStars"
           class="iconfont icon-star"
           @click="changeStar"></i>
      </div>

      <!-- 任务人员 -->
      <div class="task_people">
        <div class="top">
          <i class="iconfont icon-haoyou"></i>
          <span class="title">任务成员</span>
          <div class="unread fr"
               v-if="unreadNum > 0">
            <i class="iconfont icon-tongzhi1"
               :class="taskReminds ? 'unreads' : 'unread_dis'"
               @click.stop="unreadRemind"></i>
            <span class="unread_desc"
                  @click.stop="unreadRemind">{{'未读：' + unreadNum + '/' + taskPeopleNum}}</span>
            <el-collapse-transition>
              <Unread v-if="unreadShow"
                      id="unreadList"
                      :list="unreadList"
                      :reminding="taskReminds"
                      @handleRemind="putUnreadRemind" />
            </el-collapse-transition>

          </div>
        </div>
        <div class="creator">
          <span class="creator_title">创建者:</span>
          <el-tooltip class="item"
                      effect="dark"
                      :content="creatorName + (creatorJoin && creatorFinish ? '：已完成' : '')"
                      placement="top">
            <img class="creator_header header"
                 :src="creatorPic"
                 alt="">
          </el-tooltip>
          <span class="creator_name">{{creatorName}}</span>
          <el-checkbox class="creator_checked"
                       v-model="creatorJoin"
                       @change="creatorJoinChange"></el-checkbox>
          <span class="checkbox_name">参与任务</span>
          <span v-if="creatorJoin && creatorFinish"
                class="icon_finish iconfont icon-xuanzhong"></span>
        </div>
        <div class="people">
          <span class="people_title">参与者:</span>
          <div class="people_header"
               v-for="(item, index) in taskPeopleList"
               :key="item.userId"
               @mouseenter="peopleEnter(item)"
               @mouseleave="peopleLeave(item)">
            <img class="header"
                 :src="item.image"
                 alt="">
            <el-tooltip v-show="item.hovers"
                        class="item"
                        effect="dark"
                        :content="(item.nickname ? item.nickname : item.userName) + (item.finish ? '：已完成' : '')"
                        placement="top">
              <span class="del_peop iconfont icon-close"
                    @click="delPeople(item, index)"></span>
            </el-tooltip>
            <span v-if="item.finish"
                  class="icon_finish iconfont icon-xuanzhong"></span>

          </div>
          <div class="add_people_box">
            <i class="iconfont icon-jia1 add_people"
               :class="addPeopleShow ? 'add_people_show' : ''"
               @click.stop="addPeople"></i>
            <el-collapse-transition>
              <Participant v-if="addPeopleShow"
                           ref="addPeople"
                           id="addPeople"
                           :creatorId="creatorId"
                           :defaultKeys="defaultKeys"
                           :userList="userList"
                           @handleSure="addPeopleSure"
                           @handleInvite="invitePeople" />
            </el-collapse-transition>
          </div>
        </div>
      </div>

      <!-- 任务时间 -->
      <div class="task_time">
        <div class="top">
          <i class="iconfont icon-rili"></i>
          <span class="title">任务时间</span>
        </div>
        <el-date-picker class="start_time"
                        v-model="taskStartTime"
                        @focus="timeFocus($event, 1)"
                        @change="timeChange($event, 1)"
                        :picker-options="pickerOptions"
                        default-time="08:00:00"
                        format="yyyy-MM-dd HH:mm"
                        type="datetime"
                        placeholder="设置开始时间">
        </el-date-picker>
        <span class="time_center">--</span>
        <el-date-picker class="end_time"
                        v-model="taskEndTime"
                        @focus="timeFocus($event, 0)"
                        @change="timeChange($event, 0)"
                        :picker-options="pickerOptions"
                        default-time="19:00:00"
                        format="yyyy-MM-dd HH:mm"
                        type="datetime"
                        placeholder="设置截止时间">
        </el-date-picker>
        <button v-if="taskTimeState === 1"
                class="task_state task_state1">已完成</button>
        <button v-else-if="taskTimeState === 2"
                class="task_state task_state2">{{taskItem.countDown ? taskItem.countDown: taskTimeDate}}</button>
        <button v-else-if="taskTimeState === 3"
                class="task_state task_state3">{{taskTimeDate}}</button>
        <button v-else-if="taskTimeState === 4"
                class="task_state task_state4">{{taskTimeDate}}</button>
      </div>

      <!-- 任务描述 -->
      <div class="task_desc">
        <div class="top">
          <i class="iconfont icon-caidan"></i>
          <span class="title">任务描述</span>
        </div>
        <div id="taskDesc"
             contenteditable="true"
             :class="descBorder ? 'desc desc_border' : 'desc'"
             placeholder="请点击输入任务描述"
             @focus="descFocus"
             @blur="descBlur">{{taskDesc}}</div>
      </div>

      <!-- 需求文件 -->
      <div class="task_file">
        <div class="top">
          <i class="iconfont icon-fujian"></i>
          <span class="title">需求附件</span>
          <div class="right_operate fr">
            <span class="all_download"
                  v-if="demandFile.length"
                  @click="allDownload">
              <i class="iconfont icon-xiazai"></i>一键下载</span>
          </div>

        </div>
        <div class="file_content"
             v-if="demandFile.length">
          <div class="content_every fl"
               v-for="(item,index) in demandFile"
               :key="item.Pkid"
               @mouseenter="fileEnter(item)"
               @click="filePreview(demandFile,item,index)">
            <div class="content_every_left fl">
              <img :src="item.Urls ? item.Urls : item.Url"
                   alt=""
                   :class="item.FileTypeNum === 1 ? 'is_img' : 'not_img'">
              <el-tooltip v-if="item.IsCollection"
                          class="item item_is_collect"
                          effect="dark"
                          content="取消收藏"
                          placement="top">
                <i class="iconfont icon-shoucang2 is_collect"
                   @click.stop="demandCommand('collect')"></i>
              </el-tooltip>
              <el-tooltip v-else
                          class="item item_not_collect"
                          effect="dark"
                          content="点击收藏"
                          placement="top">
                <i class="iconfont icon-shoucang2 not_collect"
                   @click.stop="demandCommand('collect')"></i>
              </el-tooltip>
            </div>
            <div class="content_every_right fl">
              <span class="names">{{item.Title}}.{{item.FileType}}</span><br>
              <span class="froms">{{item.Uname}}</span>
            </div>
            <el-dropdown class="more_operate more_gengduo"
                         @command="demandCommand">
              <i class="iconfont icon-gengduo"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="download">
                  <a class="download_a"
                     :href="item.YimageUrl"
                     :download="item.Title+'.'+item.FileType">下载</a>
                </el-dropdown-item>
                <el-dropdown-item command="collect">{{item.IsCollection ? '取消收藏' : '收藏'}}</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
          <div class="content_every add_file fl"
               v-if="demandFile">
            <i class="iconfont icon-jia1"></i>
            <div class="hover_file">
              <el-upload ref="demandUpload"
                         class="from_local"
                         :action="'/File_Upload.ashx?&projectId='+projectItem.projectid+'&taskId='+taskId+'&userId='+userPkid+'&replyId=-1'"
                         :show-file-list="false"
                         :multiple="true"
                         :on-error="uploadError"
                         :on-success="uploadSuccess"
                         :on-progress="uploadProgress"
                         :limit="9"
                         :on-exceed="handleExceed"
                         :before-upload="beforeUpload">
                <i class="iconfont icon-shangchuan-"></i>
                <span class="upload_name">本地上传</span>
              </el-upload>
              <div class="from_collect">
                <i class="iconfont icon-wenjian1"></i>
                从收藏夹中选择
              </div>
            </div>
          </div>
        </div>

        <div class="bottom"
             v-else>
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
            <i class="iconfont icon-shangchuan-"></i>
            <span class="upload_name">本地上传</span>
          </el-upload>
          <div class="from_collect dis-in-bl">
            <i class="iconfont icon-wenjian1"></i>
            从收藏夹中选择
          </div>
        </div>
      </div>

      <!-- 回复内容 -->
      <div class="task_reply">
        <div class="top">
          <i class="iconfont icon-huifu"></i>
          <span class="title">回复内容</span>
        </div>
        <div v-if="replyList.length">
          <p class="empty">隐藏较早的工作内容</p>
          <div class="reply_list"
               v-for="(item, index) in replyList"
               :key="item.Pkid">
            <div class="top_operare">
              <div class="from_who">
                <img :src="item.Pic"
                     alt=""
                     class="header">
                <span v-if="index % 2 === 0"
                      class="unread_point"></span>
              </div>
              <div class="top_operare_right dis-in-bl">
                <span class="froms">{{item.UserName}}</span>
                <!-- <span class="times">{{item.CreateTime}}</span> -->
                <span class="times">今日 10: 30</span>
                <el-dropdown class="">
                  <span class="version cur">V1</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>v1</el-dropdown-item>
                    <el-dropdown-item>v2</el-dropdown-item>
                    <el-dropdown-item>v3</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="news_tips">
                  <i class="iconfont icon-pinglun"
                     @click="openJudge(item)"></i>
                  <span v-if="index % 2 === 0"
                        class="unread_point">{{replyList.length}}</span>
                </div>
                <!-- <i class="iconfont icon-shoucang2 is_collect"></i> -->

                <div class="right_operate fr">
                  <i class="iconfont icon-bianji"></i>
                  <i class="iconfont icon-pinglun"></i>
                  <!-- <i class="iconfont icon-shoucang2"></i> -->
                  <el-tooltip placement="top"
                              v-if="index % 2 === 0">
                    <div slot="content">版本更新：本条内容的回复时间较早，<br />请使用版本更新功能（更新内容的同时<br />保留历史版本）来代替覆盖编辑功能</div>
                    <i class="iconfont icon-banbengengxin"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="reply_content"
                 v-html="item.Content"></div>
            <div class="judge_list"
                 v-if="item.judgeExtend">
              <div class="top">
                <i class="iconfont icon-pinglun"></i>
                <span class="title">评论列表</span>
                <i class="iconfont icon-close fr"
                   @click="closeJudge(item)"></i>
              </div>
              <p class="empty">点击展开较早的
                <span>8</span>条评论/隐藏较早的动态</p>
              <div class="judge_content"
                   v-for="ele in item.judge"
                   :key="ele.Pkid">
                <img :src="ele.Pic"
                     alt=""
                     class="header">
                <div class="rights dis-in-bl">
                  <span class="names">{{ele.UserName}}</span>
                  <span class="time">昨天： 12: 11 :</span>
                  <!-- <span class="time">{{ele.CreateTime}}</span> -->
                  <span class="judge_text"
                        v-html="ele.Content"></span>
                  <span class="reply_judge">回复</span>
                </div>

              </div>

              <div class="judge_edit">
                <img src="../../../../assets/img/demo.jpg"
                     alt=""
                     class="header">
                <div class="judge_edit_right dis-in-bl">
                  <div contenteditable="true"
                       class="judge_edit_input"
                       placeholder="请输入您的评论"
                       :ref="item.ref"
                       @focus="judgeFocus($event, item.ref)"
                       @blur="judgeBlur($event, item.ref)"></div>
                  <div class="bottom_but"
                       :id="item.ref">
                    <button class="main_button_bg fr"
                            @click="publish">发布</button>
                    <button class="main_button_ fr"
                            @click="cancelPublish">取消</button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
        <p class="empty"
           v-else>暂无回复内容</p>
      </div>

      <!-- 文件汇总 -->
      <div class="task_doc_sum">
        <div class="top">
          <i class="iconfont icon-cunchu"></i>
          <span class="title">文件汇总</span>
          <div class="left_operate dis-in-bl">
            <i class="iconfont icon-fangda"
               @click="fileExtend"></i>
            <div class="left_operate_filter dis-in-bl"
                 @click="clickFilterType">
              <i class="iconfont icon-shaixuan"
                 :class="filterTypeShow ? 'selected_color' : ''"></i>
              <span class="now_filter cur"
                    v-if="nowFilterType">{{filterTypes[nowFilterType]}}
                <i class="iconfont icon-unfold"></i>
              </span>
              <div class="filter_types_list"
                   v-if="filterTypeShow"
                   id="filterTypesList">
                <span class="arrows"></span>
                <div class="add_a_box">
                  <div class="fl"
                       v-for="(ele, index) in filterTypes"
                       :key="index"
                       @click.stop="changeFilterType(index)">
                    <span :class="nowFilterType === index ? 'names selected_color' : 'names'">{{ele}}</span>
                    <span class="lines"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right_operate fr">
            <div v-if="batchOperateFlag"
                 class="batch_operate dis-in-bl">
              <span class="batch_selected">
                <el-checkbox v-model="batchSelectedAll"
                             @change="batchSelected">全选</el-checkbox>
              </span>
              <span class="batch_collect"
                    @click="batchCollect">
                <i class="iconfont icon-shoucang2"></i>收藏</span>
              <span class="batch_download"
                    @click="batchDownload">
                <i class="iconfont icon-xiazai"></i>下载</span>
            </div>
            <span v-if="!batchOperateFlag"
                  class="all_download"
                  @click="batchOperate">
              <i class="iconfont icon-piliangjiebang"></i>批量操作</span>
            <span v-else
                  class="all_download"
                  @click="batchOperate">
              <i class="iconfont icon-quxiao"></i>取消</span>
          </div>
        </div>

        <div class="file_content"
             v-if="fileSummaryList.length">
          <div class="content_every fl"
               v-for="(item,index) in demandFile"
               :key="item.Pkid"
               @mouseenter="fileEnter(item)"
               @click="filePreview(fileSummaryList,item,index)">
            <div class="content_every_left fl">
              <img :src="item.Urls ? item.Urls : item.Url"
                   alt=""
                   :class="item.FileTypeNum === 1 ? 'is_img' : 'not_img'">
              <el-tooltip v-if="item.IsCollection"
                          class="item item_is_collect"
                          effect="dark"
                          content="取消收藏"
                          placement="top">
                <i class="iconfont icon-shoucang2 is_collect"
                   @click.stop="demandCommand('collect')"></i>
              </el-tooltip>
              <el-tooltip v-else
                          class="item item_not_collect"
                          effect="dark"
                          content="点击收藏"
                          placement="top">
                <i class="iconfont icon-shoucang2 not_collect"
                   @click.stop="demandCommand('collect')"></i>
              </el-tooltip>
            </div>
            <div class="content_every_right fl">
              <span class="names">{{item.Title}}.{{item.FileType}}</span><br>
              <span class="froms">{{item.Uname}}</span>
            </div>
            <el-checkbox v-if="batchOperateFlag"
                         v-model="item.checked"
                         @change="fileSelected"
                         class="more_operate"></el-checkbox>
            <el-dropdown v-if="!batchOperateFlag"
                         class="more_operate more_gengduo"
                         @command="demandCommand">
              <i class="iconfont icon-gengduo"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="download">
                  <a class="download_a"
                     :href="item.YimageUrl"
                     :download="item.Title+'.'+item.FileType">下载</a>
                </el-dropdown-item>
                <el-dropdown-item command="collect">{{item.IsCollection ? '取消收藏' : '收藏'}}</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <p class="empty"
           v-else>暂无文件内容</p>
      </div>

      <!-- 任务记录 -->
      <div class="task_log"
           id="taskLog"
           v-if="logShow">
        <div class="top">
          <i class="iconfont icon-jilu"></i>
          <span class="title">任务记录</span>
        </div>
        <p class="empty">点击查看较早的
          <span class="mainColor">8</span>条记录</p>
        <div class="log_list"
             v-for="(log, index) in logList"
             :key="index">
          <div class="log_titles">
            <!-- 一级 -->
            <span class="log_times grayNight">{{log.createTime}}</span>

            <!-- 二级 -->
            <span class="log_userName">{{log.userName}}</span>

            <span v-if="log.type === 4"
                  class="log_dui grayNight">对</span>
            <span v-if="log.type === 4"
                  class="log_userName">{{log.userName2 ? log.userName2 : '祝建云'}}</span>

            <!-- 三级 -->
            <span v-if="log.type === 1"
                  class="log_type grayNight">创建了任务</span>
            <span v-if="log.type === 2"
                  class="log_type grayNight">加入了任务</span>
            <span v-if="log.type === 3"
                  class="log_type mainColor_text"
                  @click="clickLog(log)">上传了回复内容</span>
            <span v-if="log.type === 4"
                  class="log_type grayNight">进行评论</span>
            <span v-if="log.type === 5"
                  class="log_type grayNight">添加了</span>
            <span v-if="log.type === 6"
                  class="log_type grayNight">修改了</span>
            <span v-if="log.type === 7"
                  class="log_type mainColor_text"
                  @click="clickLog(log)">上传了需求文件</span>
            <span v-if="log.type === 8"
                  class="log_type grayNight">将TA的任务标记成已完成</span>
            <span v-if="log.type === 9"
                  class="log_type only_one">任务已经完成</span>
            <span v-if="log.type === 10"
                  class="log_type grayNight">修改了任务完成状态</span>
            <span v-if="log.type === 11"
                  class="log_type mainColor_text"
                  @click="clickLog(log)">编辑了回复内容</span>
            <span v-if="log.type === 12"
                  class="log_type">修改了回复内容的展示版本</span>
            <span v-if="log.type === 13"
                  class="log_type">更新了回复内容</span>
            <span v-if="log.type === 14"
                  class="log_type grayNight">任务创建者取消了TA的任务完成状态</span>

            <span v-if="log.type === 5 || log.type === 6"
                  class="log_active mainColor_text"
                  @click="clickLog(log)">{{log.type2Name ? log.type2Name : '任务时间'}}</span>
          </div>
          <transition name="fade">
            <div v-if="log.extend"
                 class="log_details">
              <p class="details_tit grayNight">修改前：</p>
              <p>{{log.frontContent}}</p>
              <p class="details_tit grayNight">修改后：</p>
              <p>{{log.backContent}}</p>
            </div>

          </transition>

        </div>

      </div>

      <!-- 编辑回复内容 -->
      <edit-reply ref="editReply"
                  :selectStaff="taskPeopleList"
                  :projectId="projectItem.projectid"
                  :taskId="taskId"
                  :userId="userPkid"
                  @handleReply="addRepplay"
                  @handleMouseEnter="filePreviewMin" />

    </div>

    <!-- 设置前置任务 -->
    <transition name="fade1">
      <set-pre v-if="setPreFlag"
               @handleCancel="setPreCancel" />
    </transition>

    <!-- 文件汇总谈窗框 -->
    <transition name="fade1">
      <file-summary v-if="summaryShow"
                    :file="fileSummaryListCopy"
                    @handleCancel="fileTakeUp" />
    </transition>

    <!-- 添加人员 -->
    <transition name="fade1">
      <add-people v-if="inviteShow"
                  :defaultTreeKeys="inviteDefaultKeys"
                  @handleCancel="cancelAddPeople" />
    </transition>

    <!-- 文件上传进度条 -->
    <upload-progress v-if="uploadProgressFlag"
                     :fileProgressList="fileProgressList"
                     @closeProgress="closeProgress"
                     @handleCancel="cancelUpload"
                     @handleRe="reUpload" />

    <!-- 温馨提示2_删除任务 -->
    <transition name="fade1">
      <Reminder2 v-if="reminder2Flag"
                 :type="1"
                 :text="reminderText"
                 @handleCancle="reminderCancel"
                 @handleSure="reminderSure" />
    </transition>

    <!-- 温馨提示2_删除协作人员 -->
    <transition name="fade1">
      <Reminder2 v-if="delPeopleFlag"
                 :type="1"
                 :text="reminderText"
                 @handleCancle="delPeopleCancel"
                 @handleSure="delPeopleSure" />
    </transition>

    <!-- 温馨提示2_删除文件 -->
    <transition name="fade1">
      <Reminder2 v-if="delFileFlag"
                 :type="1"
                 text="是否删除选中的文件，删除后无法恢复"
                 @handleCancle="delFileCancel"
                 @handleSure="delFileSure" />
    </transition>

    <!-- 鼠标经过文件时的缩略预览 -->
    <div class="pre_img_a"
         id="preview">
      <img class="icon_img"
           src="http://server.apexgame.cn/upload/file/20180917035852/97bc6665-c457-4ec6-b2ea-233926cc4010/b97cde35-b015-40d2-abf9-9c32adcb2c07.png"
           alt="">
      <span class="pre_name">7.png</span>
      <i fileid="4309"
         class="pre_del iconfont icon-delete fr">DEL</i>
      <i fileid="4309"
         class="pre_edit iconfont icon-bi fr">EDIT</i>
    </div>

    <!--文件预览-->
    <transition name="fade1">
      <div class="iframe"
           v-if="iframeFlag">
        <i class="close el-icon-error"
           @click="iframeFlag = false"></i>

        <iframe v-if="fileItem.FileTypeNum == 2 || fileItem.FileTypeNum == 3 || fileItem.FileTypeNum == 5 || fileItem.FileType == 'txt'"
                :src="fileItem.Url"
                width='90%'
                height='90%'
                frameborder='0'>
        </iframe>

        <div v-if="fileItem.FileTypeNum == 7 || fileItem.FileTypeNum == 8"
             class="iframe_div">
          <div class="iframe_title">{{fileItem.Title}}</div>
          <audio v-if="fileItem.FileTypeNum == 7"
                 :src="fileItem.Url"
                 controls="controls"
                 autoplay="autoplay"
                 preload="preload">亲 您的浏览器不支持html5的audio标签</audio>
          <video v-if="fileItem.FileTypeNum == 8"
                 :src="fileItem.Url"
                 controls="controls"
                 autoplay="autoplay"
                 preload="preload">亲 您的浏览器不支持html5的video标签</video>
        </div>
      </div>
    </transition>
    <c-pdf @closepdf="closepdf"
           v-if="isshowpdf"
           :pdfurl="fileItem.Url">
    </c-pdf>
    <!-- 预览 -->
    <transition name="fade1">
      <popup-Preview v-if="previewFlag"
                     @closepdf="closepdf"
                     :allFileLists='demandFile'
                     :taskId="taskId"
                     :personFilelist='personFilelist'
                     :clickIndex='clickIndex'
                     @previewClose='previewClose'>
      </popup-Preview>
    </transition>
  </div>
</template>
<script>
import StateManage from "./common/stateManage";
import Participant from "./common/participant";
import Unread from "./common/unread";
import SetPre from "./common/setPre";

import AddPeople from "../../common/addPeople";
import EditReply from "../../common/editReply";
import FileSummary from "../../common/fileSummary";

import Reminder2 from "../../../common/reminder2";
import UploadProgress from "../../../common/uploadProgress";
import popupPreview from '../../../common/popupPreview'

import { file, reply, log, details } from './data.js';
import { mapState, mapMutations } from 'vuex';
import { fail } from 'assert';

export default {
  components: {
    SetPre,
    Unread,
    Participant,
    StateManage,
    AddPeople,
    EditReply,
    FileSummary,
    UploadProgress,
    Reminder2,
    popupPreview
  },
  props: ["taskId"],
  computed: {
    ...mapState(['taskTitle', 'taskStar', 'taskRemind', 'taskItem', 'taskTimeState', 'taskTimeDate']),
    taskTitles: {
      get() {
        return this.taskTitle
      },
      set(val) {
        this.TASKTITLE_CHANGE(val);
      }
    },
    taskStars: {
      get() {
        return this.taskStar
      },
      set(val) {
        this.TASKSTAR_CHANGE(val);
      }
    },
    taskReminds: {
      get() {
        return this.taskRemind
      },
      set(val) {
        this.TASKSTAR_CHANGE(val);
      }
    },
    defaultKeys() {
      let arr = [];
      for (let x of this.taskPeopleList) {
        arr.push(x.userId);
      }
      // return [1, 2]
      return arr;
    }

  },

  data() {
    return {
      uploadProgressFlag: false,
      fileProgressList: [],
      fileTypeImg: [
        {
          src: require("../../../../assets/img/file_b/0.png")
        },
        {
          src: require("../../../../assets/img/file_b/0.png")
        },
        {
          src: require("../../../../assets/img/file_b/2.png")
        },
        {
          src: require("../../../../assets/img/file_b/3.png")
        },
        {
          src: require("../../../../assets/img/file_b/4.png")
        },
        {
          src: require("../../../../assets/img/file_b/5.png")
        },
        {
          src: require("../../../../assets/img/file_b/6.png")
        },
        {
          src: require("../../../../assets/img/file_b/7.png")
        },
        {
          src: require("../../../../assets/img/file_b/8.png")
        },
        {
          src: require("../../../../assets/img/file_b/9.png")
        },
        {
          src: require("../../../../assets/img/file_b/10.png")
        },
        {
          src: require("../../../../assets/img/file_b/11.png")
        }
      ],
      fileItem: null, // 文件预览对象,
      previewFlag: false,
      clickIndex: '',
      personFilelist: '',
      isshowpdf: '',
      iframeFlag: '',

      userPkid: JSON.parse(localStorage.getItem('staffInfo')).userPkid, // 当前登录者的ID
      projectItem: JSON.parse(localStorage.getItem('projectItem')), // 获取当前项目信息
      userList: [], // 项目人员列表
      creatorId: '', // 创建者ID
      creatorPic: '', // 创建者头像
      creatorName: '', // 创建者名字

      isFinish: false, // 是否标记完成
      isStar: false, // 是否标星
      pre: false, // 是否设置了前置任务
      taskTitleCopy: '', // 任务标题Copy
      creatorJoin: false, // 创建者是否参加任务
      creatorFinish: true, // 创建者是否完成任务
      titleFocusFlag: false, // 标题是否获取焦点
      taskPeopleList: [], // 参与者列表
      taskPeopleCopy: [], // 参与者列表copy
      unreadShow: false, // 是否展示未读人员列表
      unreadNum: 1, // 未读人数
      taskPeopleNum: 3, // 参与人员
      unreadList: [], // 未读人员列表
      isRemind: false, // 是否已经提醒过
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      defaulTime: '',
      taskStartTime: "", // 任务开始时间
      taskEndTime: "", // 任务结束时间
      taskDesc: '', // 任务描述
      taskDescCopy: '', // 任务描述copy
      descBorder: false, // 描述是否有边框
      inviteShow: false, // 邀请添加人员
      inviteDefaultKeys: [], // 目前的参与着的ID
      selectStaff: [
        { id: "001", name: "mark" },
        { id: "002", name: "jerry" },
        { id: "003", name: "tom" },
        { id: "004", name: "祝建云" },
        { id: "005", name: "赵珂" }
      ],
      demandFile: [], // 需求附件
      demandfileItem: '', // 现在选中的需求文件
      replyList: [...reply], // 回复内容列表
      fileSummaryList: [], // 文件汇总列表
      fileSummaryListCopy: [], // copy文件汇总列表
      summaryShow: false, // 是否展开文件汇总弹框
      filterTypeShow: false, // 是否显示筛选条件
      nowFilterType: 0, // 当前筛选的文件类型
      filterTypes: ["全部", "Word", "Excel", "Powerpoint", "PDF", "图片", "音频", "视频", "压缩包", "其他"], // 文件类型列表
      batchOperateFlag: false, // 是否点击了批量操作
      batchSelectedAll: false, // 是否全选
      clickFilterNum: 0, // 是否是第一次点击文件筛选图标
      logList: [...log], // 任务日志列表
      logShow: false,
      stateManageFlag: false, // 状态管理是否显示
      addPeopleShow: false, // 添加参与者是否显示
      reminder2Flag: false, // 温馨提示的弹框
      reminderText: '', // 温馨提示的文字
      setPreFlag: false, // 设置前置任务
      delPeopleFlag: false, // 删除协作人员温馨提示
      delPeopleIndex: 0, // 被删除协作人员的index
      delFileFlag: false, // 文件删除提示


    };
  },

  watch: {

  },

  methods: {
    ...mapMutations(['TASKTITLE_CHANGE', 'TASKSTAR_CHANGE', 'TASKREMIND_CHANGE', 'TASKTIME_CHANGE', 'TASKDELCHANGE']),

    // 关闭详情页面
    closeDetails() {
      this.$emit('handleDetails', 0);
    },

    // 点击改变当前选中的任务
    changeTask(id) {
      this.initShow();
      this.getDetails(id);
    },

    // 标记完成
    remarkFinish() {
      this.isFinish = !this.isFinish;
    },

    // 点击状态管理
    stateManageChange(obj) {
      this.stateManageFlag = true;
      let clickHide = e => {
        let ids = this.$refs.stateManage.computedNum();
        if (ids) {
          console.log('状态改变了', ids);
          // 发送请求
        } else {
          console.log('状态没改变', ids);

        }
        this.stateManageFlag = false; // 隐藏
        $(document).unbind("click", clickHide)

      };
      $(document).bind("click", clickHide)

    },


    // 任务的更多操作
    taskCommand(command) {
      if (!command) return;
      if (command === 'preTask') { // 设置前置任务
        console.log('设置前置任务');
        this.pre = !this.pre;
        this.setPreFlag = true;

      } else if (command === 'log') { // 任务记录
        console.log('任务记录');
        this.logShow = true;
        this.$nextTick(() => {
          $('#taskLog')[0].scrollIntoView({
            behavior: "smooth"
          });
        });

      } else if (command === 'delete') { // 删除
        console.log('删除');
        this.reminder2Flag = true;
        this.reminderText = "您是否确认删除该任务？删除后不可恢复";
      }
    },

    // 取消设置前置任务弹框
    setPreCancel() {
      this.setPreFlag = false;
    },


    // 任务删除的提示----确认删除
    reminderSure() {
      // 发送请求删除这项任务
      let obj = {
        taskId: this.taskId
      }
      this.$HTTP('post', '/task_del', obj).then(res => {
        this.closeDetails();
        this.reminder2Flag = false;
        this.TASKDELCHANGE();
        console.log('删除任务', res);
        this.$message.success('删除任务成功');
      }).catch(err => {
        console.log('删除任务失败', err);
        this.$message.error('删除任务失败，请检查网络');
      });
    },

    // 任务删除的提示----取消删除
    reminderCancel() {
      this.reminder2Flag = false;

    },

    // 标题获取焦点
    titleFocus() {
      this.titleFocusFlag = true;
      this.taskTitleCopy = this.taskTitle;
      this.$nextTick(() => {
        $('#editTitles').focus();
      });

    },

    // 标题失焦
    titleBlur() {
      if (!this.titleFocusFlag) {
        return;
      }
      this.titleFocusFlag = false;

      if (this.taskTitleCopy == this.taskTitles) {
        console.log('标题未改变，不用发送请求---');
      } else {
        // 发送请求
        console.log('标题改变，发起请求---', this.taskTitles);
        let obj = {
          taskId: this.taskItem.pkid,
          title: this.taskTitles
        }
        this.$HTTP('post', '/task_update_title', obj).then(res => {
          console.log('修改任务标题', res);
        }).catch(err => {
          console.log('修改任务标题失败', err);
        });
      }
    },

    // 改变标题
    changeTitle(e) {
      let val = $(e.target).text();
      this.TASKTITLE_CHANGE(val);

    },

    // 标题enter
    titleEnter(e) {
      if (e.keyCode === 13) {
        this.titleBlur();
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
      }
    },

    // 改变标星收藏
    changeStar() {
      this.isStar = false;
      this.TASKSTAR_CHANGE(this.isStar);

      // 发送请求
    },

    // 点击未读
    unreadRemind() {
      this.unreadShow = true;
      let clickHide = e => {
        this.unreadShow = false; // 隐藏
        $(document).unbind("click", clickHide)

      };
      $(document).bind("click", clickHide)
    },

    // 点击一键提醒
    putUnreadRemind() {
      this.unreadShow = false;
      this.TASKREMIND_CHANGE(this.unreadShow);
      console.log('一键提醒');
      // 发送请求

    },

    // 创建人是否参与任务
    creatorJoinChange() {
      let obj = {
        taskId: this.taskId,
        isJoin: this.creatorJoin
      }
      this.$HTTP('post', '/task_join', obj).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },

    // 鼠标移入参与者头像
    peopleEnter(item) {
      item.hovers = true;
      this.taskPeopleList = this.taskPeopleList.concat();
    },

    // 鼠标移出参与者头像
    peopleLeave(item) {
      item.hovers = false;
      this.taskPeopleList = this.taskPeopleList.concat();
    },

    // 点击删除人员
    delPeople(item, index) {
      this.delPeopleFlag = true;
      this.reminderText = '是否确认从任务中删除参与人：' + (item.nickname ? item.nickname : item.userName);
      this.delPeopleIndex = index;

    },
    // 取消删除人员
    delPeopleCancel() {
      this.delPeopleFlag = false;
    },
    // 确定删除人员
    delPeopleSure() {
      this.delPeopleFlag = false;
      // 发送请求
      let obj = {
        taskId: this.taskId,
        myUserId: this.userPkid,
        addUserList: '',
        dekUserList: this.taskPeopleList[this.delPeopleIndex].userId,
      }
      this.$HTTP('post', '/task_users_update', obj).then(res => {
        this.taskPeopleList.splice(this.delPeopleIndex, 1);
        console.log('任务删除人员', res, this.taskPeopleList);
      }).catch(err => {
        console.log('任务删除人员失败', err);
      });
    },

    // 点击添加人员
    async addPeople() {
      try {
        await this.getProjectUser();
        this.addPeopleShow = true;;
      } catch (err) {
        console.log(err);
      }
      let clickHide = e => {
        this.addPeopleShow = false; // 隐藏
        $(document).unbind("click", clickHide)

      };
      $(document).bind("click", clickHide)
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

    // 添加/删除人员成功
    addPeopleSure(data) {
      this.addPeopleShow = false; // 隐藏
      console.log('participant', data);
      // 发送请求
      if (data && (data.add || data.del)) {
        let add = [...data.add];
        let del = [...data.del];
        let obj = {
          taskId: this.taskId,
          myUserId: this.userPkid,
          addUserList: add.join(','),
          dekUserList: del.join(','),
        }
        this.$HTTP('post', '/task_users_update', obj).then(res => {
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
          this.taskPeopleList = this.taskPeopleList.concat(arr.taskUserList);

          console.log('任务添加人员', res, this.taskPeopleList);

        }).catch(err => {
          console.log('任务添加人员失败', err);
        });
        // 发送请求
      }
    },

    // 点击邀请好友
    invitePeople(ids) {
      this.addPeopleShow = false;
      this.inviteShow = true;
      this.inviteDefaultKeys = ids;

    },


    // 添加回复成功
    addRepplay(data) {
      let obj = {
        myUserId: this.userPkid,
        taskId: this.taskId,
        edition: 1,
        content: data.content,
        files: JSON.stringify(data.names),
        noticeIds: JSON.stringify(data.people)
      }
      this.$HTTP('post', '/reply_add', obj).then(res => {
        let html = res.result.content;
        // $('#test').html(html);
        console.log(res);
      }).catch(err => {
        console.log(err);
      });

    },

    // 时间插件获取焦点
    timeFocus(val, flag) {
      let _ = this;
      let dateStart = _.taskStartTime;
      let indexs = dateStart.indexOf(' ');
      dateStart = dateStart.slice(0, indexs);
      dateStart = dateStart + ' 00:00:00';
      dateStart = new Date(dateStart);
      let dateEnd = new Date(_.taskEndTime);
      // dateStart = dateStart.setDate(dateStart.getDate() - 1);
      dateStart = new Date(dateStart);

      if (flag) { // 修改开始时间
        if (_.taskEndTime) { // 已经设置了结束时间
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() > new Date(_.taskEndTime);
            }
          };
        } else { // 没有设置结束时间
          this.pickerOptions = {
            disabledDate(time) {
              return undefined;
            }
          };
        }

      } else { // 修改结束时间
        if (_.taskStartTime) { // 已经设置了开始时间
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() < dateStart;
            }
          };
        } else { // 没有设置开始时间
          this.pickerOptions = {
            disabledDate(time) {
              return undefined;
            }
          };
        }

      }
    },

    // 修改时间
    timeChange(val, flag) {
      if (flag) { // 修改开始时间
        if (
          new Date(val).getTime() >= new Date(this.taskEndTime).getTime()
        ) {
          this.$message.error("开始时间不能大于结束时间");
          // this.taskStartTime = this.taskStartTime;
          return;
        }
        this.taskStartTime = val ? this.format(val) : '';
        this.taskEndTime = this.taskEndTime ? this.taskEndTime : '';

      } else { // 修改结束时间
        if (
          new Date(val).getTime() <= new Date(this.taskStartTime).getTime()
        ) {
          this.$message.error("开始时间不能大于结束时间");
          // this.taskEndTime = this.taskEndTime;
          return;
        }
        this.taskStartTime = this.taskStartTime ? this.taskStartTime : '';
        this.taskEndTime = val ? this.format(val) : '';

        this.TASKTIME_CHANGE(this.taskEndTime);

      }

      let obj = {
        taskId: this.taskId,
        startTime: this.taskStartTime,
        endTime: this.taskEndTime
      }
      this.$HTTP('post', '/task_update_time', obj).then(res => {
        console.log('修改开始结束时间', res);

      }).catch(err => {
        console.log('修改开始结束时间失败', err);
      });
    },

    // 描述获取焦点
    descFocus() {
      this.descBorder = true;
      this.taskDescCopy = this.taskDesc;
    },

    // 描述失去焦点
    descBlur(val) {
      this.descBorder = false;
      this.taskDesc = $(val.target).text();
      $(val.target).text(this.taskDesc);
      if (this.taskDescCopy != this.taskDesc) {
        // 发送请求，任务描述发生变化
        let obj = {
          taskId: this.taskId,
          desc: this.taskDesc
        }
        this.$HTTP('post', '/task_update_desc', obj).then(res => {
          console.log('修改描述成功', res);
        }).catch(err => {
          console.log('修改描述失败', err);
        });
      }

    },

    // 鼠标引入需求文件
    fileEnter(item) {
      this.demandfileItem = item;
    },

    // 点击需求文件的收藏和取消收藏
    demandCommand(val) {
      if (val === 'download') { // 下载

      } else if (val === 'collect') { // 收藏/取消收藏
        this.demandfileItem.IsCollection = !this.demandfileItem.IsCollection;
      } else { // 删除
        this.delFileFlag = true;
      }
    },
    // 删除文件提示---取消
    delFileCancel() {
      this.delFileFlag = false;
    },
    // 删除文件提示---确定
    delFileSure() {
      this.delFileFlag = false;
      let obj = {
        fileIds: this.demandfileItem.Pkid
      }
      this.$HTTP('post', '/file_delete', obj).then(res => {
        console.log('文件删除', res);
        let i = this.demandFile.findIndex(ele => ele.Pkid == this.demandfileItem.Pkid);
        (i != -1) && (this.demandFile.splice(i, 1))
      }).catch(err => {
        console.log('文件删除失败', err);
        this.$message.error('文件删除失败，请检查网络');

      });
    },
    // 打开评价列表
    openJudge(item) {
      item.judgeExtend = true;
    },

    // 收回评价列表
    closeJudge(item) {
      item.judgeExtend = false;

    },

    // 评论发布
    publish() {

    },

    // 评论取消
    cancelPublish() {

    },

    // 评论获取焦点
    judgeFocus(e, ref) {
      let target = e.target;
      this.replayAnimate(1, target, ref);
    },

    // 评论失去焦点
    judgeBlur(e, ref) {
      let target = e.target;
      this.replayAnimate(0, target, ref);

    },

    // 点击展开文件汇总弹框
    fileExtend() {
      this.summaryShow = true;
    },


    // 收起文件汇总弹框
    fileTakeUp() {
      this.summaryShow = false;

    },

    // flag=true展开 flag=false收起
    replayAnimate(flag, target, ref) {
      let refs = "#" + ref;
      this.$nextTick(() => {
        if (flag) {
          $(refs).animate({ height: "34px" });
          $(target).animate({ height: "80px" });
        } else {
          $(refs).animate({ height: "0" });
          $(target).animate({ height: "30px" });
        }
      });
      $(target).text('');
      // this.quill.setText("");
      // this.replayText = "";
    },

    // 点击批量操作
    batchOperate() {
      this.batchOperateFlag = !this.batchOperateFlag;
    },


    // 点击全选按钮
    batchSelected(val) {
      this.batchSelectedAll = val;

      this.fileSummaryList.map(x => {
        return x.checked = val;
      });
    },

    // 点击每个文件的选择框
    fileSelected(val) {
      if (this.batchSelectedAll && !val) {
        this.batchSelectedAll = val;
        return;
      }
      let num = 0;
      for (let x of this.fileSummaryList) {
        if (x.checked === val) {
          num++;
        }
      }
      if (num === this.fileSummaryList.length) {
        this.batchSelectedAll = val;
      }
    },

    // 需求文件的一键下载
    allDownload() {

    },

    // 批量收藏
    batchCollect() {
      let collectList = [];
      for (let y of this.fileSummaryList) {
        if (y.checked && !y.IsCollection) {
          y.IsCollection = true
          collectList.push(y.Pkid);
        }
      }
      // collectList就是批量收藏的ID列表，然后向服务器发送请求


    },

    // 批量下载
    batchDownload() {
      let checkedList = this.getSelectedFile();
    },

    // 获取当前选中的文件
    getSelectedFile() {
      let checkedList = [];
      if (this.batchSelectedAll) {
        checkedList = this.fileSummaryList;
      } else {
        for (let x of this.fileSummaryList) {
          if (x.checked) {
            checkedList.push(x);
          }
        }
      }
      return checkedList;

    },

    // 点击文件筛选类型
    clickFilterType() {
      if (!this.clickFilterNum) { // 第一次点击
        this.fileSummaryListCopy = [...this.fileSummaryList];

      }

      this.clickFilterNum++;

      if (!this.filterTypeShow) {
        this.filterTypeShow = true;
        this.$nextTick(() => {
          this.animateFilter(true);
        });
      } else {
        this.animateFilter(false);
      }

    },


    // 改变文件汇总的文件筛选类型
    changeFilterType(index) {
      this.nowFilterType = index;
      let lists = this.getFilterList(index);
      this.fileSummaryList = lists;

      this.animateFilter(false);
    },

    // 文件汇总中的筛选元素的动画
    animateFilter(flag) {
      if (flag) {
        $('#filterTypesList').animate({ 'height': 65 });
      } else {
        $('#filterTypesList').animate({ 'height': 0 }, () => {
          this.filterTypeShow = false;
        });

      }
    },

    // 文件汇总中获取筛选的文件
    getFilterList(index) {
      // this.filterTypes[type]
      let copyList = [...this.fileSummaryListCopy];

      switch (index) {
        case 1:
          return copyList = copyList.filter(ele => {
            return ele.FileTypeNum === 2;
          });
          break;
        case 2:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 3;
          });
          break;
        case 3:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 5;
          });
          break;
        case 4:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 6;
          });
          break;
        case 5:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 1;
          });
          break;

        case 6:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 7;
          });
          break;
        case 7:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 8;
          });
          break;
        case 8:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 9;
          });
          break;
        case 9:
          return copyList.filter(ele => {
            return ele.FileTypeNum === 0;
          });
          break;

        default:
          return copyList;
      }
    },


    // 展开这点日志详情
    clickLog(log) {
      log.extend = !log.extend;
    },






    // 文件上传相关方法
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
    },

    // 取消上传
    cancelUpload(file) {
      this.getDelFile(file.uid, true);
      if (file.reUploadXhr) {
        file.reUploadXhr.abort();
      } else {
        this.$refs.demandUpload.abort(file);
      }

    },
    // 重新上传
    reUpload(file) {
      file.status = 1;
      file.reUploadXhr = 1;
      var formData = new FormData();
      formData.append('file', file.file);
      this.$refs.demandUpload.httpRequest = this.uploadFile(formData, file);

    },
    // 重新上传的请求
    uploadFile(formData, file) {
      let _ = this;
      file.reUploadXhr = $.ajax({
        url: `/File_Upload.ashx?&projectId=${this.projectItem.projectid}&taskId=${this.taskId}&userId=${this.userPkid}&replyId=-1`,
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


    // 文件上传失败
    uploadError(err, file) {
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].status = 3;
      }
    },


    // 文件处理
    handleFile(file) {
      for (let x of file) {
        this.$set(x, "FileTypeNum", this.getFlieTyle(x.FileType));
        this.$set(x, "checked", false);
        if (x.FileTypeNum !== 1) {
          // x.Url = this.fileTypeImg[x.FileTypeNum].src;
          x.Urls = this.fileTypeImg[x.FileTypeNum].src;
        }
      }
      return file;
    },

    // 鼠标移入 文件预览
    filePreviewMin(target) {
      if (target.attr('class') && target.attr('class') == 'u_file') {
        console.log('preview', target);
        let text = target.attr('filename');
        let id = target.attr('fileid');
        var X = target.offset().top;
        var Y = target.offset().left;
        $("#preview")
          .show()
          .css({ top: X + 24, left: Y });
      }
    },

    // 点击关闭pdf文件预览
    closepdf() {
      this.isshowpdf = false;
      this.iframeFlag = false;
    },
    // 文件预览页面关闭 
    previewClose() {
      this.previewFlag = false;
    },
    // 点击文件预览
    filePreview(file, item, index) {
      // console.log('hhahah', file, item, index)
      this.fileItem = JSON.parse(JSON.stringify(item));
      // 判断如果不支持预览 就不跳转预览页面
      this.clickIndex = index;
      this.previewFlag = true;
      this.personFilelist = item;
      if (
        item.FileTypeNum == 2 ||
        item.FileTypeNum == 3 ||
        item.FileTypeNum == 5
      ) {
        let url2 = encodeURIComponent('http://eggs.apexgame.cn/' + item.Url);
        this.fileItem.Url = "https://view.officeapps.live.com/op/view.aspx?src=" + url2;
        this.$nextTick(() => {
          this.iframeFlag = true;
        });
      }

      // 1.图片: 1
      // 2.pdf: 6
      // 3.可以用office online预览的文件: 2 3 5
      // 4.音频: 7
      // 5.视屏: 8
      // 6 txt
      // 不可预览的文件: 其他
      // 组件显示


    },


    // 删除文件时改变数组，触发父组件的方法
    getDelFile(fileid, cancel) {
      // fileProgressList
      let indexs1 = this.fileProgressList.findIndex(el => {
        return el.uid == fileid;
      });
      if (indexs1 !== -1) {
        if (cancel == undefined && this.fileProgressList[indexs1].progress < 100) {
          this.cancelUpload(this.fileProgressList[indexs1]);
        }
        this.fileProgressList.splice(indexs1, 1);
        if (!this.fileProgressList.length) {
          this.closeProgress();
        }
      }

    },

    // 获取详情
    getDetails(id) {
      // 根据id发送请求，获取数据
      if (id == 'new') { return }

      let obj = {
        taskId: id,
        myUserId: this.userPkid
      }
      this.$HTTP('post', '/task_get', obj, $('#taskDetails')[0]).then(res => {
        console.log('获取任务详情成功', res);
        obj = Object.assign({}, res.result);

        this.creatorId = obj.creatorId;
        this.creatorPic = obj.creatorPic;
        this.creatorName = obj.creatorName;
        this.creatorJoin = obj.isJoin;
        this.taskStartTime = obj.startTime.replace(/\//g, '-');
        this.taskEndTime = obj.endTime.replace(/\//g, '-');
        this.taskDesc = obj.description;
        $('#taskDesc').text(this.taskDesc);
        this.taskPeopleList = obj.userList;
        this.taskPeopleList.map(ele => {
          return (ele.finish = true) && (ele.hovers = false);
        });
        this.taskPeopleCopy = this.taskPeopleList.concat();

        let file1 = [...obj.aemandAttachment];
        this.demandFile = this.handleFile(file1);
        this.fileSummaryList = this.fileSummaryList.concat(this.demandFile);
        this.fileSummaryListCopy = this.fileSummaryList.concat();

        return;
        this.isStar = obj.isStar; // 是否标星
        this.pre = obj.pre; // 前置任务
        this.taskTitleCopy = obj.title;
        this.unreadNum = obj.unreadNum; // 未读人员
        this.isRemind = obj.isRemind; // 是否已经提醒过了

        this.fileSummaryList = obj.summaryFile;
        this.fileSummaryListCopy = obj.summaryFile;
        this.replyList = obj.replay;
        this.logList = obj.log;

      }).catch(err => {
        console.log('获取任务详情失败', err);
        this.$message.error('获取任务详情失败');
      });
      return;


      // let obj = Object.assign({}, details);
      // this.userPkid = obj.creatorId;
      // this.isStar = obj.isStar;
      // this.pre = obj.pre;
      // this.taskTitleCopy = obj.title;
      // this.taskPeopleList = obj.peoples;
      // this.unreadNum = obj.unreadNum;
      // this.taskStartTime = obj.startTime;
      // this.taskEndTime = obj.endTime;
      // this.taskDesc = obj.desc;
      // this.demandFile = obj.demandFile;
      // this.fileSummaryList = obj.summaryFile;
      // this.fileSummaryListCopy = obj.summaryFile;
      // this.replyList = obj.replay;
      // this.logList = obj.log;

    },

    // 获取项目成员列表
    getProjectUser() {
      return new Promise((resolve, reject) => {
        let obj = {
          projectId: this.projectItem.projectid,
          myUserId: this.userPkid
        }
        this.$HTTP('post', '/project_userlist_get', obj).then(res => {
          console.log('获取项目参与人员列表', res.result.userlist);
          this.userList = res.result.userlist;
          resolve(this.userList)
        }).catch(err => {
          console.log(err);
          reject(err);
        });
      });

    },

    testFile(id) {
      let obj = {
        taskId: id,
        replyId: 0
      }
      this.$HTTP('post', '/file_getlist', obj).then(res => {
        console.log('成功', res);

      }).catch(err => {
        console.log('err', err);
      });
    },

    // 切换任务时恢复状态
    initShow() {
      this.logShow = false;
      this.demandFile = [];
      this.fileSummaryList = [];
      this.fileSummaryListCopy = [];
      $('#titles')[0] && $('#titles')[0].scrollIntoView();
      this.$refs.editReply.cancelPublish();

    },


  },
  created() {
    // let arr = [
    //         {
    //           id: 1,
    //           name: 'hello.png'
    //         },
    //         {
    //           id: '002',
    //           name: '测试.txt'
    //         }
    //       ];

    //       let arr1 = [1, 3];
    //  let obj = {
    //       demo: JSON.stringify(arr1)
    //     }
    //     this.$HTTP('post', '/TestSz1', obj).then(res => {
    //       console.log('1111文件删除', res);
    //     }).catch(err => {
    //       console.log('11111文件删除失败', err);

    //     });
  },
  mounted() {


  }
};
</script>
<style lang="less">
@import "../../../../assets/css/base.less";
.project_task_details {
  width: 0;
  // @media screen and (max-width: 1366px) {
  //   width: 600px;

  // }
  // @media screen and (min-width: 1367px) {
  //   width: 780px;

  // }
  height: calc(~"100vh - 50px - 51px");
  border-left: 1px solid @bg-f2f2f2;
  .box_sizing;
  overflow: hidden;
  position: relative;

  .not_creator {
    img {
      margin: 0 auto;
      margin-top: 100px;
      display: block;
    }
    p {
      text-align: center;
      margin-top: 50px;
    }
  }

  .details_top {
    height: 53px;
    line-height: 53px;
    border-bottom: 1px solid @bg-f2f2f2;
    padding: 0 24px;
    .box_sizing;
    .iconfont {
      color: @graySix;
      margin-left: 20px;
      &:hover {
        color: @mainHover;
      }
    }

    .operate {
      height: 53px;
      overflow: hidden;
    }

    .main_button_ {
      .main_button_unfixed(#169a19, #169a19, #fff);
      &:before {
        content: "已完成";
      }
      &:hover {
        .main_button_unfixed(#EA3F33, #EA3F33, #fff);
        vertical-align: initial;
        width: 93px;
        text-align: center;
        padding: 0;
        &:before {
          content: "取消标记";
        }
      }
    }

    .button {
      vertical-align: initial;
      width: 93px;
      text-align: center;
      padding: 0;
      &:last-of-type {
        margin-left: 10px;
      }
    }

    .but_state_manage {
      position: relative;
    }
    .button_border {
      border-color: @mainColor;
    }
    .more_operate {
      height: 16px;
      width: 16px;
      margin-left: 20px;
      vertical-align: middle;
      position: relative;
      .icon-gengduo {
        height: 16px;
        width: 16px;
        .dis-in-bl;
        position: absolute;
        top: -20px;
        left: 0;
        margin-left: 0;
      }
    }
  }

  .details {
    width: 100%;
    height: calc(~"100vh - 50px - 51px - 54px - 50px");
    overflow-y: auto;
    padding: 0 24px;
    padding-bottom: 40px;
    .box_sizing;
    .titles {
      width: 100%;
      min-height: 40px;
      .titles_edit {
        .dis-in-bl;
        font-size: 16px;
        font-weight: bold;
        width: 94%;
        border: 1px solid transparent;
        margin-top: 8px;
        line-height: 24px;
        min-height: 32px;
        padding: 4px;
        overflow-y: auto;
        text-align: justify;
        outline: none;
        resize: none;
        .box_sizing;
        .border_radius(@br: 4px;);
        &:empty:before {
          content: attr(placeholder);
          color: @grayNight;
        }
      }

      .title_focus {
        border: 1px solid #d0d0d0;
      }

      .iconfont {
        margin-left: 10px;
        color: @starColor;
        .dis-in-bl;
        line-height: 46px;
        vertical-align: top;
      }
    }

    .top {
      width: 100%;
      margin: 10px 0;
      .iconfont {
        color: @graySix;
        font-size: 16px;
        vertical-align: middle;
      }

      .title {
        margin-left: 10px;
        font-weight: bold;
      }
    }

    .empty {
      color: @grayNight;
      margin-left: 30px;
    }

    .task_people {
      .unread {
        position: relative;
        .icon-tongzhi1 {
          padding: 0 10px;
        }
        .unreads {
          color: @mainColor;
        }
        .unread_dis {
          color: @grayNight;
        }

        .unread_desc {
          color: @graySix;
        }
      }
      .creator {
        padding-left: 30px;
        position: relative;
        .creator_title {
          color: @graySix;
        }

        .creator_header {
          margin: 0 5px;
        }

        .creator_checked {
          margin-left: 30px;
        }
        .checkbox_name {
          margin-left: 5px;
        }
        .icon_finish {
          bottom: 1px;
          left: 94px;
        }
      }

      .people {
        padding-left: 30px;
        margin-top: 10px;
        .people_title {
          color: @graySix;
        }

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

      .icon_finish {
        position: absolute;
        .dis-in-bl;
        width: 10px;
        height: 10px;
        text-align: center;
        line-height: 10px;
        font-size: 12px;
        background: #fff;
        .border_radius(@br: 50%);
        color: #32a635;
      }
    }
    .task_time {
      .time_center {
        padding-right: 10px;
      }

      .start_time {
        margin-left: 30px;
      }

      .start_time,
      .end_time {
        width: 170px;
        .el-input__inner {
          padding-right: 20px;
          text-align: center;
          &::placeholder {
            text-align: center;
          }
        }
      }

      .el-input__inner {
        border: none;
        padding-left: 0;
      }

      .el-input__prefix {
        display: none;
      }

      .task_state {
        font-size: 12px;
        padding: 0 !important;
        width: 90px;
        text-align: center;
        margin: 0 7px;
        .word_over;
        vertical-align: baseline !important;
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
    }
    .task_desc {
      .desc {
        line-height: 1.7;
        margin-left: 30px;
        width: calc(~"100% - 30px");
        min-height: 32px;
        padding: 4px;
        overflow-y: auto;
        text-align: justify;
        outline: none;
        resize: none;
        border: none;
        border: 1px solid #fff;
        .box_sizing;
        .border_radius(@br: 4px;);
        &:empty:before {
          content: attr(placeholder);
          color: @grayNight;
        }
      }
      .desc_border {
        border-color: #d0d0d0;
      }
    }
    .task_file,
    .task_doc_sum {
      width: 100%;

      .right_operate {
        .all_download {
          color: @graySix;
          .iconfont {
            font-size: 14px;
            margin: 0 4px;
          }
          &:hover {
            .cur;
            color: @mainColor;
            .iconfont {
              color: @mainColor;
            }
          }
        }
      }

      .file_content {
        width: 100%;
        padding-left: 30px;
        .box_sizing;
        overflow: hidden;

        // &:not(.add_file) {
        //   display: flex;
        //   display: -webkit-flex;
        //   justify-content:space-between;/*决定子元素两端对齐，均匀间隔*/
        //   flex-wrap: wrap;/*子元素超出换行，默认是不换行的，当子元素的宽由flex决定时会失效*/
        // }

        .content_every {
          width: 164px;
          height: 58px;
          background: #f6f6f6;
          .border_radius(@br: 4px;);
          margin-bottom: 14px;
          border: 1px solid #f6f6f6;
          position: relative;
          .box_sizing;
          .cur;
          @media screen and (max-width: 1600px) {
            &:nth-of-type(3n-1) {
              margin-left: 6px;
              margin-right: 6px;
            }
          }
          @media screen and (min-width: 1601px) {
            &:nth-of-type(4n-1) {
              margin-left: 9px;
              margin-right: 9px;
            }
            &:nth-of-type(4n-2) {
              margin-left: 9px;
            }
          }

          .content_every_left {
            width: 50px;
            height: 50px;
            position: relative;

            margin: 4px;
            img {
              .dis-in-bl;
              .border_radius(@br: 4px);
              background: #fff;
            }

            .not_img {
              width: 34px;
              height: 40px;
              margin: 5px 6px;
            }
            .is_img {
              width: 50px;
              height: 50px;
            }
            .item_is_collect,
            .item_not_collect {
              width: 16px;
              height: 16px;
              text-align: center;
              line-height: 17px;
              .border_radius(@br: 50%;);
              background: #fff;
              font-size: 12px;
              position: absolute;
              right: 1px;
              bottom: 1px;
            }
            .item_not_collect {
              display: none;
            }
            .is_collect {
              color: @starColor;
            }
            .not_collect {
              color: @graySix;
            }
          }

          .content_every_right {
            width: 95px;
            margin-top: 5px;
            .word_over;
            .names {
            }

            .froms {
              font-size: 12px;
            }
          }

          .more_operate {
            position: absolute;
            bottom: 2px;
            right: 10px;
            &:hover {
              color: @mainColor;
            }
          }
          .more_gengduo {
            display: none;
          }

          &:hover {
            border-color: @mainColor;
            .item_not_collect,
            .more_gengduo {
              display: inline-block;
            }
          }
        }
        .add_file {
          .hover_file {
            display: none;
            width: 164px;
            height: 58px;
            .border_radius(@br: 4px;);
            background: #626262;
            position: absolute;
            top: 0;
            left: 0;
            .from_local {
              width: 100%;
              height: 50%;
              border-bottom: 1px solid #7e7e7e;
              .box_sizing;
              color: #fff;
              line-height: 29px;
              padding-left: 24px;

              .el-upload {
                height: 100%;
                line-height: 29px;
              }
              &:hover {
                opacity: 0.7;
              }
            }

            .from_collect {
              width: 100%;
              height: 50%;
              color: #fff;
              line-height: 29px;
              padding-left: 24px;
              &:hover {
                opacity: 0.7;
              }
            }
          }
          .icon-jia1 {
            color: #cdcdcd;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -8px;
            margin-top: -8px;
          }

          &:hover {
            border: 0px solid #f6f6f6;
            .hover_file {
              display: block;
            }
          }
        }
      }

      .bottom {
        color: @grayNight;
        .cur;

        .from_local:hover,
        .from_collect:hover {
          color: @mainColor;
        }

        .iconfont {
          vertical-align: middle;
          margin-left: 30px;
          .cur;
        }
      }
    }
    .task_reply {
      width: 100%;
      .reply_list {
        width: 100%;
        padding: 10px 0 10px 30px;
        .box_sizing;

        .top_operare {
          height: 20px;
          line-height: 20px;
          .iconfont {
            vertical-align: middle;
            margin: 0 5px;
          }
          .top_operare_right {
            width: calc(~"100% - 40px");
          }
          .from_who {
            position: relative;
            width: 20px;
            height: 20px;
            .dis-in-bl;
            margin-right: 8px;

            img {
              vertical-align: middle;
            }

            .unread_point {
              position: absolute;
              top: -2px;
              right: -2px;
              .dis-in-bl;
              width: 6px;
              height: 6px;
              .border_radius(@br: 50%;);
              background: #e60012;
            }
          }
          .news_tips {
            height: 20px;
            width: 16px;
            position: relative;
            .dis-in-bl;
            margin: 0 5px;

            .iconfont {
              color: @mainColor;
              margin: 0;
            }
            .unread_point {
              position: absolute;
              top: -4px;
              right: -6px;
              .dis-in-bl;
              min-width: 14px;
              height: 14px;
              line-height: 14px;
              text-align: center;
              .border_radius(@br: 50%;);
              background: #e60012;
              color: #fff;
              font-size: 12px;
              padding: 1px;
            }
          }
          .is_collect {
            color: @starColor;
          }
          .version {
            color: @mainColor;
          }
          .right_operate {
            display: none;
            height: 20px;
            .iconfont:hover {
              color: @mainColor;
            }
          }
        }

        .reply_content {
          margin-top: 10px;
          margin-left: 30px;
          line-height: 1.7;

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

        .judge_list {
          background: @bg-f2f2f2;
          padding: 14px 14px 14px 10px;
          .box_sizing;

          .judge_content {
            margin-top: 10px;
            .judge_text {
              line-height: 1.7;
            }
            .reply_judge {
              color: @mainColor;
              .cur;
              &:hover {
                text-decoration: underline;
              }
            }
            img {
              vertical-align: top;
            }
            .rights {
              margin-left: 6px;
              .names {
              }
            }
          }

          .judge_edit {
            margin-top: 10px;
            .border_radius(@br: 4px;);
            .header {
              vertical-align: top !important;
              margin-top: 2px;
            }
            .judge_edit_right {
              background: #fff;
              width: calc(~"100% - 30px");

              .judge_edit_input {
                min-height: 30px;
                max-height: 90px;
                line-height: 1.7;
                padding: 2px 4px;
                .box_sizing;
                background: #fff;
                overflow-y: auto;
                text-align: justify;
                outline: none;
                resize: none;
                border: none;
                border: 1px solid #fff;
                .box_sizing;
                .border_radius(@br: 4px;);
                &:empty:before {
                  content: attr(placeholder);
                  color: @grayNight;
                }
              }

              .bottom_but {
                overflow: hidden;
                // display: none;
                // height: 34px;
                height: 0;
                margin-right: 10px;
                margin-top: 0px;
                .main_button_ {
                  .main_button_unfixed(@grayNight, #fff, #fff);
                }
              }
            }
          }
        }
        &:hover {
          background: #f6f6f6;
          .right_operate {
            display: block;
          }
        }
      }
    }
    .task_doc_sum {
      .top {
        .left_operate {
          color: @graySix;

          .icon-fangda {
            padding: 0 8px;
            &:hover {
              color: @mainColor;
            }
          }
          .left_operate_filter {
            padding: 0 8px;
            position: relative;
            z-index: 9;
            .selected_color {
              color: @mainColor;
            }
            .icon-shaixuan:hover {
              color: @mainColor;
            }

            .now_filter:hover {
              color: @mainColor;
              .icon-unfold {
                color: @mainColor;
              }
            }
            .filter_types_list {
              position: absolute;
              top: 26px;
              left: -20px;
              -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
              -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
              -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
              -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
              box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
              .border_radius(@br: 4px);
              background: #fff;
              width: 314px;
              height: 0;

              .add_a_box {
                height: 65px;
                padding: 5px 0;
                .box_sizing;
                z-index: 10;
                position: absolute;
                top: 0;
                left: 0;
                background: #fff;
                overflow: hidden;
                div:nth-of-type(4),
                div:nth-of-type(9) {
                  width: 80px !important;
                }
                div:nth-of-type(5),
                div:nth-of-type(10) {
                  .lines {
                    display: none;
                  }
                }
                div {
                  width: 58px;
                  text-align: center;
                  position: relative;
                  margin: 5px 0;
                  .cur;

                  .names {
                    color: @graySix;
                  }

                  .lines {
                    .dis-in-bl;
                    width: 1px;
                    height: 14px;
                    background: @bg-f2f2f2;
                    position: absolute;
                    right: 0;
                    top: 4px;
                  }

                  &:hover {
                    .names {
                      color: @mainColor;
                    }
                  }
                }
              }
              .arrows {
                position: absolute;
                top: -6px;
                left: 32px;
                z-index: 8;
                .dis-in-bl;
                width: 10px;
                height: 10px;
                background: #fff;
                -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
                -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
                -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
                -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
                box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
                transform: rotate(45deg);
                -ms-transform: rotate(45deg); /* Internet Explorer */
                -moz-transform: rotate(45deg); /* Firefox */
                -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
                -o-transform: rotate(45deg); /* Opera */
              }
            }
          }
        }

        .right_operate {
          color: @graySix;
          .iconfont {
            font-size: 14px;
            padding-left: 14px;
            padding-right: 4px;
          }
          .batch_selected {
            padding-left: 14px;
            .el-checkbox__label {
              padding-left: 4px;
            }
            &:hover {
              .el-checkbox__inner {
                border-color: @mainColor;
              }
              .el-checkbox__label {
                color: @mainColor;
              }
            }
          }
          .batch_collect,
          .batch_download {
            .cur;
            &:hover {
              color: @mainColor;
              .iconfont {
                color: @mainColor;
              }
            }
          }
        }
      }
    }
    .task_log {
      width: 100%;
      .log_list {
        width: 100%;
        padding-left: 30px;
        .box_sizing;

        .log_titles {
          width: 100%;
          line-height: 1.7;
          padding-top: 6px;
        }
        .log_details {
          background: @bg-f2f2f2;
          padding: 14px 23px;
          .box_sizing;
          p {
            line-height: 1.7;
            font-weight: 400;
          }
        }
      }

      .grayNight {
        color: @grayNight;
      }
    }
  }

  .pre_img_a {
    display: none;
    z-index: 100;
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

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: @mainColor;
    border: 1px solid @mainColor !important;
  }
  .el-checkbox__inner {
    border-color: @bg-f2f2f2 !important;
    &:hover {
      border-color: @mainColor !important;
    }
  }
}
</style>

