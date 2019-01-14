<template>
    <div class="demand_view_yun">
        <div class="top_box">
            <div class="left fl">
            <el-checkbox 
                v-if='checkedList.length' 
                class="all_checked" 
                v-model="fileCheckbox" 
                @change='fileCheckboxAll'
                >
                已选<span class="mainColor">{{checkedList.length}}</span>项
            </el-checkbox>
            <el-checkbox 
                v-else 
                class="all_checked" 
                v-model="fileCheckbox" 
                @change='fileCheckboxAll'>全选</el-checkbox>
                <template v-if='checkedList.length'>
                     <el-tooltip effect="dark" content="下载" placement="top" :open-delay="300">
                        <i class="iconfont icon-xiazai" @click='multipleDownload'></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="收藏" placement="top" :open-delay="300">
                        <i class="iconfont icon-shoucang1"></i>
                    </el-tooltip>
                </template>
            </div>
        </div>
        <div class="demand_box">
            <div 
                class="demand_group"
                v-for='(demand, index) in demandList'
                :key='demand.demandId'
                >
                <div class="demand_desc">
                    <div class="desc_top">
                        <span class="header_img">
                            <el-tooltip effect="dark" :content="demand.nickName ? demand.nickName : demand.userName" placement="top" :open-delay="300">
                                <img :src="demand.UserPic" alt="" class="header">
                            </el-tooltip>
                        </span>
                        <div class="right_info fr">
                            <span class="stage_name">{{demand.oldstageTitle}}</span>
                            <span class="line"></span>
                            <span class="time">{{demand.createTime}}</span>
                        </div>
                    </div>
                   
                    <div class="desc_content">{{demand.descn}}</div>
                </div>
                <div class="file_group">
                     <div 
                        class="parths_group clearfix"
                        v-for="(group, index1) in demand.fileList"
                        :key="group.Pkid"
                        >
                        <!-- 分组的头部操作 -->
                        <div class="group_top">
                            <span class="group_name">{{group.GroupName}}</span>
                            <div class="group_operate fr">
                                <span 
                                v-if='group.packUp' 
                                @click='groupExtendToggle(index, index1, true)'
                                class='mainColor_underline_text'
                                >收起</span>
                                 <el-dropdown class="fixed file_more">
                                        <span class="el-dropdown-link"><i class='iconfont icon-gengduo1'></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                          <el-dropdown-item @click.native="fileGroupCommand('download', index1, group, index)">下载</el-dropdown-item>
                                          <el-dropdown-item @click.native="fileGroupCommand('collect', index1, group, index)">收藏</el-dropdown-item>
                                        </el-dropdown-menu>
                                      </el-dropdown>
                            </div>
                        </div>

                        <!-- 折叠成一行的时候 -->
                        <div 
                            v-if='group.packUp === false'
                            class="group_file"
                            >
                            <div 
                                class="every_file"
                                v-for="(item, index2) in group.overList"
                                :key="item.FilePkid"
                                :groupid='group.pkid'
                                :id='item.FilePkid'
                                :filename='item.FileName'
                                @mouseenter="enterFile(item)"
                                @mouseleave="leaveFile(item)"
                                @click='groupExtendToggle(index, index1, item)'
                                >
                                <template v-if='item.overLength'>
                                    <span class="file_pic">
                                        <span
                                        class="more" 
                                        v-for='(pic, indexs) in item.UrlMin'
                                        :key='indexs'
                                        >
                                            <img :src="pic" alt="
                                        ">
                                        <span class="none"></span>
                                        </span>
                                        <span class="more"><img class="more" src="../style/more.png" alt=""></span>
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
                                        <p class="title">{{item.FileName}}</p>
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
                                            <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item, [index, index1])"></el-checkbox>
                                          </span>
                                          <el-dropdown class="fixed file_more">
                                            <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                            <el-dropdown-menu slot="dropdown">
                                              <el-dropdown-item @click.native="fileCommand('download', index2, item, group.pkid, index1)">下载</el-dropdown-item>
                                              <el-dropdown-item @click.native="fileCommand('collect', index2, item, group.pkid, index1)">收藏</el-dropdown-item>
                                            </el-dropdown-menu>
                                          </el-dropdown>
                                    </div>
                                </template>
                            </div>
                            <div class="null"></div>
                        </div>

                        <!-- 展开的时候 -->
                        <div 
                            v-else
                            class="group_file"
                            >
                            <div 
                                class="every_file"
                                v-for="(item, index2) in group.FileItemList"
                                :key="item.FilePkid"
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
                                    <p class="title">{{item.FileName}}</p>
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
                                        <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item, [index, index1])"></el-checkbox>
                                    </span>
                                    <el-dropdown class="fixed file_more">
                                        <span class="el-dropdown-link"><i class='iconfont icon-gengduo'></i></span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="fileCommand('download', index2, item, group.pkid, index1)">下载</el-dropdown-item>
                                            <el-dropdown-item @click.native="fileCommand('collect', index2, item, group.pkid, index1)">收藏</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                            <div class="null"></div>
                        </div>
                        <div  v-if='demand.fileList.length - 1 > index1' class="group_line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    props: ['list'],
    data() {
        return {
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
            ], // 附件icon
            checkedList: [],
            fileCheckbox: false,
            demandList: [],
            fileLists: [],
            fileBoxW: 182, // 188 // 文件元素盒子的宽度
            fromType: 3, // 3--多选 4--分组 5 单个文件
            filePartitionId: 0,
            operateParth: {},
            operateFile: {},
            demandId: '',


        }
    },  
    computed: {
        ...mapState([
            'taskIds'
        ]),
        // 是否有一个文件被选中
        oneChecked() {
            if(this.checkedList && this.checkedList.length) {
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        // 文件组折叠/展开
        groupExtendToggle(index, index1, item) {
            if(item !== true && !item.overLength) {return}
            this.demandList[index].fileList[index1].packUp = !this.demandList[index].fileList[index1].packUp;
            this.demandList = this.demandList.concat();

        },

        // 组的更多操作
        fileGroupCommand(type, index1, group, index) {
            this.fromType = 4;
            this.filePartitionId = group.pkid;
            this.operateParth = Object.assign({}, group, {index: index1});
            if(group.Pkid === 0) {
                this.demandId = this.demandList[index].demandId;
            }else {
                this.demandId = '';
            }

            if(type === 'download') { // 下载
                this.fileDownlod(group);
                return;
            }
            if(type === 'collect') { // 收藏
                return;
            }

        },

        // 文件的更多操作
        fileCommand(type, index2, item, groupId, index1) {
            this.fromType = 5;
            this.operateFile = Object.assign({}, item, {index: index2, groupId: groupId, groupIndex: index1});
            if(type === 'download') { // 下载
                this.fileDownlod(item);
                return;
            }
            if(type === 'collect') { // 收藏
                return;
            }
            
        },

        // 鼠标移入文件
        enterFile(item) {
            item.hover = true;
            this.demandList = this.demandList.concat();

        },
        // 鼠标移出文件
        leaveFile(item) {
            item.hover = false;
            this.demandList = this.demandList.concat();
        },

        // 文件全选
        fileCheckboxAll(val) {
            this.checkedList = [];
            for(let x of this.demandList) {
                for(let y of x.fileList) {
                    for(let z of y.FileItemList) {
                        if(val) {
                            z.checked = true;
                            this.checkedList.push(z);
                        }else {
                            z.checked = false;
                        }
                    }
                }
            }
            this.demandList = this.demandList.concat();
        },
        // 文件的选中状态发生改变
        everyFileCheckbox(val, item, indexArr) {
            const index1 = indexArr[0];
            const index2 = indexArr[1];
            let listMax = this.demandList[index1];
            let listMin = this.demandList[index1].fileList[index2];
            let x1,x2, indexs;
            if(val) {
                this.checkedList.push(item);
                let arr = [];
                for(let x of this.demandList) {
                    for(let y of x.fileList) {
                        for(let z of y.FileItemList) {
                            arr.push(z.checked);
                        }
                    }
                }
                x1 = arr.findIndex(ele => !ele);
                x1 === -1 ? this.fileCheckbox = true : this.fileCheckbox = false;

            }else {
                indexs = this.checkedList.findIndex(ele => ele.FilePkid === item.FilePkid);
                indexs !== -1 && (this.checkedList.splice(indexs, 1));
                this.fileCheckbox && (this.fileCheckbox = false);
            }
            this.demandList = this.demandList.concat();
        },


        // 多选下载
        multipleDownload() {
            this.fromType = 3;
            this.fileDownlod();
            console.log('demandView--download');
        },


        // 文件下载
        fileDownlod(item) {
            // fromType: 3, // 3--多选 4--分组 5 单个文件
            let link = "";
            if(this.fromType === 5) {
                link = $(
                '<a href="' +
                    item.Url +
                    '" download="' +
                    item.FileName +
                    '" target="_blank"></a>'
                );
                link.get(0).click();
            }else if (this.fromType === 3 && this.checkedList.length === 1) {
                link = $(
                '<a href="' +
                    this.checkedList[0].Url +
                    '" download="' +
                    this.checkedList[0].FileName +
                    '" target="_blank"></a>'
                );
                link.get(0).click();
                this.fileCheckboxAll(false); // 多选操作完成后把选中状态还原
            } else {
                let ids = [];
                if(this.fromType === 3) {
                    for(let x of this.checkedList) {
                        ids.push(x.FilePkid);
                    }
                }else if(this.fromType === 4) {
                    ids.push(item.Pkid);
                }
                // console.log(`/EggsWebService.asmx/zipFileDown?stageId=${this.taskIds.stageId}&taskId=${this.taskIds.taskId}&demandId=${this.demandId}&vals=${ids.join(',')}&type=${this.fromType}`);
                link = $(
                `<a href="/EggsWebService.asmx/zipFileDown?stageId=${this.taskIds.stageId}&taskId=${this.taskIds.taskId}&demandId=${this.demandId}&vals=${ids.join(',')}&type=${this.fromType}" download="....zip" target="_blank"></a>`
                );
                link.get(0).click();
                if(this.fromType === 3) {
                    this.fileCheckboxAll(false); // 多选操作完成后把选中状态还原
                } 
            }
        },
           // 窗口/元素大小变化对文件分组收起时的影响
        sizeChange() {
             for(let x = 0; x < this.demandList.length; x++) {
                let xx = this.demandList[x];
                for(let y = 0; y < xx.fileList.length; y++) {
                    this.countFileMore(y, x);
                }
            }
        },

        // 计算需要折叠的文件个数--分组折叠成一行
        countFileMore(i,n) {
            this.$nextTick(() => {
                const w = $(".group_file")
                .eq(0)
                .width();
                const x = Math.floor(w / this.fileBoxW);
                let newObj = this.demandList[n].fileList[i];
                let list = [...newObj.FileItemList];
                let length = list.length;
                if (length <= x) {
                    newObj.packUp = null;
                    this.demandList = this.demandList.concat();
                    return;
                }
                newObj.packUp = false;
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
                this.demandList[n].fileList[i] = Object.assign({}, newObj, {
                    overList: overList
                });
                this.demandList = this.demandList.concat();
                // console.log('countFileMore--', 'w--> ' + w, 'x--> ' + x, 'length==>' + newObj.FileItemList.length, newObj);
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
                FileType: this.getFlieTyle(obj.Type)
            }
            if (data.FileType !== 1) {
                data.UrlMin = this.fileTypeImg[data.FileType].src;
            }
            return data;
        },

        // 数据的获取和设置
        setData() {
            this.demandList = [...this.list];
            for(let x = 0; x < this.demandList.length; x++) {
                let xx = this.demandList[x];
                xx.createTime = this.format(new Date(xx.createTime), 'MM/dd HH:mm');
                for(let y = 0; y < xx.fileList.length; y++) {
                    this.$set(xx.fileList[y], 'packUp', null);
                    this.countFileMore(y, x);
                    for(let z of xx.fileList[y].FileItemList) {
                        let returnObj = this.addFileAttr(z);
                        z = Object.assign(z, returnObj);
                    }
                }
            }
            console.log('相关需求~~~~', this.demandList);
        },
    },
    created() {
        this.setData();
    },
    mounted() {
        // 监听窗口变化
        window.onresize = () => {
        this.sizeChange();
        }
    }
}
</script>
<style lang='less'>
    @import "../../../../assets/css/base.less";

    .demand_view_yun {
        width: 100%;
        height: 100%;
        background: #ffffff;
        .demand_box {
            width: 100%;
            height: calc(100% - 40px);
            padding: 0 24px;
            .box_sizing;
            overflow: auto;
            .demand_group {
                &:not(:first-child) {
                    margin-top: 40px;
                    border-top: 1px solid @bg-f2f2f2;
                }
                .demand_desc {
                    width: 100%;
                    .desc_top {
                        height: 40px;
                        line-height: 40px;
                        background: #F8FAFD;
                        .header_img {
                            margin-left: 4px;
                        }
                        .right_info {
                            .time {
                                color: @grayNight;
                                margin-right: 4px;
                            }
                        }
                    }
                    .desc_content {
                        line-height: 1.7;
                        margin-top: 16px;

                    }
                }
                .file_group {
                    .parths_group {
                        .group_top {
                            margin-top: 16px;
                        }
                        .group_file {
                            margin-left: -24px;
                            .every_file {
                                margin-left: 24px;
                                margin-top: 16px;
                            }
                        }
                    }

                    .group_line {
                        width: 100%;
                        height: 1px;
                        background: #E6E6E6;
                        margin-top: 16px;
                    }
                }
            }
        }
    }
</style>


