<template>
	<div class="other_view" @click.stop='() => {}'>
		<div class="top_header" v-if='!groupSortFlag'>
			<div class="file_name header_item">
				<span @click='sortHandle(0)'>文件</span>
			</div>
			<div class="file_from header_item">
				<span @click='sortHandle(1)'>上传者</span>
				<i 
					v-if='sortType === 1' 
					class="iconfont icon-jiantou_xiangxia"
					:class="sortOrder ? '' : 'sort_rotate'"
					></i>

			</div>
			<div class="file_time header_item">
				<span @click='sortHandle(2)'>上传日期</span>
				<i 
					v-if='sortType === 2' 
					class="iconfont icon-jiantou_xiangxia"
					:class="sortOrder ? '' : 'sort_rotate'"
					></i>
			</div>
			<div class="file_message header_item">
				<i class="iconfont icon-pinglun"></i>
			</div>
			<div class="file_more header_item">
				<i class="iconfont icon-gengduo"></i>
			</div>
		</div>
    <!-- 文件为空的时候 -->
    <div 
      class="group_box"
      @dragenter.stop.prevent="parthDragEnter(0, true)"
      >
      <el-upload
        class="file_empty_upload"
        :ref="uploadFrom === 1 ? 'fileUpload' : ''"
        :drag='power && !groupSortFlag && uploadFrom === 1 ? true : false'
        :action="'/ProjectFile.ashx?&myUserId='+ids.userId+'&projectId='+ids.projectId+'&stageTaskId='+ids.stageTaskId+'&filePartitionId='+0"
        :show-file-list="false"
        :multiple="true"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :on-progress="uploadProgress"
        :limit="9"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        @click.native.stop.prevent='(e) => { e.preventDefault(); return false}'
        >
        <!-- 文件为空的时候 -->
        <template v-if='fileEmpty'>
          <div class="file_empty">
            <div class="empty_img">
              <img src="../../../../assets/img/file_empty.png" alt="">
            </div>
            <p v-if='power' class="title">文件拖到此区域即可上传，支持批量上传</p>
            <p v-else class="title">暂无文件</p>
          </div>
        </template>
        <!-- 有分组（无排序） -->
        <template v-else-if='sortType === 0'>
          <p class="mainColor_underline_text go_back_sort" v-if='groupSortFlag' @click='backParthSort'>退出分组排序</p>
          <!-- 分组排序 -->
          <template v-if='groupSortFlag'>
            <draggable
              v-model="parthsGroup"
              :options="{
                ghostClass: 'ghost_parth_sort', 
                dragClass: 'drag_parth_sort',
                draggable: power && parthsGroup.length > 2 ? '.draged' : '',
                }"
              @end='dragEndParth'
            >
              <div 
                class="parths_group is_sort draged"
                v-if='group.pkid'
                v-for="group in parthsGroup"
                :key="group.pkid"
                :ids="group.pkid"
                >
                <i class="iconfont icon-paixu"></i>
                <span class="group_name">{{group.groupName}}</span>
              </div>
            </draggable>
          </template>
          <!-- 分组展示 -->
          <template v-else>
            <div 
              class="parths_group"
              v-for="(group, index0) in parthsGroup"
              :key="group.pkid"
              @dragenter.stop="parthDragEnter(group.pkid)"
              >
              <el-upload
                class="file_empty_upload"
                :ref="uploadFrom === 2 ? 'fileUpload' : ''"
                :drag='power && !groupSortFlag ? true : false'
                :action="'/ProjectFile.ashx?&myUserId='+ids.userId+'&projectId='+ids.projectId+'&stageTaskId='+ids.stageTaskId+'&filePartitionId='+group.pkid"
                :show-file-list="false"
                :multiple="true"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                :on-progress="uploadProgress"
                :limit="9"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                @click.native.stop='(e) => { e.preventDefault(); return false}'
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
                        <el-dropdown 
                          v-if='group.pkid && (power || group.fileList.length)'
                          class="fixed file_more"
                          @visible-change="visibleChangeGroup($event, group)"
                          >
                          <span class="el-dropdown-link"><i class='iconfont icon-gengduo1'></i></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item 
                                v-if='power'
                              @click.native="fileGroupCommand('upload', index0, group)"
                              >
                              <el-upload 
                                :ref="uploadFrom === 3 && filePartitionId === group.pkid ? 'fileUpload' : ''"
                                class="upload_file"
                                :action="'/ProjectFile.ashx?&myUserId='+userId+'&projectId='+projectId+'&stageTaskId='+stageTaskId+'&filePartitionId='+group.pkid"
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
                              @click.native="fileGroupCommand('download', index0, group)"
                              >下载</el-dropdown-item>
                            <el-dropdown-item 
                              v-if='group.fileList.length' 
                              @click.native="fileGroupCommand('collect', index0, group)"
                              >收藏</el-dropdown-item>
                            <!-- 整组移交 只有一个阶段的时候 -->
                            <el-dropdown-item 
                              v-if='power && group.fileList.length && stageList.length === 1' 
                              @click.native="fileGroupCommand('transfer', index0, group)"
                              >
                              <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                <span class='cur_dis'>整组移交</span>
                              </el-tooltip>
                            </el-dropdown-item>
                            <!-- 整组移交 只有自己的文件的时候 -->
                            <el-dropdown-item 
                              v-else-if='power && group.fileList.length && group.fileList.length && group.onlySelf' 
                              @click.native="fileGroupCommand('transfer', index0, group)"
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
                              @click.native="fileGroupCommand('rename', index0, group)"
                              >重命名</el-dropdown-item>
                            <el-dropdown-item 
                              v-if='power' 
                              @click.native="fileGroupCommand('delete', index0, group)"
                              >删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="group_file">
                  <div 
                    class="every_files"
                    v-for="(file, index) in group.fileList"
                    :key='file.FilePkid'
                    >
                    <div class="file_name every_common">
                      <el-checkbox v-model='file.checked' @change='checkboxChange($event, file, 0)'></el-checkbox>
                      <img :src="file.FileType === 1 ? fileTypeImg[1].src : file.UrlMin" alt="">
                      <span v-if='!file.edit' class="file_title">{{file.FileName}}</span>
                        <input 
                          v-else 
                          class="edit" 
                          v-model='file.FileTitle' 
                          id="fileNameEdit"
                          @input='fileNameEditChange($event, file)'
                          @blur="fileNameEditBlur($event, file)"
                          />
                    </div>
                    <div class="file_from every_common">
                      <span>{{file.nickName ? file.nickName : file.userName}}</span>
                    </div>
                    <div class="file_time every_common">
                      <span>{{file.formatTime}}</span>
                    </div>
                    <div class="file_message every_common">
                      <i class="iconfont icon-pinglun"></i>
                      <span v-if='file.Count'>{{file.Count}}</span>
                    </div>
                    <div class="file_more every_common">
                      <el-dropdown class="">
                          <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="fileCommand('download', index, file, group.pkid, index0)">下载</el-dropdown-item>
                            <el-dropdown-item @click.native="fileCommand('collect', index, file, index0)">收藏</el-dropdown-item>
                            <el-dropdown-item v-if='file.isOwn && stageList.length === 1'>
                              <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                                <span class="cur_dis">移交</span>
                              </el-tooltip>
                            </el-dropdown-item>
                            <el-dropdown-item v-if='file.isOwn && stageList.length > 1' @click.native="fileCommand('transfer', index, file, group.pkid, index0)">移交</el-dropdown-item>
                            <el-dropdown-item v-if='file.isOwn' @click.native="fileCommand('rename', index, file, group.pkid, index0)">重命名</el-dropdown-item>
                            <el-dropdown-item v-if='file.isOwn' @click.native="fileCommand('delete', index, file, group.pkid, index0)">删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                  </div>
                </div>
              </el-upload>
            </div>
          </template>
        </template>
        <!-- 无分组（排序） -->
        <template v-else>
           <div class="no_group parths_group">
            <div class="group_file">
              <div 
                class="every_files"
                v-for="(file, index) in fileList"
                :key='file.FilePkid'
                >
                <div class="file_name every_common">
                  <el-checkbox v-model='file.checked' @change='checkboxChange($event, file, 1)'></el-checkbox>
                  <img :src="file.FileType === 1 ? fileTypeImg[1].src : file.UrlMin" alt="">
                  <span v-if='!file.edit' class="file_title">{{file.FileName}}</span>
                  <input 
                    v-else 
                    class="edit" 
                    v-model='file.FileTitle' 
                    id="fileNameEdit"
                    @input='fileNameEditChange($event, file)'
                    @blur="fileNameEditBlur($event, file)"
                    />
                </div>
                <div class="file_from every_common">
                  <span>{{file.nickName ? file.nickName : file.userName}}</span>
                </div>
                <div class="file_time every_common">
                  <span>{{file.formatTime}}</span>
                </div>
                <div class="file_message every_common">
                  <i class="iconfont icon-pinglun"></i>
                  <span v-if='file.Count'>{{file.Count}}</span>
                </div>
                <div class="file_more every_common">
                  <el-dropdown class="">
                    <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="fileCommand('download', index, file, file.groupId, file.groupIndex)">下载</el-dropdown-item>
                      <el-dropdown-item @click.native="fileCommand('collect', index, file, file.groupId, file.groupIndex)">收藏</el-dropdown-item>
                      <el-dropdown-item v-if='file.isOwn && stageList.length === 1'>
                        <el-tooltip effect="dark" content="没有可移交的阶段" placement="top" :open-delay="300">
                          <span class="cur_dis">移交</span>
                        </el-tooltip>
                      </el-dropdown-item>
                      <el-dropdown-item v-if='file.isOwn && stageList.length > 1' @click.native="fileCommand('transfer', index, file, file.groupId, file.groupIndex)">移交</el-dropdown-item>
                      <el-dropdown-item v-if='file.isOwn' @click.native="fileCommand('rename', index, file, file.groupId, file.groupIndex)">重命名</el-dropdown-item>
                      <el-dropdown-item v-if='file.isOwn' @click.native="fileCommand('delete', index, file, file.groupId, file.groupIndex)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-upload>
      
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
      <!-- 文件上传进度条 -->
      <upload-progress v-if="uploadProgressFlag"
        :fileProgressList="fileProgressList"
        @closeProgress="closeProgress"
        @handleCancel="cancelUpload"
        @handleRe="reUpload" />
	</div>
</template>
<script>
import draggable from "vuedraggable";

import Reminder2 from "../../../common/reminder2";
import UploadProgress from "../../../common/uploadProgress";
import TransferView from './transferView';

import { mapState, mapMutations } from 'vuex';

export default {
  props: ['ids', 'list', 'stageList'],
  components: {
    draggable,
    Reminder2,
    UploadProgress,
    TransferView
  },
  data() {
    return {
      loginUser: JSON.parse(localStorage.getItem("staffInfo")), // 当前登录者的信息
      projectItem: JSON.parse(localStorage.getItem("projectItem")), // 当前项目
      // userId: 1204, // 当前登录者的ID
      userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
      projectId: this.ids.projectId, // 项目ID
      stageId: this.ids.stageId, // 阶段ID
      taskId: this.ids.taskId, // 任务ID
      stageTaskId: this.ids.stageTaskId, // 阶段ID + 任务ID
      filePartitionId: this.ids.filePartitionId, // 任务文件分组ID
      idList: {}, // 各种ID集合
      // 文件上传
      uploadProgressFlag: false,
      fileProgressList: [],
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
      fileList: [], // 未分组文件列表
			parthsGroup: [], // 文件分组
			checked: false,
      sortType: 0, // 0--按文件名排序 2--按上传者排序 3--按上传时间排序
      sortOrder: true, // 排序顺序：true--正序 false--倒序
      checkedList: [], // 获取
      delGroupFlag: false, // 删除分组的提示
      delFileFlag: false, // 删除文件的提示
      reminderText: '您确定要删除吗？', // 输出提示框的默认文字
      operateParth: {}, // 当前操作的文件分组信息
      operateFile: {}, // 当前操作的文件信息
      groupNameCopy: '', // copy文件分组的名字
      fileNameCopy: '', // copy文件的名字
      groupSortFlag: false, // 分组排序展示
      transferShow: false, // 文件移交的弹窗
      transferStageList: [], // 移交选择的阶段列表
      transferDefaultStage: [], // 移交时默认选择下一阶段阶段
      transferType: 1, // 1--单个文件移交， 2--多个文件移交， 3--组文件的移交
      uploadFrom: 1, // 1--从本地拖拽上传； 2--从本地拖拽上传到分组中； 3--分组点击分组里的上传
    };
  },
  watch: {
    sortType(val) {
      if(val) { // 2--按上传者排序 3--按上传时间排序
        for(let y  of this.fileList) {
          let indexs = this.checkedList.findIndex(ele => ele.FilePkid == y.FilePkid);
          indexs !== -1 && (y.checked = this.checkedList[indexs].checked);
        }
      }else { // 0--按文件名排序
        for(let x of this.parthsGroup) {
          for(let y  of x.fileList) {
            let indexs = this.checkedList.findIndex(ele => ele.FilePkid == y.FilePkid);
            indexs !== -1 && (y.checked = this.checkedList[indexs].checked);
          }
        }
      }
    },
    checkedList(val) {
      this.CHECKEDLIST_CHANGE(val);
      // console.log(val);
    },
    fileList(val) {
      this.FILELENGTH_CHANGE(val.length);
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
        this.FILELENGTH_CHANGE(length);
      }
    },
    
  },
  computed: {
    ...mapState([
      'checkedFileList',
      'power' // 权限管理 0--未参加阶段任务 1--参加了阶段任务

    ]),
     // 文件是否为空 
     /**
      * 文件是否为空
      * true--空
      * false--不为空
      * **/
    fileEmpty() {
      let length = [];
      if(!this.sortType) {
        let arr = [...this.parthsGroup].filter(ele => ele.fileList.length);
        if(arr.length) {
          return false;
        }else {
          return true;
        }
      }else {
        if(this.fileList.length) {
          return false;
        }else {
          return true;
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'CHECKEDLIST_CHANGE',
      'FILELENGTH_CHANGE'

    ]),
    // 文件选中状态改变
    checkboxChange(val, item, flag) {
      this.selectedListChange(val, item, flag);
      if(flag) { // 没有分组
        this.fileList = this.fileList.concat();
      }else { // 有分组
        this.parthsGroup = this.parthsGroup.concat();
      }
    },
    // 已选列表改变
    selectedListChange(val, item, flag) {
      if(val) { // 选中
        this.checkedList.push(item);
      }else { // 取消
        let x = this.checkedList.findIndex(ele => ele.FilePkid === item.FilePkid);
        x !== -1 && (this.checkedList.splice(x, 1));
      }
    },
    // 文件全选
    fileCheckboxAll(checked) {
      if(checked === 'clear') {
        checked = false;
      }
      if(this.sortType) { // 排序
        if(checked) { // 全选
          this.fileList.map(ele => ele.ckecked = true);
          this.checkedList = this.fileList.concat();
        }else { // 全不选
          this.fileList.map(ele => ele.ckecked = false);
          this.checkedList = [];
        }
        this.fileList = this.fileList.concat();
      }else {
        if(checked) { // 全选

          this.checkedList = [];
          for(let x of this.parthsGroup) {
            for(let y of x.fileList) {
              y.checked = true;
              this.checkedList.push(y);
            }
          }
        }else { // 全不选
          this.checkedList = [];
          for(let x of this.parthsGroup) {
            for(let y of x.fileList) {
              y.checked = false;
            }
          }
        }
        this.parthsGroup = this.parthsGroup.concat();
      }
    },

		// 文件排序
		async sortHandle(type, sort) {
      if(this.fileEmpty) { return;}
			if(type) { // 按上传者/上传日期排序
				if(type == 1) { // 按上传者排序
					if(this.sortType === 1) {
						this.sortOrder = !this.sortOrder;
					}else {
						this.sortOrder = true;
					}
					this.sortType = 1;
				}else { // 按上传日期排序
					if(this.sortType === 2) {
						this.sortOrder = !this.sortOrder;
					}else {
						this.sortOrder = true;
					}
					this.sortType = 2;
        }
        this.setSort();
			}else { // 恢复默认排序
				this.sortType = 0;
			}
    },
    // 排序后的数据
    setSort() {
      const list = [];
      for(let i = 0; i < this.parthsGroup.length; i++) {
        let x = this.parthsGroup[i];
        for(let ele of x.fileList) {
          ele.groupId = x.pkid; 
          ele.groupIndex = i;
        }
        list.push(...x.fileList);

      }
      this.fileList = [...list];
      this.fileList.sort(this.compare);
      
    },
    // 排序的方法
    compare(obj1, obj2) {
      let x, y;
      if(this.sortType === 1) { // 作者
        x = obj1.nickName ? obj1.nickName : obj1.userName;
        y = obj2.nickName ? obj2.nickName : obj2.userName;
      }else { // 时间
        x = new Date(obj2.CreateTime).getTime();
        y = new Date(obj1.CreateTime).getTime();
      }
      if(this.sortOrder) { // 正叙
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
      }else { // 倒叙
        if (x < y) {
            return 1;
        } else if (x > y) {
            return -1;
        } else {
            return 0;
        }
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
        this.parthsGroup = this.parthsGroup.concat();
        // console.log(this.parthsGroup);

        // 分组名获取焦点并选
        this.$nextTick(() => {
          const ele = $(this.$refs.createdGroup[0]);
          ele.focus();
          ele.select();
          // this.$refs.createdGroup[0].scrollIntoView({
          //   behavior: "smooth"
          // });
        });
        return;
      }

       // 分组排序
      if(type === 'sort') {
        this.groupSortFlag = true;
        return;
      }
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
          this.$message.success('添加分组成功！', this.parthsGroup);
          
        }).catch(err => {
          console.log('err', err);
        });
      });
    },



    // 分组的更多操作--------------------分组的操作
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
          ele.select();
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
            console.log('文件分组删除成功', res, index);
            
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
        addList = addList.splice(this.parthsGroup[0].fileList.length);
        for(let y of addList) {
          let returnObj = this.addFileAttr(y);
          y = Object.assign(y, returnObj);
        }

        this.parthsGroup[0].fileList.push(...addList);
        this.parthsGroup.splice(this.operateParth.index, 1);
        // console.log('文件分组删除成功',this.parthsGroup);

      }).catch(err => {
        console.log(err);
      });
      this.delGroupFlag = false;
    },
    // 分组管理的下拉列表的显示/隐藏时触发
    visibleChangeGroup(val, group) {
      if(val) {
        let x = group.fileList.findIndex(ele => !ele.isOwn);
        this.$set(group, 'onlySelf', x === -1 ? true : false);
        this.parthsGroup = this.parthsGroup.concat();
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

    // 文件的更多操作--------------------单个文件的操作
    fileCommand(type, index1, item, groupId, index) {
      // console.log(type, index1, item, groupId, index);
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
        this.parthsGroup = this.parthsGroup.concat();

        this.$nextTick(() => {
          const ele = $('#fileNameEdit');
          ele.css({width: this.textWidth(ele.val()) + 4})
          ele.focus();
          ele.select();
        });
        return;
      }
      if(type === 'delete') { // 删除
        this.delFileFlag = true;
        this.reminderText = '您确定要删除该文件吗？';
        return;
      }
    },
    // 修改文件名
    fileNameEditChange(e) {
      let val = $(e.target).val();
      $(e.target).css({width: this.textWidth(val) + 4})
    },
    // input内容自适应宽度
    textWidth(text) {
      let sensor = $('<pre>'+ text +'</pre>').css({display: 'none'}); 
      $('body').append(sensor); 
      let width = sensor.width();
      let fw = $('.file_title').eq(0).width() - 10;
      if(width >= fw) {
        width = fw;
      }
      sensor.remove(); 
      return width;
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
      repeat = this.parthsGroup[groupIndex].fileList.findIndex(ele => (ele.FileName === newTitle && ele.FilePkid !== item.FilePkid));
      
      if(repeat !== -1) {
        this.$message.error('该分组内含有同名文件！');
        this.$nextTick(() => {
          const ele = $('#fileNameEdit');
          ele.focus();
        });
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
        this.parthsGroup = this.parthsGroup.concat();
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
        // console.log('删除文件成功', res);
        if(this.operateFile.checked) {
          const indexs = this.checkedList.findIndex(ele => ele.FilePkid === FilePkid);
          indexs !== -1 && this.checkedList.splice(indexs, 1);
        }
        let lists = this.parthsGroup[groupIndex].fileList;
        let num = lists.findIndex(ele => ele.FilePkid === FilePkid);
        num !== -1 && this.parthsGroup[groupIndex].fileList.splice(num, 1);
        this.parthsGroup = this.parthsGroup.concat();
        if(this.sortType) { // 未分组文件
          this.setSort();
        }
      }).catch(err => {
        console.log('删除文件失败', err);
      });
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
    tranferSendHttp(val, arr, descText) {
      // console.log('1111transfer---',  val, arr, descText);
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


    // 文件上传--------------------------------start
     parthDragEnter(id, flag) {
      this.filePartitionId = id;
      if(flag) {
        this.uploadFrom = 1;
      }else {
        this.uploadFrom = 2;
      }
    },
    // 当前点击的是哪个分组的上传
    handleClickUpload(groupId) {
      this.filePartitionId = groupId;
      this.uploadFrom = 3;
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
      let file1 = this.addFileAttr(file);
      file1 = Object.assign({}, file, file1);

      let indexs = this.parthsGroup.findIndex(ele => ele.pkid === id);
      this.parthsGroup[indexs].fileList = this.parthsGroup[indexs].fileList.concat(file1); 
      if(this.sortType) { // 未分组文件
          this.setSort();
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
            // console.log(this.$refs.fileUpload[0]);
            this.$refs.fileUpload[0].clearFiles();
          }else {
            // onsole.log(this.$refs.fileUpload);
            this.$refs.fileUpload.clearFiles();
          }
        }, 2000);
      }
    },

    // 文件上传失败
    uploadError(err, file) {
      console.log('err---', err);
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


    // 关闭此视图触发的方法
    close() {
      return {
          type: this.sortType ? true : false,
          checkedList: this.checkedList,
          list: this.parthsGroup
        };
    },
  
    // 获取文件
    updateData(data) {
      if(data === 'init') {
        this.checkedList = JSON.parse(JSON.stringify(this.checkedFileList));
        this.parthsGroup = JSON.parse(JSON.stringify(this.list));
        return;
      }
      this.parthsGroup = JSON.parse(JSON.stringify(data));
      if(this.sortType) { // 无分组--排序
        this.setSort();
      }
      
      
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
        isOwn: obj.UserPkid.toString() === this.userId.toString() ? true : false,
        formatTime: this.format(new Date(obj.CreateTime), 'yyyy/MM/dd HH:mm')
      }
      data.UrlMin = this.fileTypeImg[data.FileType].src;
      return data;
    },
    // 回选
    returnSelection(sort) {
      let list = this.checkedList;
      if(sort) {
        for(let y  of this.fileList) {
          let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
          indexs !== -1 && (y.checked = list[indexs].checked);
        }
        this.fileList = this.fileList.concat();
      }else {
        for(let x of this.parthsGroup) {
          for(let y  of x.fileList) {
            let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
            indexs !== -1 && (y.checked = list[indexs].checked);
          }
        }
        this.parthsGroup = this.parthsGroup.concat();
      }
    },
  },
  created() {
    this.updateData('init');
  },
  mounted() {
  }
};
</script>
<style lang="less">
.other_view {
  width: calc(100% - 24px * 2);
  height: calc(100% - 40px - 18px * 2);
  padding: 18px 24px;

  .file_name {
		width: calc(100% - 140px - 184px - 114px - 30px);
    // width: 344px;
    .el-checkbox {
      margin-left: 5px;
    }
    img {
      display: inline-block;
      width: 24px;
      height: 30px;
      margin: 0 10px;
      vertical-align: middle;
      margin-top: -4px;
    }
    .file_title {
      display: inline-block;
			width: calc(100% - 74px);
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			vertical-align: middle;
			height: 38px;
			line-height: 38px;
			margin-top: -4px;
    }
    .edit {
      max-width: calc(100% - 74px);
      height: 20px;
      line-height: 38px;
      display: inline-block;
			vertical-align: middle;
      overflow: hidden;
      border: 1px solid #999999;
      margin-top: -4px;
      text-align: left;
      padding: 2px;
      &::selection {
        background: #3684FF;
        color: #fff;
      }
    }
  }
  .file_from {
    width: 140px;
  }
  .file_time {
    width: 184px;
  }
  .file_message {
    width: 114px;
  }
  .file_more {
    width: 30px;
  }
  .top_header {
    overflow: hidden;
    width: 100%;
    .header_item {
      color: #999;
      text-align: left;
      height: 38px;
      line-height: 40px;
			float: left;
			cursor: pointer;
      .iconfont {
        color: #999;
				font-size: 14px;
				&:hover {
					color:#999 !important;
				}
      }
      .icon-jiantou_xiangxia {
        font-size: 12px;
        color: #3684ff;
			}
		}
		.file_name:hover, .file_from:hover, .file_time:hover {
			color: #3684FF;
		}
		.file_message, .file_more {
			cursor: auto !important;
			.iconfont {
				cursor: auto !important;
			}
		}
		.sort_rotate {
			display: inline-block;
			transform: rotate(-180deg);
			height: 38px;
		}
  }
  .group_box {
		width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    position: relative;
    .parths_group {
    	width: 100%;
      .group_top {
        width: 100%;
        height: 20px;
        margin-bottom: 14px;
        margin-top: 18px;
        .group_name {
          font-weight: bold;
        }
        .edit {
          width: 136px;
          height: 24px;
          border: 1px solid #999;
          text-align: left;
          &::selection {
            background: #3684ff;
            color: #fff;
          }
        }
        .group_operate {
          height: 20px;
          .el-dropdown {
            height: 20px;
          }
        }
        .group_operate {
          float: right;
        }
			}
      .group_file {
        width: 100%;
        .every_files {
          width: 100%;
          height: 40px;
          line-height: 40px;
          border: 1px solid #eeeeee;
          box-sizing: border-box;
          margin-top: 6px;
          .every_common {
            height: 38px;
            line-height: 40px;
            font-size: 12px;
            float: left;
            .iconfont {
              font-size: 12px;
            }
          }
          &:hover {
            border-color: #3684FF;
          }
        }
      }
    }
    .file_empty_upload {
      overflow: hidden;
    }

     .go_back_sort {
        margin-top: 24px;
        margin-bottom: 10px;
      }
      .is_sort {
        cursor: move;
        padding-top: 0;
        padding-left: 0 !important;
        height: 32px;
        line-height: 32px;
        padding-left: 24px;
        box-sizing: border-box;
        .icon-paixu, .group_name {
          font-size: 14px;
          color: #666666;
          font-weight: bold;
        }
      }
  }
}
</style>