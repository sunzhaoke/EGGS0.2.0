<template>
    <div class="extend_file_summary popup">
        <div class="popup_none">
            <div class="popup_box">
                <div class="popup_top">
                    <span class="popup_title">文件汇总</span>
                    <i class="iconfont icon-close fr" @click="cancel"></i>
                </div>
                <div class="popup_content">
                    <div class="search">
                        <el-input
                            class="inputs  fl"
                            placeholder="搜索您的文件"
                            v-model="searchValue"
                            @input="searchChange"
                            size="small"
                            prefix-icon="el-icon-search"
                            clearable
                        >
                        </el-input>
                        <i class="iconfont icon-xinyuandan fl" :class="collectFlag ? 'collect_filter' : ''" @click="collectFilter"></i>
                        
                    </div>
                    <div class="filter">
                        <div class="fl" v-for="(ele, index) in filterTypes" :key="index" @click.stop="changeFilterType(index)">
                            <span :class="nowFilterType === index ? 'names selected_color' : 'names'">{{ele}}</span><span class="lines"></span>
                        </div>
                    </div>
                    <div class="file_content">
                        <div 
                        class="content_every fl"
                        v-for="item in lists"
                        :key="item.Pkid"
                        @mouseenter="demandfileEnter(item)"
                        
                        >
                        <div class="content_every_left fl">
                            <img :src="item.Url" alt="" :class="item.FileTypeNum === 1 ? 'is_img' : 'not_img'">
                            <el-tooltip v-if="item.collect" class="item item_is_collect" effect="dark" content="取消收藏" placement="top">
                            <i class="iconfont icon-shoucang2 is_collect" @click.stop="demandCommand('collect')"></i>
                            </el-tooltip>
                            <el-tooltip v-else class="item item_not_collect" effect="dark" content="点击收藏" placement="top">
                            <i class="iconfont icon-shoucang2 not_collect" @click.stop="demandCommand('collect')"></i>
                            </el-tooltip>
                        </div>
                        <div class="content_every_right fl">
                            <span class="names">{{item.Title}}.{{item.FileType}}</span><br>
                            <span class="froms">{{item.Uname}}</span>
                        </div>
                        <el-checkbox v-if="batchOperateFlag" v-model="item.checked" @change="fileSelected" class="more_operate"></el-checkbox>
                        <el-dropdown v-if="!batchOperateFlag" class="more_operate more_gengduo" @command="demandCommand">
                            <i class="iconfont icon-gengduo"></i>
                            <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="download">下载</el-dropdown-item>
                            <el-dropdown-item command="collect">{{item.collect ? '取消收藏' : '收藏'}}</el-dropdown-item>
                            <el-dropdown-item command="delete">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        </div>
                    </div>
                </div>
                <div class="popup_bottom">
                    <div v-if="batchOperateFlag" class="batch_operate dis-in-bl fr">
                        <span class="batch_collect" @click="batchCollect"><i class="iconfont icon-shoucang2"></i>收藏</span>
                        <span class="batch_download" @click="batchDownload"><i class="iconfont icon-xiazai"></i>下载</span>
                    </div>
                    <span v-if="!batchOperateFlag" class="all_download" @click="batchOperate"><i class="iconfont icon-piliangjiebang"></i>批量操作</span>
                    <span v-else class="all_download" @click="batchOperate"><i class="iconfont icon-quxiao"></i>取消</span>
                    <span v-if="batchOperateFlag" class="batch_selected"><el-checkbox v-model="batchSelectedAll" @change="batchSelected">全选</el-checkbox></span>

                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    props: ["file"],
    data() {
        return {
            lists: [...this.file],
            listsCopy:  [...this.file],
            searchValue: '',
            filterTypes: ["全部", "Word","Excel","Powerpoint","PDF","图片", "音频", "视频", "压缩包", "其他"], // 文件类型列表
            nowFilterType: 0, // 当前筛选的文件类型
            demandfileItem: '', // 现在选中的需求文件
            batchOperateFlag: false, // 是否点击了批量操作
            batchSelectedAll: false, // 是否全选
            clickFilterNum: 0, // 是否是第一次点击文件筛选图标
            collectFlag: false, // 是否点击筛选收藏

        }

    },
    methods: {
        // 点击取消
        cancel() {
            // 返回info页面
            this.$emit("handleCancel");

        },

        // 搜索框 收藏 类型 的搜索
        filters(search, collect, type) {
            let copyList = [...this.listsCopy];
            search = search.toUpperCase();
            if(search !== '' && collect) {
               copyList.map(ele => ( ele.newName = ele.Title + '.' + ele.FileType));
                this.lists = copyList.filter(ele => {
                    return ele.newName.toUpperCase().indexOf(search) !== -1 && ele.collect === true;
                });
                this.lists = this.getFilterList(type, this.lists);
            }else if(search !== '' && !collect) {
                copyList.map(ele => ( ele.newName = ele.Title + '.' + ele.FileType));
                this.lists = copyList.filter(ele => {
                    return ele.newName.toUpperCase().indexOf(search) !== -1;
                });
                this.lists = this.getFilterList(type, this.lists);

            }else if(search == '' && collect) {
                this.lists = copyList.filter(ele => {
                     return ele.collect === true;
                });
                this.lists = this.getFilterList(type, this.lists);

            }else {
                if(type) {
                    this.lists = this.getFilterList(type, copyList);
                }else {
                    this.lists = copyList;
                }
            }
            
        },

        // 输入框值改变
        searchChange(val) {
            this.searchValue = val;
            this.filters(this.searchValue, this.collectFlag, this.nowFilterType);
        },

        // 点击筛选收藏的
        collectFilter() {
            this.collectFlag = !this.collectFlag;
            this.filters(this.searchValue, this.collectFlag, this.nowFilterType);
            
        },
        // 改变文件汇总的文件筛选类型
        changeFilterType(index) {
            this.nowFilterType = index;
            this.filters(this.searchValue, this.collectFlag, this.nowFilterType);
        },
        
        // 鼠标引入需求文件
        demandfileEnter(item) {
            this.demandfileItem = item;
        },

        // 点击需求文件的收藏和取消收藏
        demandCommand(val) {
            console.log(val);
            if(val === 'download') { // 下载

            }else if(val === 'collect') { // 收藏/取消收藏
                this.demandfileItem.collect = !this.demandfileItem.collect;
            }else { // 删除

            }
            // 发送请求
        },
        // 点击每个文件的选择框
        fileSelected(val) {
            if(this.batchSelectedAll && !val) {
                this.batchSelectedAll = val;
                return;
            }
            let num = 0;
            for(let x of this.lists) {
                if(x.checked === val) {
                num++;
                }
            }
            console.log(num);
            if(num === this.lists.length) {
                this.batchSelectedAll = val;
            }
        },
        
        // 文件汇总中获取筛选的文件
        getFilterList(index, list) {
            // let copyList = [...this.listsCopy];
            let copyList = [...list];
            
            switch(index) {
                case 1: 
                return copyList = copyList.filter( ele => {
                    return ele.FileTypeNum === 2;
                });
                break;
                case 2: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 3;
                });
                break;
                case 3: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 5;
                });
                break;
                case 4: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 6;
                });
                break;
                case 5: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 1;
                });
                break;

                case 6: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 7;
                });
                break;
                case 7: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 8;
                });
                break;
                case 8: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 9;
                });
                break;
                case 9: 
                return copyList.filter( ele => {
                    return ele.FileTypeNum === 0;
                });
                break;

                default: 
                return copyList;
            }
        },

        // 点击批量操作
        batchOperate() {
            this.batchOperateFlag = !this.batchOperateFlag;
        },


        // 点击全选按钮
        batchSelected(val) {
            this.batchSelectedAll = val;
            
            this.lists.map(x => {
                return x.checked = val;
            });
        },

        // 点击每个文件的选择框
        fileSelected(val) {
            if(this.batchSelectedAll && !val) {
                this.batchSelectedAll = val;
                return;
            }
            let num = 0;
            for(let x of this.lists) {
                if(x.checked === val) {
                num++;
                }
            }
            console.log(num);
            if(num === this.lists.length) {
                this.batchSelectedAll = val;
            }
        },

        // 需求文件的一键下载
        allDownload() {

        },

        // 批量收藏
        batchCollect() {
            let collectList = [];
            for(let y of this.lists) {
                if(y.checked && !y.collect) {
                y.collect = true
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
            if(this.batchSelectedAll) {
                checkedList = this.lists;
            }else {
                for(let x of this.lists) {
                if(x.checked) {
                    checkedList.push(x);
                }
                }
            }
            return checkedList;
            
        },


    },
    mounted() {
        this.listsCopy = [...this.lists];

    }
}
</script>
<style lang="less">
@import "../../../assets/css/base.less";
.extend_file_summary {
    .selected_color {
        color: @mainColor !important;
    }
    
    .popup_box {
        width: 772px;
        height: 540px;

        .popup_content {
            .search {
                width: 100%;
                padding: 14px 0;
                padding-left: 33px;
                .box_sizing;
                overflow: hidden;
                .inputs {
                    .el-input__inner {
                        border-color: @bg-f2f2f2;
                    }
                    .dis-in-bl;
                    width:670px;
                    height: 30px;
                    line-height: 30px;
                    vertical-align: middle;
                    
                }
                .icon-xinyuandan {
                    padding: 0 12px;
                    color: #7E7E7E;
                    line-height: 30px;
                    &:hover {
                        color: @mainColor;
                    }
                }

                .collect_filter {
                    color: @starColor;
                    &:hover {
                        color: @starColor !important;
                    }
                }
               
            }

            .filter {
                padding-left: 10px;
                height: 24px;
                .box_sizing;
                div {
                    &:nth-of-type(10) {
                        .lines {
                            display: none;
                        } 
                    } 
                  width: 74px;
                  text-align: center;
                  position: relative;
                  margin: 5px 0;
                  .cur;

                  .names {
                    color: @graySix;
                  }
                
                  .lines {
                    .dis-in-bl;
                    width:1px;
                    height:14px;
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

            .file_content {
                width: 720px;
                height: 323px;
                margin-left: 33px;
                margin-top: 10px;
                overflow: auto;

                .content_every {
                    width: 164px;
                    height: 58px;
                    background: #F6F6F6;
                    .border_radius(@br: 4px;);
                    margin-bottom: 14px;
                    border: 1px solid #F6F6F6;
                    position: relative;
                    .box_sizing;
                    .cur;
                     &:nth-of-type(4n-1) {
                    margin-left: 13px;
                    margin-right: 13px;
                    }
                    &:nth-of-type(4n-2) {
                        margin-left: 13px;
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
                        .item_is_collect, .item_not_collect {
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
                        line-height: 1.5;
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
                        .item_not_collect, .more_gengduo {
                        display: inline-block;
                        }
                    }

                }
            }

        }

        .popup_bottom {
            height: 70px;
            line-height: 70px;
            border-top: 1px solid @bg-f2f2f2;
            padding-left: 33px;
            .box_sizing;
          .iconfont {
            font-size: 14px;
            padding-right: 4px;
          }
          .all_download:hover {
            color: @mainColor;
              .iconfont {
                  color: @mainColor;
              }
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
           .batch_download {
               margin: 0 42px 0 14px;
           }
          .batch_collect, .batch_download {
            .dis-in-bl;
            width: 92px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid @mainColor;
            .border_radius(@br: 4px;);
            .box_sizing;
            color: @mainColor;
              .iconfont {
                color: @mainColor;
              }
            .cur;
            &:hover {
              color: @mainHover;
              .iconfont {
                color: @mainHover;
              }
            }
          }
        }
    }
}
</style>


