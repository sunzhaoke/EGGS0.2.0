<template>
    <div class='task_detail_yun'>
      <!-- 头部阶段 -->
      <div class="detail_top">
          <div class="project_name">{{projectItem.title}}</div>
          <!-- state=1(一开始) state=2(一完成) state=3(一未开始) state=4(一进行中) state=5(一已超时) state=6(一已关闭)  -->
          <div class="stage_list">
            <el-tabs v-model="stageId" @tab-click="taskStageDetail(taskId, stageId)">
              <el-tab-pane 
                v-for='stage in stageList'
                :key='stage.stageId'
                :label="stage.stageTitle" 
                :name="stage.stageId"
                >
                  <span slot="label">
                    <span class="round">
                      <img v-if='stage.state === 1' src="./style/state_icon/state1.png" alt="">
                      <img v-else-if='stage.state === 2' src="./style/state_icon/state2.png" alt="">
                      <img v-else-if='stage.state === 3' src="./style/state_icon/state3.png" alt="">
                      <img v-else-if='stage.state === 4' src="./style/state_icon/state4.png" alt="">
                      <img v-else-if='stage.state === 5' src="./style/state_icon/state5.png" alt="">
                      <img v-else-if='stage.state === 6' src="./style/state_icon/state6.png" alt="">
                    </span>
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
          <!-- 头部操作按钮 -->
          <div class="top_operate">
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
                :info='stageInfo'
                :ids='idList'
              />
              <span class="line"></span>
              <!-- 加人 -->
              <span class="add_human" @click.stop='addHumanHandle'>
                <el-tooltip effect="dark" content="添加成员" placement="top" :open-delay="300">
                  <i class='iconfont icon-haoyou1'></i>
                </el-tooltip>
                <add-human
                  v-if='addHumanShow'
                  :defaultList='stageList'
                  :ids='idList'
                />
              </span>
              <!-- 加时间 -->
              <span class="add_time" @click.stop='addTimeHandle'>
                 <el-tooltip effect="dark" content="添加时间" placement="top" :open-delay="300">
                  <i class='iconfont icon-rili1'></i>
                </el-tooltip>
                <add-time
                  v-if='addTimeShow'
                   :defaultList='stageList'
                  :ids='idList'
                />
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
                      <el-dropdown v-if='power' placement="bottom">
                        <span class="el-dropdown-link">
                          <i class='iconfont icon-shangchuan'></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="handleClickUpload(0)"
                          >
                            <el-upload 
                              :ref="filePartitionId === 0 ? 'fileUpload' : ''"
                              class="upload_file"
                              :action="'/ProjectFile.ashx?&myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
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
                            <i class="iconfont icon-shoucang1"></i>
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
                    {{power}}
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
                      @click.stop='() => {}'
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
                      <button class="main_button_bg fr" @click="inputTextSure('left')">添加</button>
                      <button class="main_button fr" @click="inputTextCancel('left')">取消</button>
                    </div>
                  </div>
                  <div v-if='viewToggle' class="view">
                    <!-- 左侧未分组 -->
                    <div id="leftBox" class="left_box">
                      <div v-if='(notGroupedList && notGroupedList.length) || dragItem.fromGroup' class="left_file_list">
                          <draggable
                              class='draggable'
                              groupid='noGroup'
                              v-model="notGroupedList"
                              :options="{
                                group:{name: 'file',pull: 'clone'}, 
                                ghostClass: 'ghost_file', 
                                dragClass: 'drag_file',
                                chosenClass: 'chosen_file',
                                disabled: dragDisabled
                              }"
                              :move='fileMove'
                              @start='dragStart($event, "noGroup")'
                              @end='dragEnd'
                          >
                              <div 
                                  class="every_file"
                                  v-for="(ele, index) in notGroupedList"
                                  :key="ele.FilePkid"
                                  :id='ele.FilePkid'
                                  :filename='ele.FileName'
                                  @mouseenter="enterFile(ele)"
                                  @mouseleave="leaveFile(ele)"
                                  >
                                  <span class="file_pic">
                                    <template v-if='ele.FileType === 11'>
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
                                    <span class="fixed file_checkbox" v-if='oneChecked || ele.hover'>
                                      <el-checkbox v-model="ele.checked" @change="everyFileCheckbox($event, ele)"></el-checkbox>
                                    </span>
                                    <el-dropdown class="fixed file_more">
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
                      <template v-else>
                        <el-upload
                          v-if='power'
                          class="file_empty_upload"
                          drag
                          :action="'/ProjectFile.ashx?&myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
                          :show-file-list="false"
                          :multiple="true"
                          :on-error="uploadError"
                          :on-success="uploadSuccess"
                          :on-progress="uploadProgress"
                          :limit="9"
                          :on-exceed="handleExceed"
                          :before-upload="beforeUpload"
                          >
                          <div class="file_empty">
                            <div class="empty_img">
                              <img src="./style/file_empty.png" alt="">
                            </div>
                            <p class="title">文件拖到此区域即可上传，支持批量上传</p>
                          </div>
                        </el-upload>
                        <div class="file_empty" v-else>
                            <div class="empty_img">
                              <img src="./style/file_empty.png" alt="">
                            </div>
                            <p class="title">暂无文件</p>
                          </div>
                      </template>
                    </div>
                    <!-- 右侧分组 -->
                    <div id="rightBox" class="right_box">
                        <div v-if='(parthsGroup && parthsGroup.length) || dragItem.fromGroup' class="parths">
                          <p class="mainColor_underline_text go_back_sort" v-if='groupSortFlag' @click='backParthSort'>退出分组排序</p>
                          <template v-if='groupSortFlag'>
                            <draggable
                            v-model="parthsGroup"
                            :options="{ghostClass: 'ghost_parth_sort', dragClass: 'drag_parth_sort'}"
                            @end='dragEndParth'
                            >
                              <div 
                                class="parths_group is_sort"
                                v-for="group in parthsGroup"
                                :key="group.pkid"
                                :ids="group.pkid"
                                >
                                <i class="iconfont icon-paixu"></i>
                                <span class="group_name">{{group.groupName}}</span>
                              </div>
                            </draggable>
                          </template>
                          <template v-else>
                            <div 
                              class="parths_group"
                              v-for="(group, index) in parthsGroup"
                              :key="group.pkid"
                              >
                              <!-- 分组的头部操作 -->
                              <div class="group_top">
                                  <span v-if='!group.edit' class="group_name">{{group.groupName}}</span>
                                    <input 
                                      v-else 
                                      :ref="group.createdGroup || group.edit ? 'createdGroup' : ''" 
                                      class="group_name edit" 
                                      type="text" 
                                      v-model='group.groupName'
                                      @blur='groupTitleBlur(group)'
                                      />
                                  <div class="group_operate">
                                    <span 
                                      v-if='group.packUp' 
                                      @click='groupExtendToggle(index, true)'
                                      class='mainColor_underline_text'
                                      >收起</span>{{group.packUp}}
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
                                              :ref="filePartitionId === group.pkid ? 'fileUpload' : ''"
                                              class="upload_file"
                                              :action="'/ProjectFile.ashx?&myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+filePartitionId"
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
                                class="group_file"
                                :class="dragItem && dragItem.fromGroup ? (group.border ? 'drag_in' : 'drag_dis') : ''"
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.allList"
                                  :options="{
                                    group:{name: 'file',pull:'clone'},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    draggable: '.draged',
                                    disabled: group.dragDisabled
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid)'
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

                                    </div>
                                  </template>
                                  <div class="null"></div>
                                </draggable>
                              </div>

                              <!-- 折叠成一行的时候 -->
                              <div 
                                v-else-if='group.overList'
                                :key="group.pkid"
                                class="group_file"
                                :class="dragItem && dragItem.fromGroup ? (group.border ? 'drag_in' : 'drag_dis') : ''"
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.overList"
                                  :options="{
                                    group:{name: 'file',pull:'clone'},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    draggable: '.draged',
                                    disabled: group.dragDisabled
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid)'
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
                                      @click='groupExtendToggle(index, item)'
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
                                          <template v-if='item.FileType === 11'>
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
                                          <span class="fixed file_checkbox" v-if='oneChecked || item.hover'>
                                            <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item)"></el-checkbox>
                                          </span>
                                          <el-dropdown class="fixed file_more">
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
                                :class="dragItem && dragItem.fromGroup ? (group.border ? (group.fileList.length ? 'group_border' : 'drag_in') : 'drag_dis') : (group.fileList.length ? '' : 'parths_empty')"
                                >
                                <draggable
                                  class="draggable"
                                  :groupid='group.pkid'
                                  v-model="group.fileList"
                                  :options="{
                                    group:{name: 'file',pull:'clone'},
                                    ghostClass: 'ghost_file', 
                                    dragClass: 'drag_file',
                                    draggable: '.draged',
                                    disabled: group.dragDisabled
                                  }"
                                  :move='fileMove'
                                  @start='dragStart($event, group.pkid)'
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
                                    >
                                    <span class="file_pic">
                                      <template v-if='item.FileType === 11'>
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
                                      <span class="fixed file_checkbox" v-if='oneChecked || item.hover'>
                                        <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item)"></el-checkbox>
                                      </span>
                                      <el-dropdown class="fixed file_more">
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
                                  </div>
                                  <div class="null"></div>
                                </draggable>

                              </div>

                              <div class="group_line"></div>
                            </div>
                          </template>
                        </div>
                        <template v-else>
                          <div v-if='power' class="file_empty">
                            <div class="empty_img">
                              <img src="./style/group_empty.png" alt="">
                            </div>
                            <p class="title">文件拖到此区域设置分组</p>
                          </div>
                          <div v-else class="file_empty">
                            <div class="empty_img">
                              <img src="./style/group_empty.png" alt="">
                            </div>
                            <p class="title">暂无分组</p>
                          </div>
                        </template>
                        <div v-if='notGroupedList.length || parthsGroup.length' class="left_right_toggle" @click='leftRightToggle'>
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
                    :ids='idList'
                    ref="otherView"
                  />
                </div>
                <!-- 相关需求 -->
                <div v-else id="operateFile" class="operate_file">
                  <demand-view
                  :list='demandList'
                  ref="demandView"
                  />
                </div>
                <!-- 个人文档 -->
                <div v-if="personalFilesShow" id="personalFiles" class="personal_files">
                  <div class="top_box">
                    <div class="left fl">
                      <el-tooltip effect="dark" content="上传" placement="top" :open-delay="300">
                        <i class='iconfont icon-shangchuan'></i>
                      </el-tooltip>
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
                          <i class="iconfont icon-xiazai"></i>
                          <i class="iconfont icon-delete"></i>
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
                      @click.stop='() => {}'
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
                      <button class="main_button_bg fr" @click="inputTextSure()">添加</button>
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
                            group:{name: 'file',pull:'clone'},
                            ghostClass: 'ghost_file', 
                            dragClass: 'drag_file',
                            draggable: '.draged',
                            disabled: dragDisabled_personal
                          }"
                          :move='fileMove'
                          @start='dragStart($event, "personal")'
                          @end='dragEnd'
                          >
                          <div 
                              :class="file.children ? 'every_file' : 'draged every_file'"
                              v-for="(file, index) in personalFiles"
                              :key="file.FilePkid"
                              :id='file.FilePkid'
                              :filename='file.FileName'
                              @dblclick='dbFolder(file)'
                              @mouseenter="enterFileSelf(file)"
                              @mouseleave="leaveFileSelf(file)"
                              >
                              <!-- 文件夹 -->
                              <template v-if='file.children'>
                                <span class="file_pic">
                                  <img src="./style/wenjianjia.png" alt="">
                                  <span class="none"></span>
                                </span>
                                <div class="file_info">
                                  <p v-if='!file.edit' class="title">{{file.FileName}}</p>
                                  <input 
                                    v-else 
                                    :ref="file.createdFolder ? 'createdFolder' : ''" 
                                    class="title edit" 
                                    type="text" 
                                    v-model='file.FileName'
                                    @blur='folderBlur(file)'
                                    />
                                  <p class="file_num">{{file.children.length}}个文件</p>
                                  <!-- <span class="fixed file_checkbox">
                                    <el-checkbox v-model="fileCheckbox"></el-checkbox>
                                  </span> -->
                                </div>
                              </template>
                              <!-- 文件 -->
                              <template v-else>
                                  <span class="file_pic">
                                    <template v-if='file.FileType === 11'>
                                      <span class="text_desc"><span>{{file.Desc}}</span></span>
                                    </template>
                                    <template v-else>
                                      <img :src="file.UrlMin" alt="">
                                    </template>
                                  <span class="none"></span>
                                </span>
                                <div class="file_info">
                                  <!-- <p v-if='!file.edit' class="title">{{file.FileName}}</p>
                                  <input 
                                    v-else 
                                    class="title edit" 
                                    v-model='file.FileTitle' 
                                    id="fileNameEdit"
                                    @blur="fileNameEditBlur($event, file)"
                                    /> -->
                                  <p class="title">{{file.FileName}}</p>
                                  <p class="file_num">123KB</p>
                                  <span class="fixed file_checkbox">
                                    <el-checkbox v-model="file.checked" @change="everyFileCheckboxSelf($event, file)"></el-checkbox>
                                  </span>

                                  <span class="fixed file_checkbox" v-if='oneCheckedSelf || file.hover'>
                                    <el-checkbox v-model="file.checked" @change="everyFileCheckboxSelf($event, file)"></el-checkbox>
                                  </span>
                                  <el-dropdown class="fixed file_more">
                                    <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item @click.native="fileCommand('download', index, file)">下载</el-dropdown-item>
                                      <el-dropdown-item @click.native="fileCommand('rename', index, file)">重命名</el-dropdown-item>
                                      <el-dropdown-item @click.native="fileCommand('delete', index, file)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                              </template>
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
      <!-- 温馨提示2_删除分组的提示 -->
      <transition name="fade1">
        <transfer-view
          v-if='transferShow'
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
      <!-- 文件上传进度条 -->
      <upload-progress v-if="uploadProgressFlag"
        :fileProgressList="fileProgressList"
        @closeProgress="closeProgress"
        @handleCancel="cancelUpload"
        @handleRe="reUpload" />
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
    TransferView
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
      personalFiles: [
        {
          FilePkid: "408",
          FileName: "bg",
          UrlMin:
            "/upload/file/20181213070700/d0b06e24-5111-497c-a512-8d4b139fd475/55924df2-63b6-4914-ade4-0ba667d577db_s1.png",
          FileType: "svg",
          userName: "祝建云"
        },
        {
          FilePkid: "406",
          FileName: "video2",
          UrlMin:
            "/upload/file/20180817071340/5e0dba23-b76a-43a6-9589-1aee0ae38fdb/f7088adf-dbc4-4b83-994a-5d69c4a66c0d_s1.png",
          FileType: "mp4",
          userName: "祝建云"
        },
        {
          FilePkid: 2,
          FileName: "我的文件",
          UrlMin: null,
          FileType: 0,
          userName: null,
          default: true,
          children: [
            {
              FilePkid: "407",
              FileName: "WX20181220-170213",
              UrlMin:
                "/upload/file/20180528070747/8b10d083-a85b-45a4-825a-9437fd47fa4a/logo-3.png",
              FileType: "png",
              userName: "祝建云"
            },
            {
              FilePkid: "405",
              FileName: "video",
              UrlMin:
                "/upload/file/20180711020446/9ccd7618-5010-40f4-ac2e-008e64108a22/165310yogoihqr63svh6tm.jpg",
              FileType: "mp4",
              userName: "祝建云"
            }
          ]
        },
        {
          FilePkid: 3,
          FileName: "我的收藏",
          UrlMin: null,
          FileType: 0,
          userName: null,
          default: true,
          children: [
            {
              FilePkid: "408",
              FileName: "bg",
              UrlMin:
                "/upload/file/20181224063855/7e9a5d52-d934-4f26-afba-9229d7524bfe/9ca290fc-5f78-421f-b237-9228b1a41263.svg",
              FileType: "svg",
              userName: "祝建云"
            },
            {
              FilePkid: 5,
              FileName: "文件夹2--第二个文件夹中文件夹",
              UrlMin: null,
              FileType: 0,
              userName: null,
              children: []
            }
          ]
        },
        {
          FilePkid: 4,
          FileName: "文件夹3--工作文件夹之我的项目",
          UrlMin: null,
          FileType: 0,
          userName: null,
          children: []
        }
      ], // 个人文档列表
      dragFileId: "", // 当前拖拽文件的ID
      moveOrClone: "move", // 是移动还是copy
      dragDisabled: false, // 未分组是否禁止拖拽
      dragDisabled_personal: false, // 个人文档是否禁止拖拽
      dragItem: {
        item: {},
        fromGroup: null,
        toGroup: null
      }, // 当前拖拽文件的详情
      navBar: [{ id: 0, name: "个人文档" }], // 个人文档的文件层级
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
      ], // 附件icon
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
      transferType: 1, // 1--单个文件移交， 2--多个文件移交， 3--组文件的移交
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
    notGroupedList(val) {
      let length = 0;
      for(let x of this.parthsGroup) {
        for(let y of x.fileList) {
          length++;
        }
      }
      this.FILELENGTH_CHANGE(val.length + length);
      this.stageInfo.fileList[0].fileList = val;
    },
    parthsGroup: {
      deep: true,
      handler(list) {
        let length = 0;
        for(let x of list) {
          for(let y of x.fileList) {
            length++;
          }
        }
        this.FILELENGTH_CHANGE(length + this.notGroupedList.length);
        this.stageInfo.fileList = [].concat(this.stageInfo.fileList[0], list);

      }
    },

  },
  computed: {
    ...mapState([
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
      'CHECKEDLIST_CHANGE',
      'FILELENGTH_CHANGE',
      'TASKIDS_CHANGE',
      'POWER_CHANGE'
    ]),
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
      if(this.viewToggle) {
        const list = this.$refs.otherView.close();
        this.checkedList = [...list];
        // 进行文件多选的回选
        this.returnSelection(list);
      }
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
      $('#inputText').removeClass('textarea_border');
    },
    // 添加文字--确定
    inputTextSure(flag) {
      if(this.inputText == '') {
        this.$message.warning('请输入文字内容！');
        return;
      }
      if(flag === 'left') { // 任务文件
        let obj = {
          myUserId: this.userId,
          projectId: this.projectId,
          stageTaskId: this.stageTaskId,
          filePartitionId: true ? 0 : this.filePartitionId, // 现在只能给未分组添加文字
          desc: this.inputText,
        };
        this.$HTTP('post', '/stageTaskInfo_add', obj).then(res => {
          this.inputTextShow1 = false;
          this.inputText = '';
          let returnObj = this.addFileAttr(res.result);
          returnObj = Object.assign(res.result, returnObj);
          this.notGroupedList.push(returnObj);
          this.$message.success('添加文字内容成功!');
          console.log('添加文字内容成功', res);
        }).catch(err => {
          console.log(err);
        });
      }else { // 个人文档
        this.inputTextShow2 = false;
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
      this.$HTTP("post", "/project_get_view", obj)
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
        this.$HTTP('post', '/demand_list', obj).then(res => {
          console.log(res.result);
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

    // 文件组折叠/展开
    groupExtendToggle(index, item) {
      if(item !== true && !item.overLength) {return}
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
      const arg = [...arguments]; 
      if(this.leftCenterFlag) { // 左侧--未分组占大份
      }else { // 右侧--分组区域占大份
      }
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
          .width();
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
          .width();
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
            urls.push(x.UrlMin);
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
    // 整体的分组管理
    groupCommand(type) {
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
        this.$nextTick(() => {
          const ele = $(this.$refs.createdGroup[0]);
          ele.focus();
          ele.select();
        });
        return;
      }

       // 分组排序
      if(type === 'sort') {
        this.groupSortFlag = true;
        return;
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
          this.$message.error("移动分组失败，请检查网络");
        });
    },

    // 新建/编辑分组名
    groupTitleBlur(group) {
      if(group.groupName == '') {
        this.$message.warning('分组名不能为空！');
        this.$nextTick(() => {
          const ele = $(this.$refs.createdGroup[0]);
          ele.focus();
        });
      }
      if(group.createdGroup) { // 新建
        // 发送请求---新建分组
        this.addParth(group.groupName);
      }else { // 编辑
        // 先判重，如果有重复的名字--提示，否则--发送请求
        let repeat = this.parthsGroup.findIndex(ele => (ele.groupName === group.groupName && ele.pkid !== group.pkid));
        if(repeat !== -1) {
          this.$message.warning('已含有同名分组名！');
        }else {
          // 发送修改分组名的接口
          if(this.groupNameCopy !== group.groupName) {
            let obj = {
              filePartitionId: group.pkid,
              title: group.groupName
            };
            this.$HTTP('post', '/filePartition_update', obj).then(res => {
              console.log('文件分组名修改成功', res);
              this.$message.success('文件分组名修改成功!');
            }).catch(err => {
              console.log(err);
            });
          }
          group.edit = false;
          this.parthsGroup = this.parthsGroup.concat();
        }
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
          this.fileIsSort(this.parthsGroup.length - 1, res.result.pkid, dragItem);
          this.$message.success('添加分组成功！');
          //console.log('添加分组成功！', objs);
          if(this.leftCenterFlag) {
            this.countFileOne();
          }
        }).catch(err => {
          console.log('err', err);
        });
      });
    },

    // 文件的更多操作
    fileCommand(type, index1, item, groupId, index) {
      this.operateFile = Object.assign({}, item, {index: index1, groupId: groupId, groupIndex: index});
      this.transferType = 1; // 单个文件移交
      if(type === 'download') { // 下载
        this.fileDownlod(item);
        return;
      }
      if(type === 'collect') { // 收藏
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
        this.$nextTick(() => {
          const ele = $('#fileNameEdit');
          ele.focus();
        
        });
        return;
      }
      if(type === 'delete') { // 删除
        this.delFileFlag = true;
        this.reminderText = '您确定要删除该文件吗？';
        return;
      }
    },
    // 修改文件名失焦--保存
    fileNameEditBlur(e, item) {
      const { index, groupId, groupIndex } = this.operateFile;
      const newTitle = item.FileTitle + '.' + item.Type;
      if(item.FileTitle == '') {
        this.$message.warning('文件名不能为空！');
        this.$nextTick(() => {
          const ele = $('#fileNameEdit');
          ele.focus();
        });
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
        this.$message.warning('已含有同名文件！');
      }else {
        // 发送修改分组名的接口
        if(this.fileNameCopy !== item.FileTitle) {
          let obj = {
            FilePkid: item.FilePkid,
            newTitle: item.FileTitle + '.' + item.Type
          };
          this.$HTTP('post', '/stageTaskFile_update', obj).then(res => {
            console.log('修改文件名成功', res);
            this.$message.success('修改文件名成功');
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
        console.log('删除文件成功', res, this.operateFile);
        if(groupId === 0) { // 未分组文件
          this.notGroupedList.splice(index, 1);
          this.notGroupedList = this.notGroupedList.concat();

        }else { // 分组文件
          this.parthsGroup[groupIndex].fileList.splice(index, 1);
          this.parthsGroup = this.parthsGroup.concat();

        }
      }).catch(err => {
        console.log('删除文件失败', err);
      });
    },

    // 组的更多操作
    fileGroupCommand(type, index, group) {
      this.filePartitionId = group.pkid;
      this.operateParth = Object.assign({}, group, {index: index});
      this.transferType = 3; // 整组移交

      if(type === 'upload') { // 上传文件
        return;
      }
      if(type === 'download') { // 下载
        this.fileDownlod(group);
        return;
      }
      if(type === 'collect') { // 收藏
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
        this.$nextTick(() => {
          const ele = $(this.$refs.createdGroup[0]);
          ele.focus();
        });
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
        let addList = res.result;
        addList = addList.splice(this.notGroupedList.length);
        for(let y of addList) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }
        console.log('文件分组删除成功',res.result, addList);

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
      this.transferType = 2; // 多个文件移交

    },

    // 取消文件移交
    transferCancel() {
      this.transferShow = false;
    },
    // 确认文件移交
    transferSure(val, descText) {
      this.transferShow = false;
      let arr = [[], []];
      if(this.transferType === 1) { // 单个文件
        arr[0] = [this.operateFile.FilePkid];
      }else if(this.transferType === 2) { // 多个文件
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
      this.tranferSendHttp(val, arr, descText);
    },

    // 移交时选择的阶段列表
    getTransferStageList() {
      this.transferStageList = [];
      for (let x of this.stageList) {
          if(x.stageId != this.stageId) {
              this.transferStageList.push({
                  value: x.stageId,
                  label: x.stageTitle,
                  disabled: false
              });
          }
      }
    },
    // 移交时发送的请求
    /**
     * val 移交选择的分组
     * arr 要移交的文件ID arr[0]里是未分组的ID集合 arr[1]是分组的ID集合
     * descText 移交时的需求描述
     * **/
    tranferSendHttp(val, arr, descText) {
      console.log('transfer---',  val, arr, descText);
      return new Promise((resolve) => {
          if(!arr[0].length && !arr[1].length && !descText) {
              this.$message.warning('请选择交接文件或添加需求描述');
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

          }).catch(err => {
              console.log(err);
          });
      });
    },

    // 多选下载
    multipleDownload() {
      this.transferType = 2; // 多个文件移交
      this.fileDownlod();
    },

    // 文件下载
    fileDownlod(item) {
      let link = "";
      if(this.transferType === 1) {
        link = $(
          '<a href="' +
            item.Url +
            '" download="' +
            item.FileName +
            '" target="_blank"></a>'
        );
        link.get(0).click();
      }else if (this.transferType === 2 && this.checkedFileList.length === 1) {
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
        if(this.transferType === 2) {
          for(let x of this.checkedFileList) {
            ids.push(x.FilePkid);
          }
        }else if(this.transferType === 3) {
          ids.push(item.pkid);
        }
        
        link = $(
          `<a href="/EggsWebService.asmx/zipFileDown?stageId=${this.stageId}&taskId=${this.taskId}&demandId=''&vals=${ids.join(',')}&type=${this.transferType - 1}" download="....zip" target="_blank"></a>`
        );
        link.get(0).click();
        if(this.transferType === 2) {
          this.fileCheckboxAll('clear'); // 多选操作完成后把选中状态还原
        } 
      }
    },


    // 文件拖拽---------------------------------start
    // 文件移动时的回调函数
    fileMove(e, under) {
      // e.dragged 拖拽的元素
      // e.draggedContext 拖拽的元素的详情
      // e.draggedContext.element 拖拽的元素的内容
      // e.draggedContext.futureIndex / index 拖拽的元素的索引
      // e.to: 拖入区域
      // e.relatedContext: 拖入区域的上下文

      // console.log("fileMove", e, this.dragItem.item.FileName);
      if (!this.dragItem.item.FileName) {
        const item = e.draggedContext.element;
        this.dragItem.item = Object.assign({}, item);
      }
    },
    // 文件开始移动时的回调函数
    dragStart(e, groupid) {
      this.dragFileId = $(e.item).attr("id");
      const filename = $(e.item).attr("filename");
      this.dragItem.fromGroup = $(e.from).attr("groupid");
      this.$nextTick(() => {
        const ele = $(`#${this.dragFileId}`);
        if (ele.attr("draggable") === "false") {
          ele.addClass("dragging");
        }
      });
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
      const { fromGroup: from, toGroup: to, item } = this.dragItem;
      // console.log('---', e.newIndex, from, to);

      if(to === 'new') { // 先新增一个分组，再添加文件
        let last = this.parthsGroup[this.parthsGroup.length - 1];
        this.addParth(last.groupName, last, this.dragItem);
      }
      if (from !== "personal" && to === "personal") {
        // 添加到个人文档--copy
      } else if (from === "personal" && to !== "personal") {
        // 从个人文档添加到我的操作中--copy
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
      if(to !== 'new') {
        this.fileIsSort(e.newIndex, to);
      }
      if(from === to) {
        this.dragEndInit();
      }else {
        await this.parthsGroupChange(e.newIndex);
        await this.dragEndInit();
      }
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
            console.log("移动文件成功", res);
          })
          .catch(err => {
            console.log("移动文件失败", err);
            this.$message.error("移动文件失败，请检查网络");
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
            } else 
            if (this.leftCenterFlag) {
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
          console.log(this.parthsGroup[0].fileList);
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
      } else {
        $("#personalFiles").hide();
        $('#operateFile').removeClass('self_file_show');
        if(this.inputTextShow2) {
          this.inputTextShow2 = false;
          this.inputText = '';
        }
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
      if (!file.children) {
        return;
      }
      this.personalFiles = file.children;
      this.navBar.push({ id: this.navBar.length, name: file.FileName });
    },
    // 返回上一级
    goBack(index) {
      if (index === this.navBar.length - 1) {
        return;
      }
      this.personalFiles = [
        {
          FilePkid: "408",
          FileName: "bg",
          UrlMin:
            "/upload/file/20181224063855/7e9a5d52-d934-4f26-afba-9229d7524bfe/9ca290fc-5f78-421f-b237-9228b1a41263.svg",
          FileType: "svg",
          userName: "祝建云"
        },
        {
          FilePkid: "406",
          FileName: "video2",
          UrlMin:
            "/upload/file/20181224063835/472243c2-382a-423c-80ab-9ce41a6d790f/b3c9bc00-538f-4167-83b9-879676690519.mp4",
          FileType: "mp4",
          userName: "祝建云"
        },
        {
          FilePkid: 2,
          FileName: "文件夹1",
          UrlMin: null,
          FileType: 0,
          userName: null,
          children: [
            {
              FilePkid: "407",
              FileName: "WX20181220-170213",
              UrlMin:
                "/upload/file/20181224063844/2288995a-d1c0-4144-9c94-a8eb2a1c568c/3ab87050-c290-40df-9171-f2543be97c68.png",
              FileType: "png",
              userName: "祝建云"
            },

            {
              FilePkid: "405",
              FileName: "video",
              UrlMin:
                "/upload/file/20181224063835/e85c7a46-b564-46d5-8743-18e63e4a6588/eeb294ad-6ce7-4b86-950a-2869fd7814e8.mp4",
              FileType: "mp4",
              userName: "祝建云"
            }
          ]
        },
        {
          FilePkid: 3,
          FileName: "文件夹2--这是我的文件夹中的第二个",
          UrlMin: null,
          FileType: 0,
          userName: null,
          children: [
            {
              FilePkid: "408",
              FileName: "bg",
              UrlMin:
                "/upload/file/20181224063855/7e9a5d52-d934-4f26-afba-9229d7524bfe/9ca290fc-5f78-421f-b237-9228b1a41263.svg",
              FileType: "svg",
              userName: "祝建云"
            },
            {
              FilePkid: 5,
              FileName: "文件夹2--第二个文件夹中文件夹",
              UrlMin: null,
              FileType: 0,
              userName: null,
              children: []
            }
          ]
        },
        {
          FilePkid: 4,
          FileName: "文件夹3--工作文件夹之我的项目",
          UrlMin: null,
          FileType: 0,
          userName: null,
          children: []
        }
      ];
      this.navBar = [{ id: 0, name: "个人文档" }];
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
      this.personalFiles.push({
        FilePkid: this.personalFiles.length,
        FileName: title,
        UrlMin: null,
        FileType: 0,
        userName: null,
        children: [],
        edit: true,
        createdFolder: true
      });
      this.$nextTick(() => {
        const ele = $(this.$refs.createdFolder[0]);
        ele.focus();
        ele.select();
      });
    },

    // 添加/修改文件夹失去焦点--保存
    folderBlur(file) {
      if(file.createdFolder) { // 新建
        // 发送请求---新建文件夹
        file.edit = false;
        delete file.createdFolder;
        console.log('新建成功');
      }else { // 编辑
        // 先判重，如果有重复的名字--提示，否则--发送请求
        let repeat = this.personalFiles.findIndex(ele => ele.FileName === file.FileName);
        if(repeat !== -1) {
          this.$message.warning('该目录下已含有同名文件夹！');
        }else {
          // 发送修改文件名的接口
          console.log('文件名修改成功');
        }
      }
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
          if(!y.hasOwnProperty('children')) {
            y.checked = true
            this.checkedListSelf.push(y);
          }
        }
        this.oneCheckedSelf = true;
      }else {
        for(let y of this.personalFiles) {
          if(!y.hasOwnProperty('children')) {
            y.checked = false
          }
        }
        this.oneCheckedSelf = false;
      }

      this.personalFiles = this.personalFiles.concat();
    },

    // 递归遍历文件夹层级，给每个文件加checked
    fibChecked(list) {
      for(let y of list) {
        if(y.children) {
          return this.fibChecked(y.children);
        }else {
          y.Count = 0;
          y.Desc = '0'; // 文字描述
          y.SystemType = 0; // 0--上传的文件 1--文字描述
          let indexs = y.FileName.lastIndexOf('.');
          y.Type = y.FileName.slice(indexs + 1);
          y.UserPic = 'http://server.apexgame.cn/upload/user/20180719110629240.jpeg';
          y.userPkid = 0;
          y.checked = false;
          y.hover = false;
        }
      }
    },
    // 个人文档的操作--------------------------------end




    
    // 文件上传--------------------------------start
    // 当前点击的是哪个分组的上传
    handleClickUpload(groupId) {
      this.filePartitionId = groupId;
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
        url:`/ProjectFile.ashx?&myUserId${this.userId}&projectId=${this.projectId}&stageTaskId=${this.stageTaskId}&filePartitionId=${this.filePartitionId}`,
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
      // 判重--该目录下已包含同名文件
      if(id) { // 分组
        let ids = this.parthsGroup.findIndex(ele => ele.pkid === id);
        let index = this.parthsGroup[ids].fileList.findIndex(ele => {
          return ele.FileName == file.name;
        });
        if (index !== -1) {
          this.$set(obj, 'error', 1);
          this.fileProgressList.unshift(obj);
          this.$message.error("该目录下已含有同名文件");
          return false; // 只写return不能阻止文件继续上传
        }
      }else { // 未分组
        let index = this.notGroupedList.findIndex(ele => {
          return ele.FileName == file.name;
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
      if(_size >= 1) {
        this.$set(obj, 'error', 2);
        this.fileProgressList.unshift(obj);
        this.$message.error("文件大于1G，无法上传");
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
      const id = this.filePartitionId;
      let file = Object.assign({}, _file.response.result);
      // let type = file.name.split(".")[1];
      // this.$set(file, "FileTypeNum", this.getFlieTyle(file.FileType));
      let file1 = this.addFileAttr(file);
      file1 = Object.assign({}, file, file1);

      if(id) { // 分组
        let ids = this.parthsGroup.findIndex(ele => ele.pkid === id);
        this.parthsGroup[ids].fileList = this.parthsGroup[ids].fileList.concat(file1); 
      }else { // 未分组
        this.notGroupedList = this.notGroupedList.concat(file1); 
      }
      
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
    getPersonalFile() {
      
      this.personalFiles = this.personalFiles.concat();
      for(let y of this.personalFiles) {
        if(!y.hasOwnProperty('children')) {
          y.Count = 0;
          y.Desc = '0'; // 文字描述
          y.SystemType = 0; // 0--上传的文件 1--文字描述
          let indexs = y.FileName.lastIndexOf('.');
          y.Type = y.FileName.slice(indexs + 1);
          y.UserPic = 'http://server.apexgame.cn/upload/user/20180719110629240.jpeg';
          y.userPkid = 0;
          y.checked = false;
          y.hover = false;
        }
      }
      // this.fibChecked(this.personalFiles);
      console.log(this.personalFiles);
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
          console.log("获取任务列表", this.tasksList);
          this.taskStageDetail(this.taskId ,this.stageId);
        })
        .catch(err => {
          console.log("获取任务列表失败", err);
          this.$message.error("获取任务列表失败，请检查网络");
        });
    },

    // 任务/阶段--详情
    taskStageDetail(taskId, stageId) {
      this.initData(); // 初始化数据
      this.taskId = taskId;
      this.stageId = stageId;
      let obj = {
        myUserId: '1184',
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
        this.$message.error("获取任务详情失败，请检查网络");
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
        this.$refs.stageManage.setData(this.stageInfo);
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
      let title = obj.FileName.slice(0, obj.FileName.length - (len + 1));
      let data = {
        checked: false,
        hover: false,
        edit: false,
        FileTitle: title,
        FileType: this.getFlieTyle(obj.Type),
        isOwn: obj.UserPkid.toString() === this.userId.toString() ? true : false
      }
      if (data.FileType !== 1) {
        data.UrlMin = this.fileTypeImg[data.FileType].src;
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
    //  params = {
    //       projectId: 1252, // 1267
    //       stageId: '38',
    //       taskId: 118,
    //     }
    this.projectId = params.projectId;
    this.stageId = params.stageId;
    this.taskId = params.taskId;
    this.getTaskList(this.projectId); // 获取任务列表
    this.getPersonalFile(); // 获取个人文档列表
    
  },
  mounted() {
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


