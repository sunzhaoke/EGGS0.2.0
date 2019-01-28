<template>
    <div class='task_detail_yun'>
      <!-- 头部阶段 -->
      <div class="detail_top">
          <!-- <el-tooltip v-if='!demandCount' effect="dark" content="返回列表" placement="top" :open-delay="300"> -->
            <div class="project_name" @click='returnProject'>{{projectItem.title}}</div>
          <!-- </el-tooltip> -->

          <!-- state=1(一开启) state=2(一完成) state=3(一未开始) state=4(一进行中) state=5(一已超时) state=6(一已关闭)  -->
          <div class="stage_list">
            <el-tabs v-model="stageId" @tab-click="taskStageDetail(taskId, stageId)">
              <el-tab-pane 
                v-for='stage in stageList'
                :key='stage.stageId'
                :label="stage.stageTitle" 
                :name="stage.stageId"
                >
                  <span slot="label">
                    <el-tooltip 
                      effect="dark" 
                      :content="stage.state > 0 && stage.state <= 6 ? stateTooltip[stage.state*1-1] : '状态错误'" 
                      placement="top" 
                      :open-delay="300">
                      <span class="round">
                        <img v-if='stage.state === 1' src="./style/state_icon/state1.png" alt="">
                        <img v-else-if='stage.state === 2' src="./style/state_icon/state2.png" alt="">
                        <img v-else-if='stage.state === 3' src="./style/state_icon/state3.png" alt="">
                        <img v-else-if='stage.state === 4' src="./style/state_icon/state4.png" alt="">
                        <img v-else-if='stage.state === 5' src="./style/state_icon/state5.png" alt="">
                        <img v-else-if='stage.state === 6' src="./style/state_icon/state6.png" alt="">
                      </span>
                    </el-tooltip>
                    {{stage.stageTitle}}
                  </span>
                </el-tab-pane>
            </el-tabs>
            <div class='stage_all' :class="fullPreviewShow ? 'select_stage_all' : ''">
                <span class='line'></span>
                <span @click='fullPreview'>整体预览</span> 
            </div>
          </div>
          <i class='iconfont icon-guanbijiantou' @click='returnProject'></i>
      </div>
      <!-- 左侧目录 -->
      <div class="detail_left">
          <div 
              class="task_group"
              v-for="(group, index) in this.tasksList"
              :key="group.partitionId"
              >
              <div class="group_title">
                <i 
                    class='iconfont icon-unfold'
                    :class="group.extend ? '' : 'icon_rotate'"
                    @click='extendToggle(index)'
                    ></i>
                <span>{{group.partitionTitle}}</span>
              </div>
              <transition-group>
                <div class="list_box" :key="group.partitionId">
                    <div 
                        class="group_list"
                        v-for="list in group.taskList"
                        :key="list.taskId"
                        >
                        <p 
                          :class="list.taskId == taskId ? 'select_task every' : 'every'"
                          @click="taskStageDetail(list.taskId, stageId)"
                        >{{list.taskTitle}}</p>
                    </div>
                </div>
              </transition-group>
          </div>
          
      </div>
          
      <div class="detail_main">
          <!-- 整体预览的头部操作按钮 -->
          <div v-if='fullPreviewShow' class="top_operate full_view">
            <div class="t_o_left fl">
              <span>{{stageInfo.title}}</span>
            </div>
            <div class="t_o_right fr">
              <!-- 加人 -->
              <span class="add_human" @click.stop='addHumanHandle'>
                <el-tooltip effect="dark" content="添加成员" placement="top" :open-delay="300">
                  <i class='iconfont icon-haoyou1'></i>
                </el-tooltip>
                <transition name="fade1">
                  <add-human
                    v-if='addHumanShow'
                    :fullViewFlag='true'
                    :defaultList='stageList'
                    :ids='idList'
                    @stageInfoChange="stageInfoChange"
                  />
                </transition>
              </span>
              <!-- 加时间 -->
              <span class="add_time" @click.stop='addTimeHandle'>
                 <el-tooltip effect="dark" content="添加时间" placement="top" :open-delay="300">
                  <i class='iconfont icon-rili1'></i>
                </el-tooltip>
                <transition name="fade1">
                  <add-time
                    v-if='addTimeShow'
                    :fullViewFlag='true'
                    :defaultList='stageList'
                    :ids='idList'
                    @stageInfoChange="stageInfoChange"

                  />
                </transition>
              </span>
            </div>
          </div>
          <!-- 头部操作按钮 -->
          <div v-else class="top_operate">
            <div class="t_o_left fl">
              <el-tooltip v-if='!demandCount' effect="dark" content="暂无相关需求" placement="top" :open-delay="300">
                <span class="cur_dis">相关需求</span>
              </el-tooltip>
              <span v-else :class="demandOrGain ? '' : 'demand_gain'" @click="demandOrGainChange(false)">相关需求</span>
              <span class="line"></span>
              <span :class="demandOrGain ? 'demand_gain' : ''" @click="demandOrGainChange(true)">成果文件</span>
            </div>
            <div class="t_o_right fr">
              <!-- 状态管理 -->
              <state-manage 
                ref='stageManage'
                v-if='stageInfo'
                :info='stageInfos'
                :ids='idList'
              />
              <span class="line"></span>
              <!-- 加人 -->
              <span class="add_human" @click.stop='addHumanHandle'>
                <el-tooltip effect="dark" content="添加成员" placement="top" :open-delay="300">
                  <i class='iconfont icon-haoyou1'></i>
                </el-tooltip>
                <transition name="fade1">
                  <add-human
                    v-if='addHumanShow'
                    :defaultList='stageList'
                    :ids='idList'
                    @stageInfoChange="stageInfoChange"
                  />
                </transition>
              </span>
              <!-- 加时间 -->
              <span class="add_time" @click.stop='addTimeHandle'>
                 <el-tooltip effect="dark" content="添加时间" placement="top" :open-delay="300">
                  <i class='iconfont icon-rili1'></i>
                </el-tooltip>
                <transition name="fade1">
                  <add-time
                    v-if='addTimeShow'
                    :defaultList='stageList'
                    :ids='idList'
                    @stageInfoChange="stageInfoChange"
                  />
                </transition>

              </span>
              
              <span class="line"></span>
              <span class="self_file" @click='personalFilesPull'>
                <i class='iconfont icon-gerenwenjianjia'></i>
                个人文档
              </span>
            </div>
          </div>
          <!-- 文件的所有展示 -->
          <template v-if='stageState === 6'>
            <div class="stage_close_box">
              <div class="stage_close">
                <span class="close_img">
                    <img src="./style/stage_close.png" alt="">
                </span>
                <p>该阶段已关闭</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="detail_file">
                <!-- 成果文件 -->
                <div v-if='demandOrGain' id="operateFile" class="operate_file">
                  <div class="top_box">
                    <div class="left fl">
                      <!-- 文件上传 -->
                      <el-dropdown 
                        v-if='false && power' 
                        placement="bottom"
                        >
                        <span class="el-dropdown-link">
                          <i class='iconfont icon-shangchuan'></i>
                        </span>
                        <!-- 文件上传 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="handleClickUpload(0)"
                          >
                            <el-upload 
                              :ref="uploadFrom === 1 ? 'fileUpload' : ''"
                              class="upload_file"
                              :action="'/ProjectFile.ashx?myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
                              :show-file-list="false"
                              :multiple="true"
                              :on-error="uploadError"
                              :on-success="uploadSuccess"
                              :on-progress="uploadProgress"
                              :limit="9"
                              :on-exceed="handleExceed"
                              :before-upload="beforeUpload"
                              >本地上传
                              <!-- <span>本地上传</span> -->
                            </el-upload>
                          </el-dropdown-item>
                          <el-dropdown-item>从个人文档上传</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-upload 
                        v-if='power' 
                        :ref="uploadFrom === 1 ? 'fileUpload' : ''"
                        class="upload_file"
                        :action="'/ProjectFile.ashx?myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
                        :show-file-list="false"
                        :multiple="true"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :on-progress="uploadProgress"
                        :limit="9"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUpload"
                        >
                          <el-tooltip effect="dark" content="上传" placement="top" :open-delay="300">
                            <i 
                              class='iconfont icon-shangchuan' 
                              @click="handleClickUpload(0)"></i>
                          </el-tooltip>
                      </el-upload>
                      <!-- 添加文字 -->
                      <el-tooltip v-if='power' effect="dark" content="添加文字" placement="top" :open-delay="300">
                        <i 
                          class='iconfont icon-tianjiawenzi'
                          @click.stop="inputTextShowToggle('left')"
                          ></i>
                      </el-tooltip>
                      <span v-if='power' class="line"></span>
                      <!-- 文件选择 -->
                      <el-checkbox 
                        v-if='checkedFileList && checkedFileList.length' 
                        class="all_checked" 
                        v-model="fileCheckbox" 
                        @click.native='fileCheckboxAll'
                        >
                        已选<span class="mainColor">{{checkedFileList && checkedFileList.length}}</span>项
                      </el-checkbox>
                      <el-checkbox 
                        v-else 
                        class="all_checked" 
                        v-model="fileCheckbox" 
                        @click.native='fileCheckboxAll'>全选</el-checkbox>
                        <template v-if='checkedFileList && checkedFileList.length'>
                          <el-tooltip effect="dark" content="下载" placement="top" :open-delay="300">
                            <i class="iconfont icon-xiazai" @click='multipleDownload'></i>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="收藏" placement="top" :open-delay="300">
                            <i class="iconfont icon-shoucang1" @click='multipleCollect'></i>
                          </el-tooltip>
                          <!-- 只有一个阶段的时候 -->
                          <template v-if='power && stageList.length === 1'>
                            <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                              <i class="iconfont icon-jihuayijiao cur_dis"></i>
                            </el-tooltip>
                          </template>
                          <!-- 多个阶段 且选中的文件包含他人的文件的时候 -->
                          <template v-else-if='power && stageList.length > 1 && !isOwnChecked'>
                            <el-tooltip effect="dark" content="您只能移交自己的文件" placement="top" :open-delay="300">
                              <i class="iconfont icon-jihuayijiao cur_dis"></i>
                            </el-tooltip>
                          </template>
                           <!-- 多个阶段 且选中的文件不包含他人的文件的时候 -->
                          <template v-else-if='power && stageList.length > 1'>
                            <el-tooltip effect="dark" content="移交" placement="top" :open-delay="300">
                              <i class="iconfont icon-jihuayijiao" @click='multipleTransfer'></i>
                            </el-tooltip>
                          </template>
                        </template>
                    </div>
                    <div class="right fr">
                      <!-- 分组管理 -->
                      <span class="">
                        <el-dropdown v-if='power' class="fixed file_more">
                          <span class="el-dropdown-link"><i class='iconfont icon-fenzu1'></i>分组管理</span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="groupCommand('create')">新建分组</el-dropdown-item>
                            <el-dropdown-item @click.native="groupCommand('sort')">分组排序</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </span>
                      <!-- 视图切换 -->
                      <span class="toggle" @click='viewToggles'>
                        <i :class="viewToggle ? 'iconfont icon-liebiao' : 'iconfont icon-fenzu'"></i>
                        视图切换
                      </span>
                    </div>
                    <!-- 输入文字 -->
                    <div 
                      v-if='inputTextShow1'
                      class="input_text"
                      @click.stop
                      >
                      <textarea 
                        id="inputText"
                        class="textarea" 
                        rows="4"
                        placeholder="请输入文字内容"
                        v-model='inputText'
                        @focus="inputTextFocus"
                        @blur="inputTextBlur"
                        ></textarea>
                      <div v-if='addTextIng || !inputText' class="main_button_disabled_bg fr">添加</div>
                      <button v-else class="main_button_bg fr" @click="inputTextSure('left')">添加</button>
                      <button class="main_button fr" @click="inputTextCancel('left')">取消</button>
                    </div>
                  </div>
                  <div v-if='viewToggle' class="view">
                    <!-- 左侧未分组 -->
                    <div 
                      id="leftBox" 
                      class="left_box"
                      @dragenter="parthDragEnter(0)"
                      >
                      <el-upload
                        v-if='power || (notGroupedList && notGroupedList.length) || dragItem.fromGroup'
                        :ref="uploadFrom === 2 ? 'fileUpload' : ''"
                        :class="{file_empty_upload: true, dragger_upload_dis: false}"
                        :drag="power && !dragItem.FilePkid ? true : false"
                        :action="'/ProjectFile.ashx?myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+0"
                        :show-file-list="false"
                        :multiple="true"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :on-progress="uploadProgress"
                        :limit="9"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUpload"
                        @click.native.prevent
                        >
                        <div 
                          v-if='(notGroupedList && notGroupedList.length) || dragItem.fromGroup' 
                          class="left_file_list"
                          @click.stop
                          >
                            <draggable
                                class='draggable'
                                groupid='noGroup'
                                v-model="notGroupedList"
                                :options="{
                                  group:{name: 'file',pull: 'clone', put: ['file', 'file1']}, 
                                  ghostClass: 'ghost_file', 
                                  dragClass: 'drag_file',
                                  chosenClass: 'chosen_file',
                                  disabled: dragDisabled,
                                  draggable: power ? '.draged' : '',
                                }"
                                :move='fileMove'
                                @start='dragStart($event, "noGroup")'
                                @end='dragEnd'
                            >
                                <!-- :class="ele.checked || ele.hover || operateFile.FilePkid === ele.FilePkid ? 'every_file_operate' : ''" -->
                                <div 
                                    class="every_file draged"
                                    :class="ele.hover || operateFile.FilePkid === ele.FilePkid ? 'every_file_operate' : ''"
                                    v-for="(ele, index) in notGroupedList"
                                    :key="ele.FilePkid"
                                    :id='ele.FilePkid'
                                    :filename='ele.FileName'
                                    @mouseenter="enterFile(ele)"
                                    @mouseleave="leaveFile(ele)"
                                    @click='enterTheDetails(index, 0, -1)'
                                    >
                                    <span class="file_pic">
                                      <template v-if='ele.FileType === 11 && ele.Desc'>
                                        <span class="text_desc"><span>{{ele.Desc}}</span></span>
                                      </template>
                                      <template v-else>
                                        <img :src="ele.UrlMin" alt="">
                                      </template>
                                      <span class="none"></span>
                                    </span>
                                    <div class="file_info">
                                      <p v-if='!ele.edit' class="title">{{ele.FileName}}</p>
                                      <input 
                                        v-else 
                                        class="title edit" 
                                        v-model='ele.FileTitle' 
                                        id="fileNameEdit"
                                        @blur="fileNameEditBlur($event, ele)"
                                        @keyup.enter='fileNameEditBlur($event, ele, true)'
                                        @click.stop
                                        />
                                        <el-tooltip effect="dark" :content="ele.nickName ? ele.nickName : ele.userName" placement="top" :open-delay="300">
                                          <img :src="ele.UserPic" alt="" class="from_header">
                                        </el-tooltip>
                                      <span class="file_message fr">
                                        <el-tooltip effect="dark" content="评论" placement="top" :open-delay="300">
                                          <i class='iconfont icon-pinglun'></i>
                                        </el-tooltip>
                                          {{ele.Count}}
                                      </span>
                                      <span class="fixed file_checkbox" v-if='oneChecked || ele.hover' @click.stop>
                                        <el-checkbox v-model="ele.checked" @change="everyFileCheckbox($event, ele)"></el-checkbox>
                                      </span>
                                      <el-dropdown 
                                        class="fixed file_more"
                                        @visible-change="operateFileDropdown($event, ele)"
                                        @click.native.stop
                                        >
                                        <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                          <el-dropdown-item @click.native="fileCommand('download', index, ele, 0)">下载</el-dropdown-item>
                                          <el-dropdown-item @click.native="fileCommand('collect', index, ele, 0)">收藏</el-dropdown-item>
                                          <el-dropdown-item v-if='ele.isOwn && stageList.length === 1'>
                                            <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                              <span class="cur_dis">移交</span>
                                            </el-tooltip>
                                          </el-dropdown-item>
                                          <el-dropdown-item v-if='ele.isOwn && stageList.length > 1' @click.native="fileCommand('transfer', index, ele, 0)">移交</el-dropdown-item>
                                          <el-dropdown-item v-if='ele.isOwn' @click.native="fileCommand('rename', index, ele, 0)">重命名</el-dropdown-item>
                                          <el-dropdown-item v-if='ele.isOwn' @click.native="fileCommand('delete', index, ele, 0)">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                      </el-dropdown>
                                    </div>
                                </div>
                                <div class="null"></div>
                            </draggable>
                        </div>
                        <div 
                          v-else
                          class="file_empty"
                          @click.stop
                           >
                          <div class="empty_img">
                            <img src="../../../assets/img/file_empty.png" alt="">
                          </div>
                          <p class="title">本地文件拖到此区域即可上传，支持批量上传</p>
                        </div>
                      </el-upload>
                      <div v-else class="file_empty">
                          <div class="empty_img">
                            <img src="../../../assets/img/file_empty.png" alt="">
                          </div>
                          <p class="title">暂无文件</p>
                      </div>
                    </div>
                    <!-- 右侧分组 -->
                    <div id="rightBox" class="right_box">
                      <div v-if='(parthsGroup && parthsGroup.length) || dragItem.fromGroup' class="parths">
                        <!-- 分组排序 -->
                        <p class="mainColor_underline_text go_back_sort" v-if='groupSortFlag' @click='backParthSort'>退出分组排序</p>
                        <template v-if='groupSortFlag'>
                          <draggable
                          v-model="parthsGroup"
                          :options="{
                            ghostClass: 'ghost_parth_sort', 
                            dragClass: 'drag_parth_sort',
                            draggable: power && parthsGroup.length > 1 ? '.draged' : '',
                            }"
                          @end='dragEndParth'
                          >
                            <div 
                              class="parths_group is_sort draged"
                              v-for="group in parthsGroup"
                              :key="group.pkid"
                              :ids="group.pkid"
                              >
                              <i class="iconfont icon-paixu"></i>
                              <span class="group_name">{{group.groupName}}</span>
                            </div>
                          </draggable>
                        </template>
                        <!-- 分组操作 -->
                        <template v-else>
                          <div 
                            class="parths_group"
                            v-for="(group, index) in parthsGroup"
                            :key="group.pkid"
                            @dragenter="parthDragEnter(group.pkid)"
                            >
                            <el-upload
                              :ref="uploadFrom === 4 && filePartitionId === group.pkid ? 'fileUpload' : ''"
                              class="file_empty_upload"
                              :drag="power && !dragItem.FilePkid ? true : false"
                              :action="'/ProjectFile.ashx?myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+group.pkid"
                              :show-file-list="false"
                              :multiple="true"
                              :on-error="uploadError"
                              :on-success="uploadSuccess"
                              :on-progress="uploadProgress"
                              :limit="9"
                              :on-exceed="handleExceed"
                              :before-upload="beforeUpload"
                              @click.native.prevent
                              >
                              <!-- 分组的头部操作 -->
                              <div class="group_top" @click.stop>
                                  <span v-if='!group.edit' class="group_name">{{group.groupName}}</span>
                                    <input 
                                      v-else 
                                      :ref="group.createdGroup || group.edit ? 'createdGroup' : ''" 
                                      class="group_name edit" 
                                      type="text" 
                                      v-model='group.groupName'
                                      @blur='groupTitleBlur(group)'
                                      @keyup.enter='groupTitleBlur(group, true)'
                                      />
                                  <div class="group_operate">
                                    <span 
                                      v-if='group.packUp' 
                                      @click='groupExtendToggle(index, true)'
                                      class='mainColor_underline_text'
                                      >收起</span>
                                      <el-dropdown 
                                        v-if='power || group.fileList.length'
                                        class="fixed file_more"
                                        @visible-change="visibleChangeGroup($event, group)"
                                        >
                                        <span class="el-dropdown-link"><i class='iconfont icon-gengduo1'></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                          <el-dropdown-item 
                                            v-if='power'
                                            @click.native="fileGroupCommand('upload', index, group)"
                                            >
                                            <el-upload 
                                              :ref="uploadFrom === 3 && filePartitionId === group.pkid ? 'fileUpload' : ''"
                                              class="upload_file"
                                              :action="'/ProjectFile.ashx?myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
                                              :show-file-list="false"
                                              :multiple="true"
                                              :on-error="uploadError"
                                              :on-success="uploadSuccess"
                                              :on-progress="uploadProgress"
                                              :limit="9"
                                              :on-exceed="handleExceed"
                                              :before-upload="beforeUpload"
                                              >
                                              <span class="slot_title" @click="handleClickUpload(group.pkid)">上传</span>
                                            </el-upload>
                                          </el-dropdown-item>
                                          <el-dropdown-item 
                                            v-if='group.fileList.length' 
                                            @click.native="fileGroupCommand('download', index, group)"
                                            >下载</el-dropdown-item>
                                          <el-dropdown-item 
                                            v-if='group.fileList.length' 
                                            @click.native="fileGroupCommand('collect', index, group)"
                                            >收藏</el-dropdown-item>
                                          <!-- 整组移交 只有一个阶段的时候 -->
                                          <el-dropdown-item 
                                            v-if='power && group.fileList.length && stageList.length === 1' 
                                            @click.native="fileGroupCommand('transfer', index, group)"
                                            >
                                            <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                              <span class='cur_dis'>整组移交</span>
                                            </el-tooltip>
                                          </el-dropdown-item>
                                          <!-- 整组移交 只有自己的文件的时候 -->
                                          <el-dropdown-item 
                                            v-else-if='power && group.fileList.length && group.fileList.length && group.onlySelf' 
                                            @click.native="fileGroupCommand('transfer', index, group)"
                                            >
                                            整组移交
                                          </el-dropdown-item>
                                          <!-- 整组移交 包含他人文件的时候 -->
                                          <el-dropdown-item 
                                            v-else-if='power && group.fileList.length && !group.onlySelf' 
                                            >
                                            <el-tooltip effect="dark" content="您只能移交自己的文件" placement="top" :open-delay="300">
                                              <span class='cur_dis'>整组移交</span>
                                            </el-tooltip>
                                          </el-dropdown-item>
                                          <el-dropdown-item 
                                            v-if='power' 
                                            @click.native="fileGroupCommand('rename', index, group)"
                                            >重命名</el-dropdown-item>
                                          <el-dropdown-item 
                                            v-if='power' 
                                            @click.native="fileGroupCommand('delete', index, group)"
                                            >删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                      </el-dropdown>
                                  </div>
                              </div>

                              <!-- 折叠成一个的时候 -->
                              <div 
                                v-if='group.allList'
                                :key="group.pkid"
                                :class="{
                                  group_file: true,
                                  drag_in_temporary: dragItem && dragItem.fromGroup && group.border && group.temporary,
                                  drag_in: dragItem && dragItem.fromGroup && group.border && !group.temporary ,
                                  drag_dis:  dragItem && dragItem.fromGroup && !group.border
                                }"
                                @click.stop
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.allList"
                                  :options="{
                                    group:{name: 'file',pull:'clone', put: ['file', 'file1']},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    draggable: '.draged',
                                    disabled: group.dragDisabled
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid, index)'
                                  @end='dragEnd'
                                  >
                                  <template v-if='group.fileList.length'>
                                    <div 
                                      class="every_file fold_up"
                                      v-for="item in group.allList"
                                      :key="item.FilePkid"
                                      :groupid='group.pkid'
                                      :id='item.FilePkid'
                                      :filename='item.FileName'
                                      @click='groupExtendToggle(index, item)'
                                      >
                                        <span class="file_pic">
                                          <span
                                            class="more" 
                                            v-for='(pic, index) in item.UrlMin'
                                            :key='index'
                                            >
                                              <img :src="pic" alt="
                                            ">
                                            <span class="none"></span>
                                          </span>
                                          <span class="more"><img class="more" src="./style/more.png" alt=""></span>
                                          <span class="none"></span>
                                        </span>
                                        <div class="file_info">
                                          <p class="file_length"><span class="mainColor">{{group.fileList.length}}</span>个文件</p>
                                        </div>

                                    </div>
                                  </template>
                                  <template v-else>
                                    <div 
                                      class="every_file fold_up"
                                      :groupid='group.pkid'
                                      @click='groupExtendToggle(index, true)'
                                      >
                                        <span class="file_pic">
                                          <img src="./style/group_empty2.png" alt="">
                                          <span class="none"></span>
                                        </span>
                                        <div class="file_info">
                                          <p class="file_length">暂无文件</p>
                                        </div>
                                        <div class="null"></div>
                                    </div>
                                  </template>
                                </draggable>
                              </div>

                              <!-- 折叠成一行的时候 -->
                              <div 
                                v-else-if='group.overList'
                                :key="group.pkid"
                                :class="{
                                  group_file: true,
                                  drag_in_temporary: dragItem && dragItem.fromGroup && group.border && group.temporary,
                                  drag_in: dragItem && dragItem.fromGroup && group.border && !group.temporary,
                                  drag_dis: dragItem && dragItem.fromGroup && !group.border,
                                }"
                                @click.stop
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.overList"
                                  :options="{
                                    group:{name: 'file',pull:'clone', put: ['file', 'file1']},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    disabled: group.dragDisabled,
                                    draggable: power ? '.draged' : '',
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid, index)'
                                  @end='dragEnd'
                                  >
                                    <div 
                                      class="every_file fold_up"
                                      :class="item.overLength ? '' : 'draged'"
                                      v-for="(item, index1) in group.overList"
                                      :key="item.FilePkid"
                                      :groupid='group.pkid'
                                      :id='item.FilePkid'
                                      :filename='item.FileName'
                                      @click='groupExtendToggle(index, item, index1)'
                                      @mouseenter="enterFile(item)"
                                      @mouseleave="leaveFile(item)"
                                      >
                                      <template v-if='item.overLength'>
                                        <span class="file_pic">
                                          <span
                                            class="more" 
                                            v-for='(pic, index) in item.UrlMin'
                                            :key='index'
                                            >
                                              <img :src="pic" alt="
                                            ">
                                            <span class="none"></span>
                                          </span>
                                          <span class="more"><img class="more" src="./style/more.png" alt=""></span>
                                          <span class="none"></span>
                                          
                                        </span>
                                        <div class="file_info">
                                          <p class="file_length underline_text">展开更多<span class="mainColor">{{item.overLength}}</span>个文件</p>
                                        </div>
                                      </template>
                                      <template v-else>
                                        <span class="file_pic">
                                          <template v-if='item.FileType === 11 && item.Desc'>
                                            <span class="text_desc"><span>{{item.Desc}}</span></span>
                                          </template>
                                          <template v-else>
                                            <img :src="item.UrlMin" alt="">
                                          </template>
                                          <span class="none"></span>
                                        </span>
                                        <div class="file_info">
                                          <p v-if='!item.edit' class="title">{{item.FileName}}</p>
                                          <input 
                                            v-else 
                                            class="title edit" 
                                            v-model='item.FileTitle' 
                                            id="fileNameEdit"
                                            @blur="fileNameEditBlur($event, item)"
                                            @keyup.enter='fileNameEditBlur($event, item, true)'
                                            @click.stop
                                            />
                                          <el-tooltip effect="dark" :content="item.nickName ? item.nickName : item.userName" placement="top" :open-delay="300">
                                            <img :src="item.UserPic" alt="" class="from_header">
                                          </el-tooltip>
                                          <span class="file_message fr">
                                            <el-tooltip effect="dark" content="评论" placement="top" :open-delay="300">
                                              <i class='iconfont icon-pinglun'></i>
                                            </el-tooltip>
                                            {{item.Count}}
                                          </span>
                                          <span class="fixed file_checkbox" v-if='oneChecked || item.hover' @click.stop>
                                            <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item)"></el-checkbox>
                                          </span>
                                          <el-dropdown class="fixed file_more" @click.native.stop>
                                            <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                            <el-dropdown-menu slot="dropdown">
                                              <el-dropdown-item @click.native="fileCommand('download', index1, item, group.pkid, index)">下载</el-dropdown-item>
                                              <el-dropdown-item @click.native="fileCommand('collect', index1, item, group.pkid, index)">收藏</el-dropdown-item>
                                              <el-dropdown-item v-if='item.isOwn && stageList.length === 1'>
                                                <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                                  <span class="cur_dis">移交</span>
                                                </el-tooltip>
                                              </el-dropdown-item>
                                              <el-dropdown-item v-if='item.isOwn && stageList.length > 1' @click.native="fileCommand('transfer', index1, item, group.pkid, index)">移交</el-dropdown-item>
                                              <el-dropdown-item v-if='item.isOwn' @click.native="fileCommand('rename', index1, item, group.pkid, index)">重命名</el-dropdown-item>
                                              <el-dropdown-item v-if='item.isOwn' @click.native="fileCommand('delete', index1, item, group.pkid, index)">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                          </el-dropdown>
                                        </div>
                                      </template>
                                      <div class="null"></div>
                                    </div>
                                </draggable>

                              </div>

                              <!-- 展开的时候 -->
                              <div 
                                v-else-if='group.fileList'
                                :key="group.pkid"
                                class="group_file"
                                :class="dragItem && dragItem.fromGroup ? (group.border ? (group.fileList.length ? 'group_border' : (group.temporary ? 'drag_in_temporary' : 'drag_in')) : 'drag_dis') : (group.fileList.length ? '' : 'parths_empty')"
                                @click.stop
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.fileList"
                                  :options="{
                                    group:{name: 'file',pull:'clone', put: ['file', 'file1']},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    disabled: group.dragDisabled,
                                    draggable: power ? '.draged' : '',
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid, index)'
                                  @end='dragEnd'
                                  >
                                  <div 
                                    class="every_file fold_up draged"
                                    v-for="(item, index1) in group.fileList"
                                    :key="item.FilePkid"
                                    :groupid='group.pkid'
                                    :id='item.FilePkid'
                                    :filename='item.FileName'
                                    @mouseenter="enterFile(item)"
                                    @mouseleave="leaveFile(item)"
                                    @click='enterTheDetails(index1, index + 1, -1)'
                                    >
                                    <span class="file_pic">
                                      <template v-if='item.FileType === 11 && item.Desc'>
                                        <span class="text_desc"><span>{{item.Desc}}</span></span>
                                      </template>
                                      <template v-else>
                                        <img :src="item.UrlMin" alt="">
                                      </template>
                                      <span class="none"></span>
                                    </span>
                                    <div class="file_info">
                                      <p v-if='!item.edit' class="title">{{item.FileName}}</p>
                                      <input 
                                        v-else 
                                        class="title edit" 
                                        v-model='item.FileTitle' 
                                        id="fileNameEdit"
                                        @blur="fileNameEditBlur($event, item)"
                                        @keyup.enter='fileNameEditBlur($event, item, true)'
                                        @click.stop
                                        />
                                      <el-tooltip effect="dark" :content="item.nickName ? item.nickName : item.userName" placement="top" :open-delay="300">
                                        <img :src="item.UserPic" alt="" class="from_header">
                                      </el-tooltip>
                                      <span class="file_message fr">
                                        <el-tooltip effect="dark" content="评论" placement="top" :open-delay="300">
                                          <i class='iconfont icon-pinglun'></i>
                                        </el-tooltip>
                                        {{item.Count}}
                                      </span>
                                      <span class="fixed file_checkbox" v-if='oneChecked || item.hover' @click.stop>
                                        <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item)"></el-checkbox>
                                      </span>
                                      <el-dropdown class="fixed file_more" @click.native.stop>
                                        <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                          <el-dropdown-item @click.native="fileCommand('download', index1, item, group.pkid, index)">下载</el-dropdown-item>
                                          <el-dropdown-item @click.native="fileCommand('collect', index1, item, group.pkid, index)">收藏</el-dropdown-item>
                                          <el-dropdown-item v-if='item.isOwn && stageList.length === 1'>
                                            <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                              <span class="cur_dis">移交</span>
                                            </el-tooltip>
                                          </el-dropdown-item>
                                          <el-dropdown-item v-if='item.isOwn && stageList.length > 1' @click.native="fileCommand('transfer', index1, item, group.pkid, index)">移交</el-dropdown-item>
                                          <el-dropdown-item v-if='item.isOwn' @click.native="fileCommand('rename', index1, item, group.pkid, index)">重命名</el-dropdown-item>
                                          <el-dropdown-item v-if='item.isOwn' @click.native="fileCommand('delete', index1, item, group.pkid, index)">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                      </el-dropdown>
                                    </div>
                                    <div class="null"></div>
                                  </div>
                                </draggable>

                              </div>
                              <div class="group_line" @click.stop></div>
                            </el-upload>

                          </div>
                        </template>
                      </div>
                      <!-- 分组为空 -->
                      <template v-else>
                        <div v-if='power' class="file_empty">
                          <div class="empty_img">
                            <img src="../../../assets/img/group_empty.png" alt="">
                          </div>
                          <p class="title">左侧文件拖到此区域设置分组</p>
                        </div>
                        <div v-else class="file_empty">
                          <div class="empty_img">
                            <img src="../../../assets/img/group_empty.png" alt="">
                          </div>
                          <p class="title">暂无分组</p>
                        </div>
                      </template>
                      <div v-if='true || notGroupedList.length || parthsGroup.length' class="left_right_toggle" @click='leftRightToggle'>
                        <i 
                          class="iconfont icon-tubiaozhizuomoban"
                          :class="leftCenterFlag ? 'icon_rotate' : ''"
                          ></i>
                      </div>
                    </div>
                  </div>

                  <!-- 切换视图 另一个视图 -->
                  <other-view
                    v-if='!viewToggle'
                    ref="otherView"
                    :ids='idList'
                    :stageList='stageList'
                    :list="stageInfo.fileList"
                    @handleCollect='sendCollection'
                    @handleDetails='enterTheDetails'
                  />
                </div>
                <!-- 相关需求 -->
                <div v-else id="operateFile" class="operate_file">
                  <demand-view
                  :taskTitle='stageInfo.title'
                  :list='demandList'
                  @handleCollect="sendCollection"
                  ref="demandView"
                  />
                </div>
                <!-- 个人文档 -->
                <div v-if="personalFilesShow" id="personalFiles" class="personal_files">
                  <div class="top_box">
                    <div class="left fl">
                      <el-upload 
                        :ref="uploadFrom === 5 ? 'fileUpload' : ''"
                        class="upload_file"
                        :action="'/PersonalFile.ashx?myUserId='+userId+'&fatherId='+personalFolder.folderId+'&iLevel='+personalFolder.iLevel+'&title='+personalFolder.fatherName"
                        :show-file-list="false"
                        :multiple="true"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :on-progress="uploadProgress"
                        :limit="9"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUpload"
                        >
                        <el-tooltip effect="dark" content="上传" placement="top" :open-delay="300">
                          <i 
                            class='iconfont icon-shangchuan' 
                            @click="handleClickUpload('personal')"></i>
                        </el-tooltip>
                      </el-upload>
                      <el-tooltip effect="dark" content="添加文字" placement="top" :open-delay="300">
                        <i 
                          class='iconfont icon-tianjiawenzi'
                          @click.stop="inputTextShowToggle()"
                          ></i>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="新建文件夹" placement="top" :open-delay="300">
                        <i 
                          class='iconfont icon-xinjianfenzu'
                          @click='newFolder'
                          ></i>
                      </el-tooltip>
                      
                      <span class="line"></span>
                      <el-checkbox 
                        v-if='checkedListSelf.length' 
                        v-model="fileCheckboxSelf" 
                        @change='fileCheckboxAllSelf'
                        >
                        已选<span class="mainColor">{{checkedListSelf.length}}</span>项
                      </el-checkbox>
                      <el-checkbox 
                        v-else 
                        v-model="fileCheckboxSelf" 
                        @change='fileCheckboxAllSelf'>全选</el-checkbox>
                        <template v-if='checkedListSelf.length'>
                         <el-tooltip effect="dark" content="下载" placement="top" :open-delay="300">
                            <i class="iconfont icon-xiazai" @click='multipleDownload1'></i>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="删除" placement="top" :open-delay="300">
                            <i class="iconfont icon-delete" @click='multipleDel'></i>
                          </el-tooltip>
                        </template>
                    </div>
                    <div class="right fr" v-if='false'>
                      <i class='iconfont icon-sousuo'></i>
                      <i class='iconfont icon-filter'></i>
                    </div>

                    <!-- 输入文字 -->
                    <div 
                      v-if='inputTextShow2'
                      class="input_text"
                      @click.stop
                      >
                      <textarea 
                        id="inputText"
                        class="textarea" 
                        rows="4"
                        placeholder="请输入文字内容"
                        v-model='inputText'
                        @focus="inputTextFocus"
                        @blur="inputTextBlur"
                        ></textarea>
                      <div v-if='addTextIng || !inputText' class="main_button_disabled_bg fr">添加</div>
                      <button v-else class="main_button_bg fr" @click="inputTextSure()">添加</button>
                      <button class="main_button fr" @click="inputTextCancel()">取消</button>
                    </div>
                  </div>
                  <div class="personal_files_main">
                    <div class="p_f_list">
                        <div class="nav_bar" v-if='navBar.length - 1'>
                          <span
                            v-for="(bar, index) in navBar"
                            :key='bar.id'
                            @click='goBack(index)'
                          >
                            <span v-if='index' class='span1 fl'>></span>
                            <span class='cur fl' :class="index === navBar.length - 1 ? 'mainColor' : ''">{{bar.name}}</span>
                          </span>
                        </div>
                        <draggable
                          class="draggable"
                          groupid='personal'
                          v-model="personalFiles"
                          :options="{
                            group:{name: 'file1', pull:'clone', put: ['file']},
                            ghostClass: 'ghost_file', 
                            dragClass: 'drag_file',
                            disabled: dragDisabled_personal,
                            draggable: '.draged',
                            sort: false
                          }"
                          :move='fileMove'
                          @start='dragStart($event, "personal")'
                          @end='dragEnd'
                          @add='dragAdd'
                          
                          >
                          <div 
                              :class="file.FileType !== 12 ? 'every_file draged' : 'every_file'"
                              v-for="(file, index) in personalFiles"
                              :key="file.FilePkid"
                              :id='file.FilePkid'
                              :filename='file.FileName'
                              @dblclick='dbFolder(file)'
                              @mouseenter="enterFileSelf(file)"
                              @mouseleave="leaveFileSelf(file)"
                              >
                              <span class="file_pic">
                                <template v-if='file.FileType === 11 && file.Desc'>
                                  <span class="text_desc"><span>{{file.Desc}}</span></span>
                                </template>
                                <template v-else>
                                  <img :src="file.UrlMin ? file.UrlMin : '../../../assets/img/file_b/12.png'" alt="">
                                </template>
                                <span class="none"></span>
                              </span>
                              <div class="file_info">
                                <p v-if='!file.edit && !file.createdFolder' class="title">{{file.FileName}}</p>
                                <input 
                                  v-else 
                                  class="title edit" 
                                  v-model='file.FileTitle' 
                                  id="fileNameEdit"
                                  @blur="personalFileBlur($event, file, index)"
                                  @keyup.enter='personalFileBlur($event, file, index, true)'
                                  />
                                <p v-if='file.FileType === 12' class="file_num">{{file.SubfileCount}}个文件</p>
                                <p  v-else class="file_num">{{file.Size}}</p>
                                <span class="fixed file_checkbox" v-if='oneCheckedSelf || file.hover'>
                                  <el-checkbox v-model="file.checked" @change="everyFileCheckboxSelf($event, file)"></el-checkbox>
                                </span>
                                <el-dropdown class="fixed file_more">
                                  <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item 
                                      v-if='(file.FileType === 12 && file.SubfileCount) || file.FileType !== 12'
                                      @click.native="personalFileCommand('download', index, file)"
                                      >
                                      <span>下载</span>
                                    </el-dropdown-item>
                                     <el-dropdown-item v-else>
                                      <span class='cur_dis'>下载</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item 
                                      v-if='file.FilePkid > 0'
                                      @click.native="personalFileCommand('rename', index, file)"
                                      >重命名</el-dropdown-item>
                                    <el-dropdown-item 
                                      v-if='file.FilePkid > 0'
                                      @click.native="personalFileCommand('delete', index, file)"
                                      >删除</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                              </div>
                          </div>
                          <div v-if='navBar.length - 1 && !personalFiles.length' class="folder_empty">
                            <p>该文件夹为空</p>
                            <p>您可以从任务中拖拽或从本地上传</p>
                          </div>
                        </draggable>
                    </div>
                  </div>
                </div>
            </div>
            <!-- 整体预览 -->
            <full-preview
              v-if='fullPreviewShow'
              taskId='1'
              :fullList='fullList'
            />
          </template>
      </div>
      <!-- 温馨提示2_移交文件的提示 -->
      <transition name="fade1">
        <transfer-view
          v-if='transferShow'
          :default='transferDefaultStage'
          :selectList="transferStageList"
          @handleCancle="transferCancel"
          @handleSure="transferSure" 
        />
      </transition>
      <!-- 温馨提示2_删除分组的提示 -->
      <transition name="fade1">
        <Reminder2 v-if="delGroupFlag"
            :type="1"
            :text="reminderText"
            @handleCancle="delGroupCancel"
            @handleSure="delGroupSure" />
      </transition>
      <!-- 温馨提示2_删除文件的提示 -->
      <transition name="fade1">
        <Reminder2 v-if="delFileFlag"
            :type="1"
            :text="reminderText"
            @handleCancle="delFileCancel"
            @handleSure="delFileSure" />
      </transition>
      <!-- 温馨提示2_删除个人文档文件（夹）的提示 -->
      <transition name="fade1">
        <Reminder2 v-if="delFileFlag1"
            :type="1"
            :text="reminderText"
            @handleCancle="delFileCancel1"
            @handleSure="delFileSure1" />
      </transition>
      <!-- 文件上传进度条 -->
      <upload-progress v-if="uploadProgressFlag"
        :fileProgressList="fileProgressList"
        @closeProgress="closeProgress"
        @handleCancel="cancelUpload"
        @handleRe="reUpload" />
      
      <!-- 文件详情预览 -->
      <transition name="fade1">
        <file-details v-if="filedetailsShow"
          :info='enterDetailInfo'
          @closeDetails='closeDetails' />
      </transition>
    </div>
</template>
<script>

import Reminder2 from "../../common/reminder2";
import UploadProgress from "../../common/uploadProgress";

import draggable from "vuedraggable";
import FullPreview from './page/fullPreview';
import OtherView from './page/otherView';
import DemandView from './page/demandView';
import StateManage from './page/stateManage';
import AddHuman from './page/addHuman';
import AddTime from './page/addTime';
import TransferView from './page/transferView';
import FileDetails from '../fileDetails';

import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    Reminder2,
    UploadProgress,
    draggable,
    FullPreview,
    OtherView,
    DemandView,
    StateManage,
    AddHuman,
    AddTime,
    TransferView,
    FileDetails
  },
  data() {
    return {
      loginUser: JSON.parse(localStorage.getItem("staffInfo")), // 当前登录者的信息
      projectItem: JSON.parse(localStorage.getItem("projectItem")), // 当前项目
      // userId: 1204, // 当前登录者的ID
      userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
      projectId: 0, // 项目ID
      stageId: '0', // 阶段ID
      taskId: 0, // 任务ID
      stageTaskId: 1, // 阶段ID + 任务ID
      filePartitionId: 0, // 任务文件分组ID
      idList: {}, // 各种ID集合
      // 文件上传
      uploadProgressFlag: false,
      fileProgressList: [],
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
        },
        {
          src: require("../../../assets/img/file_b/12.png")
        }
      ], // 附件icon file_b
      fileTypeImgM: [
        {
          src: require("../../../assets/img/file_m/0.png")
        },
        {
          src: require("../../../assets/img/file_m/1.png")
        },
        {
          src: require("../../../assets/img/file_m/2.png")
        },
        {
          src: require("../../../assets/img/file_m/3.png")
        },
        {
          src: require("../../../assets/img/file_m/4.png")
        },
        {
          src: require("../../../assets/img/file_m/5.png")
        },
        {
          src: require("../../../assets/img/file_m/6.png")
        },
        {
          src: require("../../../assets/img/file_m/7.png")
        },
        {
          src: require("../../../assets/img/file_m/8.png")
        },
        {
          src: require("../../../assets/img/file_m/9.png")
        },
        {
          src: require("../../../assets/img/file_m/10.png")
        },
        {
          src: require("../../../assets/img/file_m/11.png")
        }
      ], // 附件icon file_m

      stageList: [], // 阶段列表
      tasksList: [], // 左侧分组任务列表
      allFileList: [],  // 分组+未分组列表
      demandList: [], // 相关需求的列表
      demandCount: 0, // 是否有相关需求
      stageState: 0, // 当前阶段的状态
      stageInfo: null, // 当前阶段的所有信息
      demandOrGain: true, // false--相关需求 true--成果文件
      viewToggle: true, // true--视图1  false--视图2
      fileCheckboxSelf: false, // 个人文档
      notGroupedList: [], // 未分组文件列表 
      parthsGroup: [], // 分组文件列表
      personalFilesShow: false, // 个人文档是否显示
      personalFiles: [], // 个人文档列表
      personalFileCopy: [], // 个人文档列表
      personalFolder: {
        folderId: 0, // 当前个人文件夹层级的ID
        iLevel: 0, // 当前个人文件夹的层级
        fatherName: '个人文档'
      },
      operatePersonalFile: {}, // 当前正在操作个人文件的文件
      delFileFlag1: false, // 删除个人文件（夹）的温馨提示
      dragFileId: "", // 当前拖拽文件的ID
      moveOrClone: "move", // 是移动还是copy
      dragDisabled: false, // 未分组是否禁止拖拽
      dragDisabled_personal: false, // 个人文档是否禁止拖拽
      dragItem: {
        item: {},
        fromGroup: null,
        toGroup: null
      }, // 当前拖拽文件的详情
      navBar: [{ id: 0, folderId: 0,name: "个人文档" }], // [{ id: 0, name: "个人文档" }], // 个人文档的文件层级
      fileBoxW: 182, // 188 // 文件元素盒子的宽度
      leftBoxW: 210, // 未分组盒子的宽度
      personalBoxW: 388, // 个人文档盒子的宽度
      leftCenterFlag: true, // true--未分组占大份 false--分组区域占大份
      inputTextShow1: false, // 输入文字弹窗——任务文件
      inputTextShow2: false, // 输入文字弹窗——个人文档
      inputText: '', // 添加文字的内容
      fullPreviewShow: false, // 整体预览是否显示
      fullList: {}, // 整体预览的数据
      oneCheckedSelf: false, // 个人文档--是否有一个文件被选中
      checkedList: [], // 已选中的文件列表
      checkedListSelf: [], // 个人文档--已选中的文件列表
      delGroupFlag: false, // 删除分组的提示
      delFileFlag: false, // 删除文件的提示
      reminderText: '您确定要删除吗？', // 输出提示框的默认文字
      operateParth: {}, // 当前操作的文件分组信息
      operateFile: {}, // 当前操作的文件信息
      groupNameCopy: '', // copy文件分组的名字
      fileNameCopy: '', // copy文件的名字
      groupSortFlag: false, // 分组排序展示
      addHumanShow: false, // 加人显示/隐藏
      addTimeShow: false, // 加时间显示/隐藏
      transferShow: false, // 文件移交的弹窗
      transferStageList: [], // 移交选择的阶段列表
      transferDefaultStage: [], // 移交时默认选择下一阶段阶段
      operateType: 1, // 1--单个文件移交， 2--多个文件移交， 3--组文件的移交,
      addTextIng: false, // 正在生成文本
      //    
      /**
       * 1--左上角点击从本地上传；
       * 2--未分组从本地拖拽上传；
       * 3--右侧分组点击分组里的上传；
       * 4--右侧分组从本地拖拽上传；
       * 5--个人文件夹点击上传
       * 6--个人文件夹从本地拖拽上传
       * **/
      uploadFrom: 1, 
      filedetailsShow: false , //文件预览是否显示
      lastTime: null, // 判断失焦和进入详情的间隔
      enterEdit: false, // enter保存
      stateTooltip: ['已开启', '已完成', '未开始', '进行中', '已超时', '已关闭'],

    };
  },
  watch: {
    checkedList(val) {
      this.CHECKEDLIST_CHANGE(val);
    },
    leftCenterFlag(val) {
      if (val) {
        // 未分组占大份
        $("#leftBox").removeClass("left_box_toggle");
        $("#rightBox").removeClass("right_box_toggle");
        this.countFileOne();
        for (let x of this.parthsGroup) {
          x.packUp = false;
          if (x.overList) {
            delete x.overList;
          }
        }
        this.parthsGroup = this.parthsGroup.concat();
      } else {
        // 分组区域占大份
        $("#leftBox").addClass("left_box_toggle");
        $("#rightBox").addClass("right_box_toggle");
        for (let x of this.parthsGroup) {
          if (x.allList) {
            delete x.allList;
          }
          if (x.overList) {
            delete x.overList;
          }
        }
        for (let i = 0; i < this.parthsGroup.length; i++) {
          let x = this.parthsGroup[i];
          if (!x.overList) {
            this.countFileMore(i);
          }
        }
        this.parthsGroup = this.parthsGroup.concat();
      }
    },
    notGroupedList: {
      deep: true,
      handler(val, old) {
        let length = 0;
        for(let x of this.parthsGroup) {
          for(let y of x.fileList) {
            length++;
          }
        }
        this.FILELENGTH_CHANGE(val.length + length); // 文件长度变化
        this.stageInfo.fileList[0].fileList = val; // 更新总的文件
        /**
         * 当为文件列表视图时：头部操作对列表视图的影响
         * 上传文件
         * 添加文字
         * 多选操作：批量下载 批量收藏 批量移交
         * 分组管理：添加分组 分组排序
         * **/
        if(!this.viewToggle) { // 更新另一个视图的文件
          this.$refs.otherView.updateData(this.stageInfo.fileList);
        }
      }
    },
    parthsGroup: {
      deep: true,
      handler(list, old) {
        let length = 0;
        for(let x of list) {
          for(let y of x.fileList) {
            length++;
          }
        }
        this.FILELENGTH_CHANGE(length + this.notGroupedList.length); // 文件长度变化
        this.stageInfo.fileList = [].concat(this.stageInfo.fileList[0], list); // 更新总的文件
        if(!this.viewToggle) { // 更新另一个视图的文件
          this.$refs.otherView.updateData(this.stageInfo.fileList);
        }
      }
    },
    stageList: {
      deep: true,
      handler(val) {
        this.stageInfo.stageList = [...this.stageList];
      }
    },
    filePartitionId(val) {
      this.idList.filePartitionId = val;
      this.TASKIDS_CHANGE(this.idList);
    },

  },
  computed: {
    ...mapState([
      'stageInfos',
      'checkedFileList',
      'fileLength',
      'power' // 权限管理 0--未参加阶段任务 1--参加了阶段任务
    ]),
    isOwnChecked() {
        let indexs = this.checkedFileList.findIndex(ele => ele.UserPkid != this.userId);
        if(indexs === -1) {
          return true;
        }else {
          return false;
        }
    },
    fileCheckbox: {
      get() {

        if(this.fileLength && this.checkedFileList && (this.checkedFileList.length === this.fileLength)) {
          return true;
        }else {
          return false;
        }
      },
      set() {

      }
      
    },
    // 是否有一个文件被选中
    oneChecked() {
      if(this.checkedFileList && this.checkedFileList.length) {
        return true;
      }else {
        return false;
      }
    }
  },
  methods: {
    ...mapMutations([
      'STAGEINFO_CHANGE',
      'CHECKEDLIST_CHANGE',
      'FILELENGTH_CHANGE',
      'TASKIDS_CHANGE',
      'POWER_CHANGE'
    ]),
    // 进入文件详情
    enterTheDetails(index, groupIndex, type) {
      if(type === -1) {
        let times = new Date().getTime();
        if(times - this.lastTime < 500) {
          return;
        }
      }
      
      let x = this.stageList.findIndex(ele => ele.stageId == this.stageId);
      this.enterDetailInfo = {
        groupIndex: groupIndex,
        fileIndex: index,
        fileList: this.stageInfo.fileList,
        type: type && type !== -1 ? 2 : 1,
        menuList: [
          this.stageInfo.title, 
          this.stageInfo.stageList[x].stageTitle, 
          this.stageInfo.fileList[groupIndex].groupName, 
          this.stageInfo.fileList[groupIndex].fileList[index].FileName
          ]
      }
      this.filedetailsShow = true;
      
    },
    // 关闭文件详情
    closeDetails() {
      this.filedetailsShow = false;
    },
    // 返回格子任务列表
    returnProject() {
      this.$router.push("/project/projectInfo");
    },

    // 添加人员
    addHumanHandle() {
      this.addHumanShow = true;
      this.addTimeShow = false;
      let clickHide = e => {
        this.addHumanShow = false;
        $(document).unbind("click", clickHide)
      };
      $(document).bind("click", clickHide)
    },

    // 添加时间
    addTimeHandle() {
      this.addTimeShow = true;
      this.addHumanShow = false;
      let clickHide = e => {
        this.addTimeShow = false;
        $(document).unbind("click", clickHide)
      };
      $(document).bind("click", clickHide)
    },
    // 文件视图切换
    viewToggles() {
      this.viewToggle = !this.viewToggle;
      if(this.viewToggle) { // 默认视图
       this.retrunData(true);
      }
    },
    // 文件视图切换后，文件的重新赋值
    retrunData(flag) {
      return new Promise((resolve) => {
        const obj = this.$refs.otherView.close();
        this.checkedList = [...obj.checkedList];
        const list = [...obj.list];
        for(let x of list) {
          for(let y of x.fileList) {
            if (y.FileType === 1) {
              y.UrlMin = y.Url;
            }else {
              y.UrlMin = this.fileTypeImg[y.FileType].src;
            }
          }
        }
        this.notGroupedList = [].concat(list[0].fileList);
        this.parthsGroup = [...list].splice(1);
        if(flag) {
          this.leftCenterChange(this.leftCenterFlag);
        }
      });
      // 进行文件多选的回选
      // this.returnSelection(obj.checkedList);
    },

    // 文件时图切换后，复选框的回选
    returnSelection(list) {
      for(let x of this.parthsGroup) {
        for(let y  of x.fileList) {
          let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
          if(indexs === -1) {
            y.checked = false;
          }else {
            y.checked = true;
          }
        }
      }
      for(let y  of this.notGroupedList) {
        let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
        if(indexs === -1) {
          y.checked = false;
        }else {
          y.checked = true;
        }
      }
    },

    // 输入文字的显示/隐藏
    inputTextShowToggle(flag) {
      if(flag === 'left') { // 任务文件
        this.inputTextShow1 = true;
        if(this.inputTextShow2) {
          this.inputTextShow2 = false;
          this.inputText = '';
        }
      }else { // 个人文档
        this.inputTextShow2 = true;
        if(this.inputTextShow1) {
          this.inputTextShow1 = false;
          this.inputText = '';
        }
      }
      this.$nextTick(() => {
        $('#inputText').focus();
      });
      let clickHide = e => {
        if(flag === 'left') { // 任务文件
          this.inputTextShow1 = false;
        }else { // 个人文档
          this.inputTextShow2 = false;
        }
        $(document).unbind("click", clickHide)

      };
      $(document).bind("click", clickHide)
    },

    // 输入文字--获取焦点
    inputTextFocus() {
      $('#inputText').addClass('textarea_border');
    },

    // 输入文字--失去焦点
    inputTextBlur() {
      this.lastTime = new Date().getTime();
      $('#inputText').removeClass('textarea_border');
    },

    // 添加文字--确定
    inputTextSure(flag) {
      if(this.inputText == '') {
        this.$message({
          type: 'warning',
          message: '请输入文字内容！',
          center: true
        });
        return;
      }
      if(this.addTextIng) {
        return;
      }
      this.addTextIng = true;
      if(flag === 'left') { // 任务文件
        let obj = {
          myUserId: this.userId,
          projectId: this.projectId,
          stageTaskId: this.stageTaskId,
          filePartitionId: true ? 0 : this.filePartitionId, // 现在只能给未分组添加文字
          desc: this.inputText,
        };
        this.$HTTP('post', '/stageTaskInfo_add', obj).then(res => {
          this.addTextIng = false;
          this.inputTextShow1 = false;
          this.inputText = '';
          let returnObj = this.addFileAttr(res.result);
          returnObj = Object.assign(res.result, returnObj);
          this.notGroupedList.push(returnObj);
          this.$message({
            type: 'success',
            message: '添加文字内容成功',
            center: true
          });
          console.log('添加文字内容成功', res);
        }).catch(err => {
          console.log(err);
        });
      }else { // 个人文档
        let obj = {
          myUserId: this.userId,
          fatherId: this.personalFolder.folderId,
          iLevel: this.personalFolder.iLevel,
          title: this.personalFolder.fatherName, // 现在只能给未分组添加文字
          desc: this.inputText,
        };
        this.$HTTP('post', '/persona_add_file', obj).then(res => {
          this.inputTextShow2 = false;
          this.addTextIng = false;
          this.inputText = '';
          let returnObj = this.addFileAttr(res.result);
          returnObj = Object.assign(res.result, returnObj);
          this.personalFiles.push(returnObj);
          this.$message({
            type: 'success',
            message: '添加文字内容成功',
            center: true
          });
          console.log('添加文字内容成功', res);
        }).catch(err => {
          console.log(err);
        });
       
      }
      
    },

    // 添加文字--取消
    inputTextCancel(flag) {
      if(flag === 'left') { // 任务文件
        this.inputTextShow1 = false;
      }else { // 个人文档
        this.inputTextShow2 = false;
      }
      this.inputText = '';
    },
    // 分区和任务的展开/折叠
    extendToggle(index) {
      this.tasksList[index].extend = !this.tasksList[index].extend;
      this.tasksList = this.tasksList.concat();
      $(".list_box")
        .eq(index)
        .slideToggle(400);
    },

    // 阶段的整体预览
    fullPreview() {
      this.stageId = null;
      this.stageState = 0;
      let obj = {
        myUserId: this.userId,
        projectId: this.projectId,
        taskId: this.taskId
      };
      this.$HTTP("post", "/project_get_view", obj, $('#app')[0])
        .then(res => {
          this.fullList = res.result;
          this.fullPreviewShow = true;
          // console.log("阶段的整体预览", res);
        })
        .catch(err => {
          console.log("阶段的整体预览失败", err);
          // this.$message.error("移动分组失败，请检查网络");
        });
    },

    // 关闭阶段的整体预览
    closeFullPreview() {
      this.fullPreviewShow = false;
    },

    // 切换相关需求/成果文件
    demandOrGainChange(flag) {
      if(!flag) {
        let obj = {
          stageId: this.idList.stageId,
          taskId: this.idList.taskId,
          myUserId: this.idList.userId,
        }
        this.$HTTP('post', '/demand_list', obj, $('#app')[0]).then(res => {
          // console.log(res.result);
          this.demandList = [...res.result];
          this.demandOrGain = flag;
        }).catch(err => {
          console.log(err);
        });
        return;
      }
      this.demandOrGain = flag;
    },

    // 左右文件视图大小转换
    leftRightToggle() {
      this.leftCenterFlag = !this.leftCenterFlag;
    },
    // 左右文件视图大小转换
    leftCenterChange(val) {
      this.$nextTick(() => {
        if (val) {
          // 未分组占大份
          $("#leftBox").removeClass("left_box_toggle");
          $("#rightBox").removeClass("right_box_toggle");
          this.countFileOne();
          for (let x of this.parthsGroup) {
            x.packUp = false;
            if (x.overList) {
              delete x.overList;
            }
          }
          this.parthsGroup = this.parthsGroup.concat();
        } else {
          // 分组区域占大份
          $("#leftBox").addClass("left_box_toggle");
          $("#rightBox").addClass("right_box_toggle");
          for (let x of this.parthsGroup) {
            if (x.allList) {
              delete x.allList;
            }
            if (x.overList) {
              delete x.overList;
            }
          }
          for (let i = 0; i < this.parthsGroup.length; i++) {
            let x = this.parthsGroup[i];
            if (!x.overList) {
              this.countFileMore(i);
            }
          }
          this.parthsGroup = this.parthsGroup.concat();
        }
      });
    },

    // 文件组折叠/展开
    groupExtendToggle(index, item, index1) {
      if(item !== true && !item.overLength) {
        this.enterTheDetails(index1, index + 1);
        return;
        }
      if (this.leftCenterFlag) {
        this.leftRightToggle();
        this.parthsGroup[index].packUp = null;
      } else {
        this.parthsGroup[index].packUp = !this.parthsGroup[index].packUp;
      }
      if (this.parthsGroup[index].packUp) {
        // 收起
        this.countFileMore(index, false);
      } else {
        // 展开
        this.countFileMore(index, true);
      }
      this.parthsGroup = this.parthsGroup.concat();
    },


    // 计算需要折叠的文件个数--分组折叠成一行
    countFileMore(i, flag) {
      // console.log(this.parthsGroup[i].fileList);
      if (flag === false) {
        // 展开
        if (this.parthsGroup[i].overList) {
          delete this.parthsGroup[i].overList;
        }
        this.parthsGroup = this.parthsGroup.concat();
        return;
      }
      this.$nextTick(() => {
        const w = $(".parths_group")
          .eq(i)
          .find(".group_file")
          .eq(0)
          .width() + 24;
        const x = Math.floor(w / this.fileBoxW);
        let list = [...this.parthsGroup[i].fileList];
        let length = list.length;
        if (length <= x) {
          this.parthsGroup[i].packUp = null;
          if(this.parthsGroup[i].overList) {
            delete this.parthsGroup[i].overList;
          }
          this.parthsGroup = this.parthsGroup.concat();
          return;
        }
        this.parthsGroup[i].packUp = false;
        let over = length - x;
        let overList = [...list].splice(0, x - 1);

        let others = [...list].splice(x - 1);
        let urls = [];
        others.map(ele => urls.push(ele.UrlMin));
        if (urls.length > 3) {
          urls = urls.splice(0, 3);
        }
        overList.push({
          FilePkid: `group${i}`,
          FileName: null,
          UrlMin: urls,
          FileType: null,
          userName: null,
          overLength: over + 1
        });
        this.parthsGroup[i] = Object.assign({}, this.parthsGroup[i], {
          overList: overList
        });
        this.parthsGroup = this.parthsGroup.concat();
        // console.log('countFileMore--', 'w--> ' + w, 'x--> ' + x, 'length==>' + this.parthsGroup[i].fileList.length, this.parthsGroup[i]);
      });
    },
    // 个人文件显示/隐藏对文件结构的影响
    countFileView(i, packUp, pull) {
      this.$nextTick(() => {
        const w = $(".parths_group")
          .eq(i)
          .find(".group_file")
          .eq(0)
          .width() + 24;
        const x = Math.floor(w / this.fileBoxW);
        let list = [...this.parthsGroup[i].fileList];
        let length = list.length;
        if((pull && packUp === false) || (!pull && packUp === false && length > x)) {
          let over = length - x;
          let overList = [...list].splice(0, x - 1);

          let others = [...list].splice(x - 1);
          let urls = [];
          others.map(ele => urls.push(ele.UrlMin));

          if (urls.length > 3) {
            urls.splice(0, 3);
          }

          overList.push({
            FilePkid: `group${i}`,
            FileName: null,
            UrlMin: urls,
            FileType: null,
            userName: null,
            overLength: over + 1
          });
          this.parthsGroup[i] = Object.assign({}, this.parthsGroup[i], {
            overList: overList
          });
          this.parthsGroup = this.parthsGroup.concat();
          return;
        }
        if(pull && packUp === null && length > x) {
          this.parthsGroup[i].packUp = true;
          this.parthsGroup = this.parthsGroup.concat();
          return;
        }
        if(!pull && (packUp !== null && (length <= x))) {
          this.parthsGroup[i].packUp = null;
          if(this.parthsGroup[i].overList) {
            delete this.parthsGroup[i].overList
          }
          this.parthsGroup = this.parthsGroup.concat();
          return;
        }
        return;
        if(pull) { // 当个人文档从不显示-->显示的时候，
          if(packUp === false) { // 重新计算要折叠剩余的个数
          
          }else if(packUp === null) { // 计算现在一行还能展示下吗 如果展示不下的话，让flag = true
            if(length > x) {
            }
          }
          // 如果flag === true 继续为true
        }else { // 当个人文档从显示-->不显示的时候，
          if(packUp !== null) {
            if(length <= x) {
              // this.parthsGroup[i].packUp = null;
            }
          }
          if(packUp === true) { // 重新计算个人文件收起时一行还能展示下吗：可以的话让flag = null；否则 flag还是true
            if(length <= x) {
              // this.parthsGroup[i].packUp = null;
            }
          }else if(packUp === false) { // 重新计算一行还能展示下吗：可以的话让flag = null；否则 flag还是false，但折叠的个数需改变
            if(length <= x) {
              // this.parthsGroup[i].packUp = null;
            }else { // 折叠的个数需改变 
            
            }
          }
          // 如果flag === null 不需要操作
        }

      });

    }, 
    // 计算需要折叠的文件个数--分组折叠成一个
    countFileOne() {
      let i = 0;
      for (let ele of this.parthsGroup) {
        let urls = [];
        for(let x of ele.fileList) {
          if(urls.length < 3) {
            // let min = this.fileTypeImgM[x.FileType].src;
            urls.push(x.UrlMin);
          }else {
            break;
          }
        }
        let allList = [
          {
            FilePkid: `group${i}`,
            FileName: null,
            UrlMin: urls,
            FileType: null,
            userName: null,
            overLength: ele.fileList.length
          }
        ];
        i++;
        this.$set(ele, "allList", allList);
      }
      this.parthsGroup = this.parthsGroup.concat();
    },
    // 分组管理的下拉列表的显示/隐藏时触发
    visibleChangeGroup(val, group) {
      if(val) {
        let x = group.fileList.findIndex(ele => !ele.isOwn);
        this.$set(group, 'onlySelf', x === -1 ? true : false);
        this.parthsGroup = this.parthsGroup.concat();

      }
    },
    // 编辑时对input框的获取焦点等操作
    editFocus(element, select = true) {
      this.$nextTick(() => {
        const ele = element ? $(element) : this.$refs.createdGroup[0];
        ele.focus();
        select ? ele.select() : null;
        this.enterEdit = false;
      });
    },
    // 整体的分组管理
    groupCommand(type) {
      if(this.viewToggle) { // 在默认视图操作分组管理
        let title = '新建分组';
        let repeat = this.parthsGroup.findIndex(ele => ele.groupName === title);
        // 分组名称判断
        if(repeat !== -1) { // 文件名重复
          let repeatNum = [];
          for(let x of this.parthsGroup) {
            let y = 0;
            if(x.groupName.indexOf('新建分组') !== -1 && x.groupName.length > 4) {
              y = x.groupName.slice(4);
              y = parseInt(y);
              !isNaN(y) && repeatNum.push(y);
            }
          }
          if(repeatNum.length) {
            repeatNum.sort();
            title = title + (repeatNum[repeatNum.length - 1] + 1);
          } else {
            title = title + 1;
          }
        }
        // 文件拖拽时默认临时加的分组
        if(type === 'temporary') {
          this.parthsGroup.push({
            pkid: 'new',
            groupName: title,
            border: false,
            packUp: null,
            fileList: [],
            dragDisabled: false,
            edit: false,
            temporary: true
          });
          return;
        }
        // 新建分组
        if(type === 'create') {
          if(this.groupSortFlag) {
            this.groupSortFlag = false;
          }
          // 添加一条数据
          this.parthsGroup.push({
            pkid: 'new',
            groupName: title,
            fileList: [],
            border: false,
            packUp: null,
            dragDisabled: false,
            edit: true,
            createdGroup: true
          });
          // 分组名获取焦点并选
          this.editFocus();
          return;
        }

        // 分组排序
        if(type === 'sort') {
          this.groupSortFlag = true;
          return;
        }
      }else { // 在另一个视图操作分组管理
        this.$refs.otherView.groupCommand(type);
        // if(this.leftCenterFlag) {
        //   this.countFileOne();
        // }
      }
    },
    // 退出分组排序
    backParthSort() {
      this.groupSortFlag = false;
    },

    // 分组排序
    dragEndParth(e) {
      const ids = $(e.item).attr('ids');
       let obj = {
        filePartitionId: ids,
        isSort: e.newIndex
      };
      this.$HTTP("post", "/filePartition_update_isSort", obj)
        .then(res => {
          console.log("移动分组成功", res);
        })
        .catch(err => {
          console.log("移动分组失败", err);
          this.$message({
            type: 'error',
            message: '移动分组失败，请检查网络',
            center: true
          });
        });
    },

    // 新建/编辑分组名
    groupTitleBlur(group, flag) {
      if(this.enterEdit) {
        return;
      }
      this.lastTime = new Date().getTime();
      if(group.groupName == '') {
        this.$message({
          type: 'warning',
          message: '分组名不能为空！',
          center: true
        });
        this.editFocus();
        return;
      }
      // 先判重，如果有重复的名字--提示，否则--发送请求
      let repeat = this.parthsGroup.findIndex(ele => (ele.groupName === group.groupName && ele.pkid !== group.pkid));
      if(repeat !== -1) {
        this.$message({
          type: 'warning',
          message: '已含有同名分组名！',
          center: true
        });
        this.editFocus();
        return;
      }
      if(group.createdGroup) { // 新建
        // 发送请求---新建分组
        this.addParth(group.groupName);
      }else { // 编辑
        // 发送修改分组名的接口
        if(this.groupNameCopy !== group.groupName) {
          let obj = {
            filePartitionId: group.pkid,
            title: group.groupName
          };
          this.$HTTP('post', '/filePartition_update', obj).then(res => {
            console.log('文件分组名修改成功', res);
            this.$message({
              type: 'success',
              message: '文件分组名修改成功',
              center: true
            });
          }).catch(err => {
            console.log(err);
          });
        }
        group.edit = false;
        this.parthsGroup = this.parthsGroup.concat();
      }
      if(flag) {
        this.enterEdit = true;
      }
    },

    // 发送请求，添加分组
    addParth(title, item, dragItem) {
      return new Promise((resolve) => {
        let obj = {
          stageTaskId: this.stageTaskId,
          title: title
        };
        let data = {
          border: false,
          packUp: null,
          dragDisabled: false,
          edit: false,
        }
        this.$HTTP('post', '/filePartition_add', obj).then(res => {
          let objs = {};
          if(item) {
            const lists = Object.assign({}, res.result);
            lists.fileList = item.fileList;
            lists.allList = item.allList;
            objs = Object.assign({}, lists, data);
          }else {
            objs = Object.assign({}, res.result, data);
          }
          this.parthsGroup.splice(this.parthsGroup.length - 1, 1, objs);
          if(dragItem) {
            this.fileIsSort(this.parthsGroup.length - 1, res.result.pkid, dragItem);
          }
          this.$message({
            type: 'success',
            message: '添加分组成功！',
            center: true
          });
          //console.log('添加分组成功！', objs);
          if(this.leftCenterFlag) {
            this.countFileOne();
          }
        }).catch(err => {
          console.log('err', err);
        });
      });
    },
    // 文件的更多操作显示/隐藏
    operateFileDropdown(val, item) {
      return;
      if(val) {
      }else {
      }
      this.notGroupedList = this.notGroupedList.concat();
      this.parthsGroup = this.parthsGroup.concat();
    },
    // 文件的更多操作
    fileCommand(type, index1, item, groupId, index) {
      this.operateFile = Object.assign({}, item, {index: index1, groupId: groupId, groupIndex: index});
      this.operateType = 1; // 单个文件移交
      if(type === 'download') { // 下载
        this.fileDownlod(item);
        return;
      }
      if(type === 'collect') { // 收藏
        this.fileCollect(item);
        return;
      }
      if(type === 'transfer') { // 移交
        this.getTransferStageList();
        this.transferShow = true;
        return;
      }
      if(type === 'rename') { // 重命名
        item.edit = true;
        this.fileNameCopy = item.FileTitle;
        if(groupId) {
          this.parthsGroup = this.parthsGroup.concat();
        }else {
          this.notGroupedList = this.notGroupedList.concat();
        }
        this.editFocus('#fileNameEdit');
        return;
      }
      if(type === 'delete') { // 删除
        this.delFileFlag = true;
        this.reminderText = '您确定要删除该文件吗？';
        return;
      }
    },

    // 修改文件名失焦--保存
    fileNameEditBlur(e, item, flag) {
      if(this.enterEdit) {
        return;
      }
      this.lastTime = new Date().getTime();
      const { index, groupId, groupIndex } = this.operateFile;
      const newTitle = item.FileTitle + '.' + item.Type;
      if(item.FileTitle == '') {
        this.$message({
          type: 'warning',
          message: '文件名不能为空！',
          center: true
        });
        this.editFocus('#fileNameEdit');
        return;
      }
      // 先判重，如果有重复的名字--提示，否则--发送请求
      let repeat = -1;
      if(groupId) {
        repeat = this.parthsGroup[groupIndex].fileList.findIndex(ele => (ele.FileName === newTitle && ele.FilePkid !== item.FilePkid));
      }else {
        repeat = this.notGroupedList.findIndex(ele => (ele.FileName === newTitle && ele.FilePkid !== item.FilePkid));
      }
      if(repeat !== -1) {
        this.$message({
          type: 'error',
          message: '该分组内含有同名文件！·',
          center: true
        });
        this.editFocus('#fileNameEdit', false);
      }else {
        // 发送修改分组名的接口
        if(this.fileNameCopy !== item.FileTitle) {
          let obj = {
            FilePkid: item.FilePkid,
            newTitle: item.FileTitle + '.' + item.Type
          };
          this.$HTTP('post', '/stageTaskFile_update', obj).then(res => {
            console.log('修改文件名成功', res);
            this.$message({
              type: 'success',
              message: '修改文件名成功',
              center: true
            });
          }).catch(err => {
            console.log('修改文件名失败', err);
          });
          item.FileName = newTitle;
        }
        item.edit = false;
        if(groupId) {
          this.parthsGroup = this.parthsGroup.concat();
        }else {
          this.notGroupedList = this.notGroupedList.concat();
        }
      }
      if(flag) {
        this.enterEdit = true;
      }
    },
    // 取消删除文件
    delFileCancel() {
      this.delFileFlag = false;

    },
    // 确认删除文件
    delFileSure() {
      this.delFileFlag = false;
      const { FilePkid, index, groupId, groupIndex } = this.operateFile;
      let obj = {
        FilePkid: FilePkid
      };
      this.$HTTP('post', '/stageTaskFile_delete', obj).then(res => {
        // console.log('删除文件成功', res, this.operateFile);
        if(this.operateFile.checked) {
          const indexs = this.checkedList.findIndex(ele => ele.FilePkid === FilePkid);
          indexs !== -1 && this.checkedList.splice(indexs, 1);
        }
        if(groupId === 0) { // 未分组文件
          this.notGroupedList.splice(index, 1);
          this.notGroupedList = this.notGroupedList.concat();

        }else { // 分组文件
          this.parthsGroup[groupIndex].fileList.splice(index, 1);
          this.parthsGroup = this.parthsGroup.concat();
          this.groupFileChange(groupIndex); 

        }
      }).catch(err => {
        console.log('删除文件失败', err);
      });
    },

    // 组的更多操作
    fileGroupCommand(type, index, group) {
      this.filePartitionId = group.pkid;
      this.operateParth = Object.assign({}, group, {index: index});
      this.operateType = 3; // 整组移交

      if(type === 'upload') { // 上传文件
        return;
      }
      if(type === 'download') { // 下载
        this.fileDownlod(group);
        return;
      }
      if(type === 'collect') { // 收藏
        this.fileCollect(group);
        return;
      }
      if(type === 'transfer') { // 整组移交
        this.getTransferStageList();
        this.transferShow = true;

        return;
      }
      if(type === 'rename') { // 重命名
        group.edit = true;
        this.groupNameCopy = group.groupName;
        this.parthsGroup = this.parthsGroup.concat();
        this.editFocus();
        return;
      }
      if(type === 'delete') { // 删除
        if(group.fileList.length) {
          this.delGroupFlag = true;
          this.reminderText = '您确认要删除该分组么？ 删除后，分组内的文件将移入到未分组内';
        }else {
          let obj = {
            filePartitionId: group.pkid,
            myUserId: this.userId
          };
          this.$HTTP('post', '/filePpartition_delete', obj).then(res => {
            console.log('文件分组删除成功', res);
            this.parthsGroup.splice(index, 1);
          }).catch(err => {
            console.log(err);
          });
        }
        return;
      }
    },
    // 文件组取消删除
    delGroupCancel() {
      this.delGroupFlag = false;
    },
    // 文件组确认删除
    delGroupSure() {
      let obj = {
        filePartitionId: this.filePartitionId,
        myUserId: this.userId
      };
      this.$HTTP('post', '/filePpartition_delete', obj).then(res => {
        for(let x of this.operateParth.fileList) {
          if(x.checked) {
            const indexs = this.checkedList.findIndex(ele => ele.FilePkid === x.FilePkid);
            indexs !== -1 && this.checkedList.splice(indexs, 1);
          }
        }

        let addList = res.result;
        addList = addList.splice(this.notGroupedList.length);
        for(let y of addList) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }
        // console.log('文件分组删除成功',res.result, addList);
        this.notGroupedList.push(...addList);
        this.parthsGroup.splice(this.operateParth.index, 1);

      }).catch(err => {
        console.log(err);
      });
      this.delGroupFlag = false;
    },

    // 鼠标移入文件
    enterFile(item) {
      item.hover = true;
      this.notGroupedList = this.notGroupedList.concat();
      this.parthsGroup = this.parthsGroup.concat();

    },
    // 鼠标移出文件
    leaveFile(item) {
      item.hover = false;
      this.notGroupedList = this.notGroupedList.concat();
      this.parthsGroup = this.parthsGroup.concat();
    },

    // 文件的选中状态发生改变
    everyFileCheckbox(val, item) {
      let x1,x2, indexs;
      if(val) {
        this.checkedList.push(item);
        // this.oneChecked = true;
        // x1 = this.notGroupedList.findIndex(ele => !ele.checked);
        // for(let x of this.parthsGroup) {
        //   x2 = x.fileList.findIndex(ele => !ele.checked);
        // }
        // if(x1 === -1 && x2 === -1) {
        //   this.fileCheckbox = true;
        // }

      }else {
        indexs = this.checkedList.findIndex(ele => ele.FilePkid === item.FilePkid);
        indexs !== -1 && (this.checkedList.splice(indexs, 1));
        // x1 = this.notGroupedList.findIndex(ele => ele.checked);
        // for(let x of this.parthsGroup) {
        //   x2 = x.fileList.findIndex(ele => ele.checked);
        // }
        // if(x1 !== -1 || x2 !== -1) {
        //   this.oneChecked = true;
        // }else {
        //   this.oneChecked = false;
        // }
        // this.fileCheckbox && (this.fileCheckbox = false);
      }
      this.notGroupedList = this.notGroupedList.concat();
      this.parthsGroup = this.parthsGroup.concat();
    },

    // 文件全选
    fileCheckboxAll(flag) {
      let val = false;
      if(this.fileLength && this.checkedFileList && (this.checkedFileList.length === this.fileLength)) {
        val = false;
      }else {
        val = true;
      }
      if(flag && flag === 'clear') { // 多选操作结束后，清空选中状态
        val = false;
      }

      if(!this.viewToggle) {
        this.$refs.otherView.fileCheckboxAll(val);
        return;
      }
      this.checkedList = [];
      if(val) {
        for(let y of this.notGroupedList) {
          y.checked = true;
          this.checkedList.push(y);
        }
        for(let x of this.parthsGroup) {
          for(let y of x.fileList) {
            y.checked = true;
            this.checkedList.push(y);

          }
        }
      }else {
        for(let y of this.notGroupedList) {
          y.checked = false;
        }
        for(let x of this.parthsGroup) {
          for(let y of x.fileList) {
            y.checked = false;
          }
        }
      }

      this.notGroupedList = this.notGroupedList.concat();
      this.parthsGroup = this.parthsGroup.concat();
    },

    //  多选移交
    multipleTransfer() {
      this.getTransferStageList();
      this.transferShow = true;
      this.operateType = 2; // 多个文件移交

    },

    // 取消文件移交
    transferCancel() {
      this.transferShow = false;
    },
    // 确认文件移交
    async transferSure(val, descText) {
      try {
        await !this.viewToggle && this.retrunData(false);
        const returnData = await this.transferSureProcessing(val, descText);
        await this.tranferSendHttp(returnData);
      }catch(err) {
        console.log('文件移交失败', err);
      }
    },
    // 确认移交时的数据处理
    transferSureProcessing(val, descText) {
      return new Promise((resolve, reject) => {
        this.transferShow = false;
        let arr = [[], []];
        if(this.operateType === 1) { // 单个文件
          arr[0] = [this.operateFile.FilePkid];
        }else if(this.operateType === 2) { // 多个文件
          for(let x of this.notGroupedList) {
            if(x.checked) {
              arr[0].push(x.FilePkid);
            }
          }
          for(let x of this.parthsGroup) {
            let haves = x.fileList.findIndex(ele => !ele.checked);
            if(haves === -1) {
              arr[1].push(x.pkid);
            }else {
              for(let y of x.fileList) {
                if(y.checked) {
                  arr[0].push(y.FilePkid);
                }
              }
            }
          }
        }else { // 组文件
          arr[1] = [this.filePartitionId];
        }
        resolve({val, arr, descText})
      });
    },

    // 移交时选择的阶段列表
    getTransferStageList() {
      this.transferStageList = [];
      this.transferDefaultStage = [];
      for (let x of this.stageList) {
          if(x.stageId != this.stageId) {
              this.transferStageList.push({
                  value: x.stageId,
                  label: x.stageTitle,
                  disabled: false
              });
          }
      }
      for(let i = 0; i < this.stageList.length; i++) {
        if(this.stageList[i].stageId == this.stageId && i < this.stageList.length - 1) {
          this.transferDefaultStage = [this.stageList[i + 1].stageId];
          return;
        } 
      }
    },
    // 移交时发送的请求
    /**
     * val 移交选择的分组
     * arr 要移交的文件ID arr[0]里是未分组的ID集合 arr[1]是分组的ID集合
     * descText 移交时的需求描述
     * **/
    tranferSendHttp(data) {
      let {val, arr, descText} = data;
      return new Promise((resolve) => {
          if(!arr[0].length && !arr[1].length && !descText) {
            this.$message({
              type: 'warning',
              message: '请选择交接文件或添加需求描述',
              center: true
            });
            return;
          }
          let obj = {
              projectId: this.projectId,
              oldstageId: this.stageId,
              stageId: val.join(','),
              taskId: this.taskId,
              descn: descText,
              groupIdVals: arr[1].join(','),
              fileIdVals: arr[0].join(','),
              myUserId: this.userId,
          }
          this.$HTTP('post', '/demand_add', obj).then(res => {
              this.$emit('handleSure');
              if(this.operateType === 2) {
                this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原
              } 
          }).catch(err => {
              console.log(err);
          });
      });
    },

    // 多选下载
    multipleDownload() {
      this.operateType = 2; // 多个文件移交
      this.fileDownlod();
    },
    // 多选收藏
    multipleCollect() {
      this.operateType = 2; // 多个文件移交
      this.fileCollect();
    },

    // 文件下载
    fileDownlod(item) {
      let link = "";
      if(this.operateType === 1) {
        link = $(
          '<a href="' +
            item.Url +
            '" download="' +
            item.FileName +
            '" target="_blank"></a>'
        );
        link.get(0).click();
      }else if (this.operateType === 2 && this.checkedFileList.length === 1) {
        link = $(
          '<a href="' +
            this.checkedFileList[0].Url +
            '" download="' +
            this.checkedFileList[0].FileName +
            '" target="_blank"></a>'
        );

        link.get(0).click();
        this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原

      } else {
        let ids = [];
        if(this.operateType === 2) {
          for(let x of this.checkedFileList) {
            ids.push(x.FilePkid);
          }
        }else if(this.operateType === 3) {
          ids.push(item.pkid);
        }
        // console.log(`/EggsWebService.asmx/zipFileDown?stageId=${this.stageId}&taskId=${this.taskId}&demandId=''&vals=${ids.join(',')}&type=${this.operateType - 1}`);
        link = $(
          `<a href="/EggsWebService.asmx/zipFileDown?stageId=${this.stageId}&taskId=${this.taskId}&demandId=''&vals=${ids.join(',')}&type=${this.operateType - 1}" download="....zip" target="_blank"></a>`
        );
        link.get(0).click();
        if(this.operateType === 2) {
          this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原
        } 
      }
    },

    // 文件收藏
    fileCollect(item) {
      let ids = [];
      if(this.operateType === 1) {
        ids = [item.FilePkid];
      }else if (this.operateType === 2 && this.checkedFileList.length === 1) {
        ids = [this.checkedFileList[0].FilePkid];
      } else if(this.operateType === 2 && this.checkedFileList.length > 1) {
        for(let x of this.checkedFileList) {
          ids.push(x.FilePkid);
        }
      }else if(this.operateType === 3) {
        ids.push(item.pkid);
      }
      let obj = {
        myUserId: this.userId,
        vale: ids.join(','),
        type: 1,
        idType: this.operateType === 3 ? 2 : 1,
        fatherId: this.dragItem.FilePkid ? this.personalFolder.folderId : 0,
        iLevel: this.dragItem.FilePkid ? this.personalFolder.iLevel : 1,
      };
      this.sendCollection(obj);
      
    },

    // 文件收藏请求及数据处理
    sendCollection(obj, type) {
      this.$HTTP('post', '/collections_add', obj).then(res => {
        if(res.code === '200') {
          this.$message({
            type: 'success',
            message: '文件收藏成功！',
            center: true
          });
        }
        let result = [...res.result];
        for(let y of result) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }
        if(!this.personalFilesShow) { return }
        if(type === 'dragCollect') {
          // this.personalFiles.push(...result);
        }else if(this.personalFolder.folderId === 0 && this.personalFolder.iLevel === 0) { // 正在'我的文档'文件夹页面
          let indexs = this.personalFiles.findIndex(ele => ele.FilePkid === 0);
          if(indexs !== -1) {
            this.personalFiles[indexs].SubfileCount += result.length;
          }
        }else if(this.personalFolder.folderId === 0 && this.personalFolder.iLevel === 1) { // 正在’我的收藏‘页面
          if(result.length === 1 && result[0].FileType === 12) {
            let x = this.personalFiles.findIndex(ele => ele.FileType !== 12);
            if(x === -1) {
              this.personalFiles.push(...result);
            }else {
              this.personalFiles.splice(x, 0, ...result);
            }
          }else {
            this.personalFiles.push(...result);
          }
          
        }
        if(Number(obj.type) === 1 && this.operateType === 2) {
          this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原
        }

        this.fileCheckboxSelf = false;
        this.personalFiles = this.personalFiles.concat();

      }).catch(err => {
        this.$message({
            type: 'error',
            message: '文件收藏失败！',
            center: true
          });
        console.log(err);
      });
    },


    // 文件拖拽---------------------------------start
    mouseMove() {
      console.log('///??????????//');
    },  
    // 文件移动时的回调函数
    fileMove(e, under) {
      /**
       * e.dragged 拖拽的元素
       * e.draggedContext 拖拽的元素的详情
       * e.draggedContext.element 拖拽的元素的内容
       * e.draggedContext.futureIndex / index 拖拽的元素的索引
       * e.to: 拖入区域
       * e.relatedContext: 拖入区域的上下文
       * **/

      // console.log("fileMove", this.dragItem.item.FileName);
      if (!this.dragItem.item.FileName) {
        const item = e.draggedContext.element;
        this.dragItem.item = Object.assign({}, item);
      }
    },
    // 文件开始移动时的回调函数
    dragStart(e, groupid, groupIndex) {
      this.dragFileId = $(e.item).attr("id");
      const filename = $(e.item).attr("filename");
      this.dragItem.fromGroup = $(e.from).attr("groupid");
      this.dragItem.groupIndex = groupIndex;
      this.dragItem.oldIndex = e.oldIndex;
      this.$nextTick(() => {
        const ele = $(`#${this.dragFileId}`);
        if (ele.attr("draggable") === "false") {
          ele.addClass("dragging");
        }
      });
      if(this.dragItem.fromGroup === 'personal') {
        this.personalFileCopy = JSON.parse(JSON.stringify(this.personalFiles));
        console.log(this.personalFileCopy);

      }
      // 临时添加的一个分组
      this.groupCommand('temporary');

      // console.log("dragStart----",  e.oldIndex);

      // 判断是否重复
      this.judegRepeat(groupid, filename);
    },
    // 文件结束移动时的回调函数
    async dragEnd(e) {
      // 当未分组之间的排序时，如果oldIndex > newIndex时，且中间相差不止一个的时候，顺序会错，有时候还不会成果，但在未分组里面没有这种问题 很奇怪
      this.dragItem.toGroup = $(e.to).attr("groupid");
      this.dragItem.newIndex = e.newIndex;

      const { fromGroup: from, toGroup: to, item, oldIndex, newIndex } = this.dragItem;
      // console.log('---', from, to, oldIndex, e.newIndex);

      if(from === to && oldIndex === newIndex) {
        this.dragEndInit();
        return;
      }

      if(to === 'new') { // 先新增一个分组，再添加文件
        let last = this.parthsGroup[this.parthsGroup.length - 1];
        this.addParth(last.groupName, last, this.dragItem);
      }
      if (to === "personal") { // from !== "personal" && 
        // 添加到个人文档--copy
        this.addToCollect(this.dragItem);
        this.dragEndInit();
        return;
      } else if (from === "personal" && to === "personal") {
        // 个人文档的文件排序
      } else if (from === "personal" && to !== "personal") {
        // 从个人文档添加到我的操作中--copy
        this.collectToGain(this.dragItem);
      } else if (from === "noGroup" && to === "noGroup") {
        // 未分组之间的拖拽
      } else if (from !== to) {
        // 移动--move
        let indexs = null;
        if (from === "noGroup") {
          indexs = this.notGroupedList.findIndex(x => x.FilePkid === item.FilePkid);

          indexs != -1 && this.notGroupedList.splice(indexs, 1);
        } else if (parseInt(from) !== NaN) {

          const id = parseInt(from);
          let ids = this.parthsGroup.findIndex(x => parseInt(x.pkid) === id);

          if (ids !== -1) {
            indexs = this.parthsGroup[ids].fileList.findIndex(
              x => x.FilePkid === item.FilePkid
            );
            indexs != -1 && this.parthsGroup[ids].fileList.splice(indexs, 1);
          }
        }
      }
      if(to !== 'new' && from !== "personal") {
        try { 
          await this.fileIsSort(e.newIndex, to);
        } catch(err) {
          console.log(err);
        }
      }
      if(from === to) {
        this.dragEndInit();
      }else {
        // console.log('--------', this.dragItem.groupIndex);
        try {
          await this.parthsGroupChange(e.newIndex);
          await this.dragEndInit();
        } catch(err) {
          console.log(err);
        }
        
      }
    },

    // 从个人文档拖拽文档到成果文件
    collectToGain(dragItem) {
      const { fromGroup: from, toGroup: to, item, oldIndex, newIndex } = dragItem;
      this.personalFiles = this.personalFileCopy.concat();
      // console.log(dragItem);
      let obj = {
        myUserId: this.userId,
        id: item.FilePkid,
        stageTaskId: this.stageTaskId,
        isSort: newIndex,
        filePartitionId: to === 'noGroup' ? 0 : to,
      };
      this.$HTTP('post', '/collections_move', obj).then(res => {
        console.log('添加文件成功', res);
        let result = Object.assign({}, res.result);
        let file1 = this.addFileAttr(result);
        result = Object.assign({}, result, file1);
        if(to === 'noGroup') {
          this.notGroupedList.splice(newIndex, 1, result);
        }else {
          let indexs = this.parthsGroup.findIndex(ele => ele.pkid == to);
          if(indexs !== -1) {
            this.parthsGroup[indexs].fileList.splice(newIndex, 1, result);
          }
        }
      }).catch(err => {
        console.log('添加文件失败',err);
      });
    },

    // 文件移动排序
    fileIsSort(newIndex, parthId, dragItem) {
      return new Promise((resolve, reject) => {
        let obj = {
          FilePkid: dragItem ? dragItem.item.FilePkid : this.dragItem.item.FilePkid,
          filePartitionId: parthId === 'noGroup' ? 0 : parthId,
          isSort: newIndex
        };
        this.$HTTP("post", "/stageTaskFile_group_update_isSort", obj)
          .then(res => {
            if(res.code === '200') {
              console.log("移动文件成功", res);
              resolve(true);
            }else {
              this.$message({
                type: 'error',
                message: '移动文件失败，请刷新重试',
                center: true
              });
              reject(res.msg);
            }
          })
          .catch(err => {
            console.log("移动文件失败", err);
            this.$message({
              type: 'error',
              message: '移动文件失败，请刷新重试',
              center: true
            });
            reject(false);

          });
        });
    },
    // 开始拖拽时判断是否有重复区域放置
    judegRepeat(groupid, filename) {
      let have = null;
      if (groupid === "personal") {
        have = this.notGroupedList.findIndex(x => x.FileName === filename);
        have !== -1 && (this.dragDisabled = true);
      } else {
        have = this.personalFiles.findIndex(x => x.FileName === filename);
        have !== -1 && (this.dragDisabled_personal = true);
      }

      for (let ele of this.parthsGroup) {
        let has = ele.fileList.findIndex(x => x.FileName === filename);
        if (ele.pkid.toString() === this.dragItem.fromGroup) {
          ele.border = true;
          ele.dragDisabled = false;
        } else if (has != -1) {
          ele.border = false;
          ele.dragDisabled = true;
        } else {
          ele.border = true;
          ele.dragDisabled = false;
        }
      }
      this.parthsGroup = this.parthsGroup.concat();
    },

    // 文件组：文件添加（从本地拖拽上传）/删除时对折叠/展开样式的影响
    groupFileChange(i) {
      this.$nextTick(() => {
        if(this.leftCenterFlag) { return; }
        let list = [...this.parthsGroup];
        let x = list[i];
        if (x.packUp === false) {
          this.countFileMore(i);
        } else if (x.packUp === null || x.packUp === true) {
          const h = $(".parths_group")
            .eq(i)
            .find(".group_file")
            .eq(0)
            .height();
          if (h > 220) { // 也有问题
            x.packUp = true;

          } else {
            x.packUp = null;
          }

        }
        this.parthsGroup = this.parthsGroup.concat();
      });
    },

    // 拖拽完成后parthsGroup数组改变后的展开/折叠属性
    parthsGroupChange(insertIndex) {
      this.$nextTick(() => {
        return new Promise(resolve => {
          let list = [...this.parthsGroup];
          for (let i = 0; i < list.length; i++) {
            let x = list[i];
            // 当前组的ID 拖拽到目的地组的ID
            if (x.pkid != this.dragItem.toGroup) {
              if(x.packUp === false) {
                this.countFileMore(i);
              } else {
              const h = $(".parths_group")
                .eq(i)
                .find(".group_file")
                .eq(0)
                .height();
              if (h > 220) { // 也有问题
                x.packUp = true;

              } else {
                x.packUp = null;
              }

            }
              continue;
            } else if (this.leftCenterFlag) {
              if (x.allList) {
                x.fileList.push(this.dragItem.item);
              }
              this.countFileOne(i);
            } else if (x.packUp === false) {
              x.fileList.splice(insertIndex + 1, 0, this.dragItem.item);
              this.countFileMore(i);
            } else if (x.packUp === null || x.packUp === true) {
              const h = $(".parths_group")
                .eq(i)
                .find(".group_file")
                .eq(0)
                .height();
              if (h > 220) { // 也有问题
                x.packUp = true;

              } else {
                x.packUp = null;
              }

            }
          }
          this.parthsGroup = [...list];
          // console.log(this.parthsGroup[0].fileList);
          resolve(true);
        });
      });
    },

    // 拖拽结束后初始化数据
    dragEndInit() {
      return new Promise(resolve => {
        $(".dragging")
          .eq(0)
          .removeClass("dragging");
        this.dragFileId = null;
        this.dragItem = {
          item: {},
          fromGroup: null,
          toGroup: null
        };
        // this.dragItem = {};
        this.dragDisabled = false;
        this.dragDisabled_personal = false;
        for (let ele of this.parthsGroup) {
          ele.border = false;
          ele.dragDisabled = false;
        }
        if (!this.parthsGroup[this.parthsGroup.length - 1].fileList.length) {
          this.parthsGroup.pop();
        } else {
          delete this.parthsGroup[this.parthsGroup.length - 1].temporary;
        }
        resolve(true);
      });
    },

    // 窗口/元素大小变化对文件分组收起时的影响
    sizeChange(desc) {
      for(let i = 0; i < this.parthsGroup.length; i++) {
        let x = this.parthsGroup[i];
        if(desc && desc === 'personalFilesPull') {
          if(this.personalFilesShow) { // 个人文档显示
            this.countFileView(i, x.packUp, true);
          }else { // 个人文档不显示
            this.countFileView(i, x.packUp, false);
          }
        }else {
          if(x.packUp === false) { // 折叠
            this.countFileMore(i);
          }
        }
        
      }


      // 当个人文档从不显示-->显示的时候，
        // 如果flag === true 继续为true
        // 如果flag === false （半折叠状态）重新计算要折叠剩余的个数
        // 如果flag === null 计算现在一行还能展示下吗 如果展示不下的话，让flag = true
      // 当个人文档从显示-->不显示的时候，
        // 如果flag === true 重新计算个人文件收起时一行还能展示下吗：可以的话让flag = null；否则 flag还是true
        // 如果flag === false （半折叠状态）重新计算一行还能展示下吗：可以的话让flag = null；否则 flag还是false，但折叠的个数需改变
        // 如果flag === null 不需要操作
    },
    // 文件拖拽---------------------------------end



    // 个人文档的操作---------------------------------start
    // 是否显示个人文件
    personalFilesPull() {
      this.personalFilesShow = !this.personalFilesShow;
      if (this.personalFilesShow) {
        $("#personalFiles").show();
        $('#operateFile').addClass('self_file_show');
        this.getPersonalFile(); // 获取个人文档列表

      } else {
        $("#personalFiles").hide();
        $('#operateFile').removeClass('self_file_show');
        if(this.inputTextShow2) {
          this.inputTextShow2 = false;
          this.inputText = '';
        }
        this.fileCheckboxAllSelf(false); // 多选操作完成后把选中状态还原
      }
      this.sizeChange('personalFilesPull');
      if(!this.demandOrGain) {
        this.$nextTick(() => {
          this.$refs.demandView.sizeChange();
        }); 
        
      }
      
    },

    // 双击文件夹
    dbFolder(file) {
      if (file.FileType !== 12) {
        return;
      }
      this.getPersonalFile(file);
      this.fileCheckboxAllSelf(false); // 多选操作完成后把选中状态还原
    },
    // 返回上一级
    goBack(index) {
      if (index === this.navBar.length - 1) {
        return;
      }
      this.personalFolder.folderId = this.navBar[index].folderId;
      this.personalFolder.iLevel = index;
      if(index === 0) {
        this.navBar = [{ id: 0, folderId: 0,name: "个人文档" }];
      }else {
        this.personalFolder.iLevel = index;
        this.navBar = this.navBar.splice(0, index + 1);
      }
      this.getPersonalFile();
      this.fileCheckboxAllSelf(false); // 多选操作完成后把选中状态还原

    },

    // 点击新建文件夹
    newFolder() {
      let title = '新建文件夹';
      let repeat = this.personalFiles.findIndex(ele => ele.FileName === title);
      if(repeat !== -1) { // 文件名重复
        let repeatNum = [];
        for(let x of this.personalFiles) {
          let y = 0;
          if(x.FileName.indexOf('新建文件夹') !== -1 && x.FileName.length > 6) {
            y = x.FileName.slice(6);
            y = parseInt(y);
            repeatNum.push(y);
          }
        }
        if(repeatNum.length) {
          repeatNum.sort();
          title = title + ' ' + (repeatNum[repeatNum.length - 1] + 1);
        } else {
          title = title + ' ' + 1;
        }
      }
      let obj = {
          Count: 0,
          FilePkid: 'folder' + this.personalFiles.length,
          FileName: title,
          FileTitle: title,
          UrlMin: null,
          FileType: 12,
          UrlMin: this.fileTypeImg[12].src,
          userName: null,
          Type: "folder",
          edit: true,
          createdFolder: true
        };
      let x = this.personalFiles.findIndex(ele => ele.FileType !== 12);
      if(x === -1) {
        this.personalFiles.push(obj);
      }else {
        this.personalFiles.splice(x, 0, obj);
      }
      this.editFocus('#fileNameEdit');
    },
    // 个人文档的文件（夹）的更多操作
    personalFileCommand(type, index, item) {
      this.operatePersonalFile = Object.assign({}, item, {index: index});
      this.operateType = 1;
      if(type === 'download') { // 下载
        this.fileDownlod1(item);
        return;
      }
     
      if(type === 'rename') { // 重命名
        item.edit = true;
        this.fileNameCopy = item.FileTitle;
        this.personalFiles = this.personalFiles.concat();
        this.editFocus('#fileNameEdit');
        return;
      }
      if(type === 'delete') { // 删除
        this.delFileFlag1 = true;
        this.reminderText = `您确定要删除该文件${item.FileType === 12 ? '夹' : ''}吗？`;
        return;
      }
    },

    // 添加/修改文件夹失去焦点--保存
    personalFileBlur(e, file, index, flag) {
      if(this.enterEdit) {
        return;
      }
      const newTitle = file.FileType === 12 ? file.FileTitle : file.FileTitle + '.' + file.Type;
      if(file.FileTitle == '') {
        this.$message({
          type: 'warning',
          message: `文件${file.FileType === 12 ? '夹' : ''}名不能为空！`,
          center: true
        });
        this.editFocus('#fileNameEdit', false);
        return;
      }
      
      let repeat = this.personalFiles.findIndex(ele => (ele.FileName === newTitle && ele.Type === file.Type && ele.FilePkid !== file.FilePkid));
      if(repeat !== -1) {
        this.$message({
          type: 'warning',
          message: `该目录下已含有同名文件${file.FileType === 12 ? '夹' : ''}！`,
          center: true
        });
        this.editFocus('#fileNameEdit', false);
        return;
      }
      if(file.createdFolder) { // 新建
        // 发送请求---新建文件夹
        let obj = {
          myUserId: this.userId,
          fatherId: this.personalFolder.folderId,
          iLevel: this.personalFolder.iLevel,
          title: file.FileTitle,
        };
        this.$HTTP('post', '/persona_add', obj).then(res => {
          console.log('创建文件夹成功', res);
          let result = res.result;
          let returnObj = this.addFileAttr(result);
          result = Object.assign(result, returnObj);
          this.personalFiles.splice(index, 1, result);
        }).catch(err => {
          console.log('创建文件夹失败', err);
        });
      }else { // 编辑
        // 发送修改文件名的接口
        if(this.fileNameCopy !== file.FileTitle) {
          let obj = {
            FilePkid: file.FilePkid,
            newTitle: newTitle
          };
          this.$HTTP('post', '/persona_update', obj).then(res => {
            console.log(`文件${file.FileType === 12 ? '夹' : ''}名修改成功`, res);
            this.$message({
              type: 'success',
              message: '修改文件名成功',
              center: true
            });
          }).catch(err => {
            console.log('修改文件名失败', err);
          });
        }
        file.FileName = newTitle;
        file.edit = false;
        this.personalFiles = this.personalFiles.concat();
      }
      if(flag) {
        this.enterEdit = true;
      }
    },
 
    // 取消删除文件
    delFileCancel1() {
      this.delFileFlag1 = false;

    },
    // 确认删除文件
    delFileSure1() {
      this.delFileFlag1 = false;
      const { FilePkid, index } = this.operatePersonalFile;
      let ids = [];
      if(this.operateType === 2) {
        for(let x of this.checkedListSelf) {
          if(x.FilePkid !== -1 && x.FilePkid !== 0) {
            ids.push(x.FilePkid);
          }
        }
      }
      let obj = {
        FilePkid: ids.length ? ids.join(',') : FilePkid
      };
      this.$HTTP('post', '/persona_delete', obj).then(res => {
        // console.log('删除文件成功', res, this.operatePersonalFile);
        if(this.operateType === 2) {
          for(let x of ids) {
            let indexs = this.personalFiles.findIndex(ele => ele.FilePkid === x);
            indexs !== -1 && this.personalFiles.splice(indexs, 1);
          }
          this.fileCheckboxAllSelf(false);
        }else {
          if(this.operatePersonalFile.checked) {
            const indexs = this.checkedListSelf.findIndex(ele => ele.FilePkid === FilePkid);
            indexs !== -1 && this.checkedListSelf.splice(indexs, 1);
          }
          this.personalFiles.splice(index, 1);
        }
        this.personalFiles = this.personalFiles.concat();
      }).catch(err => {
        console.log('删除文件失败', err);
      });
    },

    // 个人文档--鼠标移入文件
    enterFileSelf(item) {
      item.hover = true;
      this.personalFiles = this.personalFiles.concat();
    },
    // 个人文档--鼠标移出文件
    leaveFileSelf(item) {
      item.hover = false;
      this.personalFiles = this.personalFiles.concat();

    },
    // 个人文档--文件的选中状态发生改变
    everyFileCheckboxSelf(val, item) {
      let x1, indexs;
      if(val) {
        this.oneCheckedSelf = true;
        this.checkedListSelf.push(item);

        x1 = this.personalFiles.findIndex(ele => !ele.hasOwnProperty('children') && !ele.checked);
        if(x1 === -1) {
          this.fileCheckboxSelf = true;
        }

      }else {
        indexs = this.checkedListSelf.findIndex(ele => !ele.hasOwnProperty('children') && ele.FilePkid === item.FilePkid);
        indexs !== -1 && (this.checkedListSelf.splice(indexs, 1));
        x1 = this.personalFiles.findIndex(ele => ele.checked);
        if(x1 !== -1) {
          this.oneCheckedSelf = true;
        }else {
          this.oneCheckedSelf = false;
        }
        this.fileCheckboxSelf && (this.fileCheckboxSelf = false);
      }
      this.personalFiles = this.personalFiles.concat();
    },

    // 个人文档--文件全选
    fileCheckboxAllSelf(val) {
      this.checkedListSelf = [];
      if(val) {
        for(let y of this.personalFiles) {
          y.checked = true
          this.checkedListSelf.push(y);
        }
        this.oneCheckedSelf = true;
      }else {
        for(let y of this.personalFiles) {
          y.checked = false
        }
        this.oneCheckedSelf = false;
        this.fileCheckboxSelf = false;
      }
      this.personalFiles = this.personalFiles.concat();
    },

    // 多选下载
    multipleDownload1() {
      this.operateType = 2; // 多个文件移交
      this.fileDownlod1();
    },

    // 多选删除
    multipleDel() {
      this.operateType = 2;
      this.delFileFlag1 = true;
      let ids = [];
      for(let x of this.checkedListSelf) {
        ids.push(x.FilePkid);
      }
      if(ids.includes(-1) || ids.includes(0)) {
        this.reminderText = '默认文件夹无法删除，其他选中文件（夹）将被删除';
      }else {
        this.reminderText = '您选中的文件（夹）将从个人文档中删除';
      }
    },


    // 个人文档文件下载
    fileDownlod1(item) {
      let link = "";
      if(this.operateType === 1 && item.FileType !== 12) {
        link = $(
          '<a href="' +
            item.Url +
            '" download="' +
            item.FileName +
            '" target="_blank"></a>'
        );
        link.get(0).click();
      }else if (this.operateType === 2 && this.checkedListSelf.length === 1 && this.checkedListSelf[0].FileType !== 12) {
        link = $(
          '<a href="' +
            this.checkedListSelf[0].Url +
            '" download="' +
            this.checkedListSelf[0].FileName +
            '" target="_blank"></a>'
        );

        link.get(0).click();
        this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原

      } else {
        let ids = [];
        if(this.operateType === 1) {
          ids.push(item.pkid);
        }else if(this.operateType === 2) {
          for(let x of this.checkedListSelf) {
            ids.push(x.FilePkid); // 包含文件和文件夹
          }
        }
        link = $(
          `<a href="/EggsWebService.asmx/zipFileDown?stageId=${this.stageId}&taskId=${this.taskId}&demandId=''&vals=${ids.join(',')}&type=${this.operateType - 1}" download="....zip" target="_blank"></a>`
        );
        // link.get(0).click();
        if(this.operateType === 2) {
          this.fileCheckboxAllSelf(false); // 多选操作完成后把选中状态还原
        } 
      }
    },
    // 拖拽加入收藏
    addToCollect(dragItem) {
      const { fromGroup: from, toGroup: to, item, oldIndex, newIndex } = dragItem;
      // console.log('addToCollect---',from, to, oldIndex, newIndex, dragItem);
      let obj = {
        myUserId: this.userId,
        vale: item.FilePkid,
        type: 1,
        idType: 1,
        fatherId: item.FilePkid ? this.personalFolder.folderId : 0,
        iLevel: item.FilePkid ? this.personalFolder.iLevel : 1,
      };
      this.personalFiles.push(item);
      this.sendCollection(obj, 'dragCollect');
    },
    dragAdd(e) {
      this.personalFiles.splice(e.newIndex, 1);
    },
    // 个人文档的操作--------------------------------end




    // 文件上传--------------------------------start
    // 文件上传成果对数据的处理
    self_uploadSuccess(res,  _file) {
      let file = Object.assign({}, _file.response.result);
      let file1 = this.addFileAttr(file);
      file1 = Object.assign({}, file, file1);
      if(this.uploadFrom >= 5) { // 个人文档
        this.fileCheckboxSelf = false;
        this.personalFiles = this.personalFiles.concat(file1); 
        return;
      }
      let id = this.filePartitionId;
      // console.log('----', file1);
      if(id) { // 分组
        let ids = this.parthsGroup.findIndex(ele => ele.pkid === id);
        this.parthsGroup[ids].fileList = this.parthsGroup[ids].fileList.concat(file1);
        this.groupFileChange(ids); 
      }else { // 未分组
        this.notGroupedList = this.notGroupedList.concat(file1); 
      }
    },
    
    parthDragEnter(id) {
      if(id === 'personal') {
        this.uploadFrom = 6;
        return;
      }
      this.filePartitionId = id;
      if(id) {
        this.uploadFrom = 4;
      }else {
        this.uploadFrom = 2;
      }
    },
    // 当前点击的是哪个分组的上传
    handleClickUpload(groupId) {
      if(groupId === 'personal') {
        this.uploadFrom = 5;
        return;
      }
      this.filePartitionId = groupId;
      if(groupId) {
        this.uploadFrom = 3;
      }else {
        this.uploadFrom = 1;
      }
      if(!this.viewToggle) { // 列表视图
       this.retrunData(false);
      }
    },
    // 关闭文件上传视图
    closeProgress() {
      this.uploadProgressFlag = false;
      this.fileProgressList = [];
    },

    // 取消上传
    cancelUpload(file) {
      this.getDelFile(file.uid, true);
      if(file.error) { return; }
      if (file.reUploadXhr) {
        file.reUploadXhr.abort();
      } else {
        this.$nextTick(() => {
          if(Array.isArray(this.$refs.fileUpload)) {
            this.$refs.fileUpload[0].abort(file);
          }else {
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
        if(Array.isArray(this.$refs.fileUpload)) {
          this.$refs.fileUpload[0].httpRequest = this.uploadFile(formData, file);
        }else {
          this.$refs.fileUpload.httpRequest = this.uploadFile(formData, file);
        }
      });

    },
    // 重新上传的请求
    uploadFile(formData, file) {
      let _ = this;
      file.reUploadXhr = $.ajax({
        url:`/ProjectFile.ashx?myUserId${this.userId}&projectId=${this.projectId}&stageTaskId=${this.stageTaskId}&filePartitionId=${this.filePartitionId}`,
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
      this.$message({
        type: 'warning',
        message: '最多只能选择9个文件',
        center: true
      });
    },
    // 文件上传前
    beforeUpload(file) {
      // console.log('--before', file);
      if (!this.uploadProgressFlag) {
        this.uploadProgressFlag = true;
      }
      const id = this.filePartitionId;
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
      // 判重--该目录下已包含同名文件
      if(this.uploadFrom >= 5) { // 个人文档
        let index = this.personalFiles.findIndex(ele => {
          return ele.FileName == file.name;
        });
        if (index !== -1) {
          this.$set(obj, 'error', 1);
          this.fileProgressList.unshift(obj);
          this.$message({
            type: 'error',
            message: '该目录下已含有同名文件',
            center: true
          });
          return false;
        }
      }else if(id) { // 分组
        let ids = this.parthsGroup.findIndex(ele => ele.pkid === id);
        let index = this.parthsGroup[ids].fileList.findIndex(ele => {
          return ele.FileName == file.name;
        });
        if (index !== -1) {
          this.$set(obj, 'error', 1);
          this.fileProgressList.unshift(obj);
          this.$message.error("该分组下已含有同名文件");
          return false; // 只写return不能阻止文件继续上传
        }
      }else { // 未分组
        let index = this.notGroupedList.findIndex(ele => {
          return ele.FileName == file.name;
        });
        if (index !== -1) {
          this.$set(obj, 'error', 1);
          this.fileProgressList.unshift(obj);
          this.$message.error("该分组下已含有同名文件");
          return false;
        }
      }
      // 文件过大--文件大于1G，无法上传
      const _size = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      if(_size >= 1) {
        this.$set(obj, 'error', 2);
        this.fileProgressList.unshift(obj);
        this.$message({
          type: 'error',
          message: '文件大于1G，无法上传',
          center: true
        });
        return false;
      }
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
        // if (percents > 30 && percents < 35) {
        //   if (file.reUploadXhr) {
        //     file.reUploadXhr.abort();
        //     file.reUploadXhr = null;
        //   } else {
        //     this.$refs.fileUpload.abort(file);
        //   }
        //   this.uploadError('err', file);
        // }

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
      // 文件上传成果对数据的处理
      this.self_uploadSuccess(res,  _file);
      
      let ids = this.fileProgressList.findIndex(ele => {
        return ele.uid === _file.uid;
      });
      if (ids !== -1) {
        this.fileProgressList[ids].status = 2;
      }
      let returns = this.popFileProgress(this.fileProgressList);
      if (this.uploadProgressFlag && returns) {
        setTimeout(() => {
          this.closeProgress();
          // 暂时解决两次上传时文件个数大于9个的bug
          if(Array.isArray(this.$refs.fileUpload)) {
            this.$refs.fileUpload[0].clearFiles();
          }else {
            this.$refs.fileUpload.clearFiles();
          }
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


    // 获取数据及处理--------------------------------start
    // 获取个人文档列表
    getPersonalFile(file) {
      let obj = {
        myUserId: this.userId,
        fatherId: file ? file.FilePkid : 0,
        iLevel:  file ? this.personalFolder.iLevel + 1 : this.personalFolder.iLevel,
      };
      this.$HTTP('post', '/persona_get_list', obj, $('#personalFiles')[0]).then(res => {
        let result = Object.assign({}, res.result);
        this.personalFiles = result.fileItemList;
        this.personalFolder.folderId = result.fatherId;
        this.personalFolder.iLevel = result.iLevel;
        this.personalFolder.fatherName = result.fatherName;
        for(let y of this.personalFiles) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }
        if(file && result.iLevel) {
          this.navBar.push({ 
            id: this.personalFolder.iLevel, 
            folderId: this.personalFolder.folderId, 
            name: this.personalFolder.fatherName });
        }
        console.log('---getPersonalFile',this.personalFolder, this.navBar, this.personalFiles);
      }).catch(err => {
        console.log(err);
      });
    },

    // 修改状态/人员/时间 更新stageinfo
    stageInfoChange(type, info) {
      let indexs = this.stageList.findIndex(ele => ele.stageId.toString() === info.item.stageId.toString());
      let self = -1;
      if(indexs !== -1) {
        this.stageList.splice(indexs, 1, info.item);
        this.stageList = this.stageList.concat();
      }
      if(type === 1) { // 人员改变
        if(info.add.length) {
          self = info.add.findIndex(ele => ele.toString() === this.userId.toString());
          if(self !== -1) {
            this.stageInfo.isMyParticipate = true;
            this.POWER_CHANGE(1); // 设置权限
          }
        }
        if(info.del.length) {
          self = info.del.findIndex(ele => ele.toString() === this.userId.toString());
          if(self !== -1) {
            this.stageInfo.isMyParticipate = false;
            this.POWER_CHANGE(0); // 设置权限
          }
        }
      }else { // 时间改变

      }
      // console.log('stageInfoChange----', type, info, indexs, this.stageList[indexs].state);
      this.STAGEINFO_CHANGE(this.stageInfo);

    },

    // 获取任务列表
    getTaskList(params) {
      let obj = {
        project: params
      };
      this.$HTTP("post", "/project_get_Catalog", obj, $('#app')[0])
        .then(res => {
          this.tasksList = res.result;
          for (let y of this.tasksList) {
            y.extend = true;
          }
          // console.log("获取任务列表", this.tasksList);
          this.taskStageDetail(this.taskId ,this.stageId);
        })
        .catch(err => {
          console.log("获取任务列表失败", err);
          this.$message({
            type: 'error',
            message: '获取任务列表失败，请检查网络',
            center: true
          });
        });
    },

    // 任务/阶段--详情
    taskStageDetail(taskId, stageId) {
      return new Promise(() => {
        this.initData(); // 初始化数据
        this.taskId = taskId;
        this.stageId = stageId;
        let params = {
          projectId: this.projectId, 
          stageId: this.stageId, 
          taskId: this.taskId
        }
        localStorage.setItem('getTaskIds', JSON.stringify(params));
        let obj = {
          myUserId: this.userId,
          projectId: this.projectId,
          stageId: this.stageId,
          taskId: this.taskId,
        }
        this.$HTTP("post", "/stagetask_get", obj, $('#app')[0])
        .then(res => {
          this.dataProcessing(res.result);
          // console.log("获取任务详情", res.result);

        })
        .catch(err => {
          console.log("获取任务详情失败", err);
          this.$message({
            type: 'error',
            message: '获取任务详情失败，请检查网络',
            center: true
          });
        });
      });
    },
    // 详情切换时初始化数据
    initData() {
      if(this.fullPreviewShow) {
        this.fullPreviewShow = false;
      }
      if(!this.demandOrGain) {
        this.demandOrGain = true;
      }
      if(!this.leftCenterFlag) {
        this.leftRightToggle();
      }
      if(!this.viewToggle) {
        this.viewToggle = true;
      }
      this.checkedList = [];
      this.FILELENGTH_CHANGE(0);
    },
    // 对获取的数据进行处理
    dataProcessing(res) {
      this.stageInfo = null;
      this.stageInfo = Object.assign({}, res, {stageId: this.stageId});
      this.parthsGroup = [];
      this.demandCount = res.demandCount;
      this.stageTaskId = res.stageTaskId;
      this.stageList = [...res.stageList];
      this.stageList.map(ele => ele.stageId = ele.stageId.toString());
      let x = this.stageList.findIndex(ele => ele.stageId == this.stageId);
      if(x !== -1) {
        this.stageState = this.stageList[x].state;
      }

      let returnList = [...res.fileList]
      for(let ele of returnList) {
        for(let y of ele.fileList) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }
        if(ele.pkid === 0) {
          this.notGroupedList = ele.fileList;
        }else {
          this.parthsGroup.push(ele);
        }
      }
      this.stageInfo.fileList = returnList.concat();
      this.$nextTick(() => {
        this.$refs.stageManage && this.$refs.stageManage.setData(this.stageInfo);
      });
      this.countFileOne();
      this.idList = null;
      this.idList = {
        userId: this.userId,
        projectId: this.projectId,
        stageId: this.stageId,
        taskId: this.taskId,
        stageTaskId: this.stageTaskId,
        filePartitionId: this.filePartitionId
      }
      this.TASKIDS_CHANGE(this.idList); // ids集合改变
      this.STAGEINFO_CHANGE(this.stageInfo);
      let statePower = 0;
      if(res.isMyParticipate) {
        statePower = 1;
      }else {
        statePower = 0;
      }
      this.POWER_CHANGE(statePower); // 设置权限

      // console.log("获取任务详情");

    },
    // 添加文件时，对文件的属性进行处理
    addFileAttr(obj) {
      let len = obj.Type.length;
      let title = obj.Type === 'folder' ? obj.FileName : obj.FileName.slice(0, obj.FileName.length - (len + 1));
      let data = {
        checked: false,
        hover: false,
        edit: false,
        FileTitle: title,
        FileType: this.getFlieTyle(obj.Type),
        isOwn: obj.UserPkid.toString() === this.userId.toString() ? true : false,
        formatTime: this.format(new Date(obj.CreateTime), 'yyyy/MM/dd HH:mm')
      }
      if (data.FileType !== 1) {
        data.UrlMin = this.fileTypeImg[data.FileType].src;
      }
      if(data.FileType !== 12) {
        data.Size = this.conver(obj.Size);
      }
      return data;
    },

    // 分组+未分组列表
    getFileList() {
      return new Promise((resolve) => {
        let arrList = [
          {
            pkid: 0,
            groupName: "未分组的任务",
            fileList: this.notGroupedList
          }
        ];
        arrList = arrList.concat(this.parthsGroup);
        this.allFileList = arrList;
        resolve(arrList);
      });
    },
    // 获取数据及处理--------------------------------end



    
  },
  created() {
    let params = this.$route.params;
    if(params.projectId) {
      localStorage.setItem('getTaskIds', JSON.stringify(params));
    }else {
      params = JSON.parse(localStorage.getItem('getTaskIds'));
    }
    this.projectId = params.projectId;
    this.stageId = params.stageId;
    this.taskId = params.taskId;
    this.getTaskList(this.projectId); // 获取任务列表
    
  },
  mounted() {
    let _ = this;
    // 监听窗口变化
    window.onresize = () => {
      this.sizeChange();
    }
  }
};
</script>
<style lang='less'>
@import "./style/index.less";
</style>


