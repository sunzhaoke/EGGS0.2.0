<template>
	<div class="other_view" @click.stop='() => {}'>
		<div class="top_header">
			<div class="file_name header_item" @click='sortHandle(0)'>
				<span>文件</span>
			</div>
			<div class="file_from header_item" @click='sortHandle(1)'>
				<span>上传者</span>
				<i 
					v-if='sortType === 1' 
					class="iconfont icon-jiantou_xiangxia"
					:class="sortOrder ? '' : 'sort_rotate'"
					></i>

			</div>
			<div class="file_time header_item" @click='sortHandle(2)'>
				<span>上传日期</span>
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
    <!-- 有分组 -->
		<div v-if='sortType === 0' class="group_box">
			<div 
				class="parths_group"
				v-for="group in fileGroup"
				:key="group.pkid"
				>
				<!-- 分组的头部操作 -->
				<div class="group_top">
						<span v-if='!group.edit' class="group_name">{{group.groupName}}</span>
							<input 
								v-else 
								:ref="group.createdGroup ? 'createdGroup' : ''" 
								class="group_name edit" 
								type="text" 
								v-model='group.groupName'
								@blur='groupTitleBlur(group)'
								/>
						<div class="group_operate">
								<el-dropdown class="fixed file_more">
									<span class="el-dropdown-link"><i class='iconfont icon-gengduo1'></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item @click.native="fileGroupCommand('upload')">上传文件</el-dropdown-item>
										<el-dropdown-item @click.native="fileGroupCommand('download')">下载</el-dropdown-item>
										<el-dropdown-item @click.native="fileGroupCommand('collect')">收藏</el-dropdown-item>
										<el-dropdown-item @click.native="fileGroupCommand('transfer')">整组移交</el-dropdown-item>
										<el-dropdown-item @click.native="fileGroupCommand('rename')">重命名</el-dropdown-item>
										<el-dropdown-item @click.native="fileGroupCommand('delete')">删除</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
						</div>
				</div>
				<div class="group_file">
					<div 
						class="every_files"
						v-for="file in group.fileList"
						:key='file.FilePkid'
						>
						<div class="file_name every_common">
							<el-checkbox v-model='file.checked' @change='checkboxChange($event, file, 0)'></el-checkbox>
							<img :src="file.UrlMin" alt="">
							<span class="file_title">{{file.FileName}}</span>
						</div>
						<div class="file_from every_common">
							<span>{{file.UserName}}</span>
						</div>
						<div class="file_time every_common">
							<span>{{file.formatTime}}</span>
						</div>
						<div class="file_message every_common">
							<i class="iconfont icon-pinglun"></i>
							<span v-if='file.Count'>{{file.Count}}</span>
						</div>
						<div class="file_more every_common">
							<i class="iconfont icon-gengduo"></i>
						</div>
					</div>
				</div>
      </div>
		</div>
    <!-- 无分组 -->
    <div v-else class="group_box">
      <div class="no_group parths_group">
        <div class="group_file">
          <div 
            class="every_files"
            v-for="file in fileList"
            :key='file.FilePkid'
            >
            <div class="file_name every_common">
              <el-checkbox v-model='file.checked' @change='checkboxChange($event, file, 1)'></el-checkbox>
              <img :src="file.UrlMin" alt="">
              <span class="file_title">{{file.FileName}}</span>
            </div>
            <div class="file_from every_common">
              <span>{{file.UserName}}</span>
            </div>
            <div class="file_time every_common">
              <span>{{file.formatTime}}</span>
            </div>
            <div class="file_message every_common">
              <i class="iconfont icon-pinglun"></i>
              <span v-if='file.Count'>{{file.Count}}</span>
            </div>
            <div class="file_more every_common">
              <i class="iconfont icon-gengduo"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: ['ids'],
  data() {
    return {
      fileTypeImg: [
          {
              src: require("../../../assets/img/file_m/0.png")
          }, {
              src: require("../../../assets/img/file_m/1.png")
          }, {
              src: require("../../../assets/img/file_m/2.png")
          }, {
              src: require("../../../assets/img/file_m/3.png")
          }, {
              src: require("../../../assets/img/file_m/4.png")
          }, {
              src: require("../../../assets/img/file_m/5.png")
          }, {
              src: require("../../../assets/img/file_m/6.png")
          }, {
              src: require("../../../assets/img/file_m/7.png")
          }, {
              src: require("../../../assets/img/file_m/8.png")
          }, {
              src: require("../../../assets/img/file_m/9.png")
          }, {
              src: require("../../../assets/img/file_m/10.png")
          }, {
              src: require("../../../assets/img/file_m/11.png")
          },
      ], // 文件类型图片
      fileList: [], // 未分组文件列表
			fileGroup: [], // 文件分组
			checked: false,
      sortType: 0, // 0--按文件名排序 2--按上传者排序 3--按上传时间排序
      sortOrder: true, // 排序顺序：true--正序 false--倒序
      selectedList: [], // 获取
    };
  },
  watch: {
    sortType(val) {
      if(val) { // 2--按上传者排序 3--按上传时间排序
        for(let y  of this.fileList) {
          let indexs = this.selectedList.findIndex(ele => ele.FilePkid == y.FilePkid);
          indexs !== -1 && (y.checked = this.selectedList[indexs].checked);
        }
      }else { // 0--按文件名排序
        for(let x of this.fileGroup) {
          for(let y  of x.fileList) {
            let indexs = this.selectedList.findIndex(ele => ele.FilePkid == y.FilePkid);
            indexs !== -1 && (y.checked = this.selectedList[indexs].checked);
          }
        }
      }
    },
    selectedList(val) {
      this.CHECKEDLIST_CHANGE(val);
      // console.log(val);
    }
    
  },
  computed: {
    ...mapState([
      'checkedFileList'
    ]),
  },
  methods: {
    ...mapMutations([
      'CHECKEDLIST_CHANGE',
    ]),
    // 文件选中状态改变
    checkboxChange(val, item, flag) {
      this.selectedListChange(val, item, flag);
      if(flag) { // 没有分组
        this.fileList = this.fileList.concat();
      }else { // 有分组
        this.fileGroup = this.fileGroup.concat();
      }
    },
    // 已选列表改变
    selectedListChange(val, item, flag) {
      if(val) { // 选中
        this.selectedList.push(item);
      }else { // 取消
        let x = this.selectedList.findIndex(ele => ele.FilePkid === item.FilePkid);
        x !== -1 && (this.selectedList.splice(x, 1));
      }
    },
    // 文件全选
    fileCheckboxAll(checked) {
      if(this.sortType) { // 排序
        if(checked) { // 全选
          this.fileList.map(ele => ele.ckecked = true);
          this.selectedList = this.fileList.concat();
        }else { // 全不选
          this.fileList.map(ele => ele.ckecked = false);
          this.selectedList = [];
        }
        this.fileList = this.fileList.concat();
      }else {
        if(checked) { // 全选

          this.selectedList = [];
          for(let x of this.fileGroup) {
            for(let y of x.fileList) {
              y.checked = true;
              this.selectedList.push(y);
            }
          }
        }else { // 全不选
          this.selectedList = [];
          for(let x of this.fileGroup) {
            for(let y of x.fileList) {
              y.checked = false;
            }
          }
        }
        this.fileGroup = this.fileGroup.concat();
      }
    },

		// 文件排序
		async sortHandle(type, sort) {
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
        
        // 发送请求--排序
        try {
          await this.getSortData();
          await this.returnSelection(true);
        }catch(err) {
          console.log(err);
        }
			}else { // 恢复默认排序
				this.sortType = 0;
        // 发送请求--恢复默认排序
        try {
          await this.getData();
          await this.returnSelection(false);
        }catch(err) {
          console.log(err);
        }
			}
		},
    // 新建/编辑分组
    groupTitleBlur(group) {
      if (group.createdGroup) {
        // 新建
        // 发送请求---新建分组
        group.edit = false;
        delete group.createdGroup;
        console.log("新建分组成功");
      } else {
        // 编辑
        // 先判重，如果有重复的名字--提示，否则--发送请求
        let repeat = this.fileGroup.findIndex(
          ele => ele.groupName === group.groupName
        );
        if (repeat !== -1) {
          this.$message.warning("已含有同名分组名！");
        } else {
          // 发送修改分组名的接口
          console.log("分组名修改成功");
        }
      }
    },

    // 文件的更多操作
    fileCommand(type) {
      if (type === "download") {
        // 下载
        return;
      }
      if (type === "collect") {
        // 收藏
        return;
      }
      if (type === "transfer") {
        // 移交

        return;
      }
      if (type === "rename") {
        // 重命名

        return;
      }
      if (type === "delete") {
        // 删除

        return;
      }
    },

    // 组的更多操作
    fileGroupCommand() {
      if (type === "upload") {
        // 上传文件
        return;
      }
      if (type === "download") {
        // 下载
        return;
      }
      if (type === "collect") {
        // 收藏
        return;
      }
      if (type === "transfer") {
        // 整组移交

        return;
      }
      if (type === "rename") {
        // 重命名

        return;
      }
      if (type === "delete") {
        // 删除

        return;
      }
    },

    // 关闭此视图触发的方法
    close() {
      return this.selectedList;
    },
    // 排序时获取文件
    getSortData() {
      return new Promise((reslove, reject) => {
        let order = 1;
        if(this.sortType === 1) {
          if(this.sortOrder) {
            order = 1;
          }else {
            order = 2;
          }
        }else {
          if(this.sortOrder) {
            order = 3;
          }else {
            order = 4;
          }
        }
        let obj = {
          myUserId: this.ids.userId,
          stageId: this.ids.stageId,
          taskId: this.ids.taskId,
          order: order, //  order  1 按作者升序 2 按作者降序  3 时间升排序 4 时间降排序
        }
        this.$HTTP("post", "/stagetask_get_filelist", obj, $("#app")[0])
        .then(res => {

          this.fileList = res.result;
          for(let x of this.fileList) {
            let returnObj = this.addFileAttr(x);
            x = Object.assign(x, returnObj);
          }
          // console.log("获取文件列表", this.fileList);
          reslove(this.fileList);
        })
        .catch(err => {
          console.log("获取文件列表失败", err);
          reject(err);
        });
      });
    },
    // 获取文件
    getData() {
      return new Promise((reslove, reject) => {
        let obj = {
          myUserId: this.ids.userId,
          projectId: this.ids.projectId,
          stageId: this.ids.stageId,
          taskId: this.ids.taskId,
        }
        this.$HTTP("post", "/stagetask_get", obj, $("#app")[0])
        .then(res => {
          let result = [...res.result.fileList];
          for(let ele of result) {
            for(let y of ele.fileList) {
              let returnObj = this.addFileAttr(y);
              y = Object.assign(y, returnObj);
            }
          }
          this.fileGroup = [...result];
          reslove(this.fileGroup);
        })
        .catch(err => {
          console.log("获取任务详情失败", err);
          this.$message.error("获取任务详情失败，请检查网络");
          reject(err);
        });
      });
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
        formatTime: this.format(new Date(obj.CreateTime), 'yyyy/MM/dd HH:mm')
      }
      data.UrlMin = this.fileTypeImg[data.FileType].src;
      return data;
    },
    // 回选
    returnSelection(sort) {
      let list = this.selectedList;
      if(sort) {
        for(let y  of this.fileList) {
          let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
          indexs !== -1 && (y.checked = list[indexs].checked);
        }
        this.fileList = this.fileList.concat();
      }else {
        for(let x of this.fileGroup) {
          for(let y  of x.fileList) {
            let indexs = list.findIndex(ele => ele.FilePkid == y.FilePkid);
            indexs !== -1 && (y.checked = list[indexs].checked);
          }
        }
        this.fileGroup = this.fileGroup.concat();
      }
    }
  },
  async created() {
    this.selectedList = [...this.checkedFileList];
    try {
      await this.getData();
      await this.returnSelection();
    }catch(err) {
      console.log(err);
    }
    

    // 进行文件多选的回选
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
  }
}
</style>