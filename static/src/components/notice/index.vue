<template>
    <div class="notice_wrapper" @click.stop>
        <div class="notice_content">
            <div class="notice_top">
                <span class='fl'>通知</span>
                <span v-if='isAllRead' class="fr" @click.stop='clickAllRead'>标记全部已读</span>
                <span v-else class="fr cur_dis">标记全部已读</span>
            </div>
            <div class="notice_list" id='noticeList'>
                <template v-if='isAllRead'>
                    <div 
                        class="notice_every clearfix"
                        v-for='(item, index) in noticeList'
                        :key='item.Pkid'
                        >
                        <span class="left_header fl">
                            <img :src="item.userPic" alt="">
                        </span>
                        <div class="right_detail fl">
                            <div class="notice_from">{{item.userName}}</div>
                            <div class="notice_type" v-if='item.Type === 1'>已将你加入<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span></div>
                            <div class="notice_type" v-else-if='item.Type === 2'>已将你移出<span class="gray_night">{{item.Content}}</span></div>
                            <div class="notice_type" v-else-if='item.Type === 3'>已将你加入<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span>阶段</div>
                            <div class="notice_type" v-else-if='item.Type === 4'>已将你移出<span class="gray_night">{{item.Content}}</span>阶段</div>
                            <div class="notice_type" v-else-if='item.Type === 5'>评论<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span>：{{item.Content}}</div>
                            <div class="notice_type" v-else-if='item.Type === 6'>在评论 <span>{{item.userName}}</span>的<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span>时@你：{{item.Content}}</div>
                            <div class="notice_type" v-else-if='item.Type === 7'>已经完成工作并将文件移交给你</div>
                            <div class="notice_type" v-else-if='item.Type === 8'>已将<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span>交接给你</div>
                            <div class="notice_type" v-else-if='item.Type === 9'>已将<span class="mainColor_text" @click="enterDetail">{{item.Content}}</span>归档</div>
                            <div class="notice_time">{{item.showDate}}</div>
                        </div>
                        <i 
                        class='iconfont icon-yidu'
                        @click='clickRead(index)'
                        ></i>
                        <div class="bottom_line" v-if='index < noticeList.length - 1'></div>
                    </div>
                </template>
                <div v-else class="notice_empty">
                    <div class="empty_img"><img src="../../assets/img/notice_empty.png" alt=""></div>
                    <p>您还没有未读通知点击</p>
                    <p>点击<span class="mainColor_text" @click='seeAllNotice'>查看全部通知</span>查看所有通知</p>
                </div>
            </div>
            <div class="notice_bottom">
                <span class='fl' @click='seeAllNotice'>查看全部通知</span>
                <el-tooltip effect="dark" content="设置" placement="top" :open-delay="300">
                <i 
                    class='iconfont icon-shezhi1 fr'
                    @click='clickSet'
                    ></i>
                </el-tooltip>
            </div>  
        </div>
        <div class="arrow_div">
            <div class="arrow_box"></div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
            noticeList: []
        }
    },
    computed: {
        ...mapState(['unreadNum']),
        isAllRead() {
            let have = this.noticeList.findIndex(ele => !ele.isRead);
            if(have !== -1) {
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        ...mapMutations(['UNREAD_CHANGE']),

        // 点击查看所有通知
        seeAllNotice() {
            this.$router.push("/notice");
            this.$emit('enterAll');

        },

        // 标记全部已读
        clickAllRead() {
            let obj = { userId: this.userId };
            this.$HTTP("post", "/user_update_notificationStateAll", obj)
            .then(res => {
                this.UNREAD_CHANGE(0);
                this.noticeList = [];
            })
            .catch(err => {
                console.log("标记已读失败", err);
            });
        },

        // 点击标记已读
        clickRead(index) {
            let obj = { pkid: this.noticeList[index].Pkid };
            this.$HTTP("post", "/user_update_notificationState", obj)
            .then(res => {
                let num = this.unreadNum - 1;
                this.UNREAD_CHANGE(num);
                this.$nextTick(() => {
                    $('.notice_every').eq(index).hide(() => {
                        this.noticeList.splice(1, index);
                        this.noticeList = this.noticeList.concat();
                    });
                });
            })
            .catch(err => {
                console.log("标记已读失败", err);
            });
        },
        // 进入通知详情
        enterDetail() { 
            this.$router.push('/noTask');
        },

        // 点击设置
        clickSet() {

        },
        getNoticeList(page = 1, number = 20) {
            let obj = { page: page, number: number, userId: this.userId, enabled: 1 };
            this.$HTTP("post", "/user_get_notificationList", obj, $('#noticeList')[0])
            .then(res => {
                let result = [...res.result];
                console.log("消息列表", res.result);
                this.noticeList = result.filter(ele => ele.Enabled);
                this.noticeList.map(ele => ele.showDate = this.timeDiff(ele.CreateTime));
                if(this.noticeList.length && this.noticeList.length < Number(res.newsCont)) {
                    this.loadMoreShow = true;
                }else {
                    this.loadMoreShow = false;
                }
            })
            .catch(err => {
            console.log("消息列表获取失败", err);
            });
        },
    },
    created() {
        this.getNoticeList();
    },
}
</script>
<style lang='less'>
    @import "../../assets/css/base.less";
    .notice_wrapper {
        width: 380px;
        height: 453px;
        background: #FFFFFF;
        box-shadow:0px 1px 4px 0px rgba(59,81,133,0.3);
        border-radius: 4px;
        position: absolute;
        top: 39px;
        left: -158px;
        .notice_content {
            width: 100%;
            height: 100%;
            .notice_top {
                height: 55px;
                line-height: 55px;
                padding: 0 24px;
                .box_sizing;

                .fl {
                    font-weight: bold;
                    font-size: 16px;
                }  
                .fr {
                    color: @grayNight;
                    &:hover {
                        color: @mainColor;
                    }
                } 
            }
            .notice_list {
                width: 100%;
                height: 344px;
                border-top: 1px solid @bg-f2f2f2;
                border-bottom: 1px solid @bg-f2f2f2;
                overflow-x: hidden;
                overflow-y: auto;
                .notice_every {
                    width: 100%;
                    padding: 18px 0 16px 24px;
                    .box_sizing;
                    position: relative;
                    .icon-yidu {
                        display: none;
                        position: absolute;
                        top: 18px;
                        right: 24px;
                        font-size: 12px;
                        color: @grayNight;
                        &:hover {
                            color: @mainColor;
                        }
                    }
                    .left_header {
                        width: 28px;
                        height: 28px;
                        img {
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            .border_radius(@br: 4px;);
                        }
                    }
                    .right_detail {
                        margin-left: 10px;
                        .notice_from {
                            font-weight: bold;
                            text-align: left;
                            line-height: 1;
                        }
                        .notice_type {
                            text-align: left;
                            line-height: 1;
                            margin-top: 8px;
                            margin-bottom: 4px;
                            width: 290px;
                            .word_over;
                             .gray_night {
                                color: @grayNight;
                                padding: 0 5px;
                            }
                            .read_style {
                                color: @grayNight;
                                padding: 0 5px;
                                .cur;
                                &:hover {
                                    color: @mainColor;
                                    text-decoration: underline;
                                }
                        }
                        }
                        .notice_time {
                            color: @grayNight;
                            font-size: 12px;
                            text-align: left;
                            line-height: 1;

                        }
                    }
                    .bottom_line {
                        width: 330px;
                        position: absolute;
                        bottom: 0;
                        left: 24px;
                        border-bottom: 1px solid @bg-f2f2f2;

                    }
                    &:hover {
                        background: @bg-f2f2f2;
                        .icon-yidu {
                            display: inline-block;
                        }
                    }
                }
                .notice_empty {
                    .empty_img {
                        margin-top: 50px;
                        margin-bottom: 24px;
                    }
                    p {
                        line-height: 30px;
                        font-size: 12px;
                    }
                }
            }
            .notice_bottom {
                height: 54px;
                line-height: 54px;
                padding: 0 24px;
                .box_sizing;
                .fr {
                    font-size: 16px;
                    color: @graySix;
                    &:hover {
                        color: @mainColor;
                    }
                }  
                .fl {
                    color: @grayNight;
                    &:hover {
                        color: @mainColor;
                    }
                } 
            }
        }
        .arrow_div {
            position: absolute;
            top: -10px;
            left: 182px;
            width: 10px;
            height: 10px;
            overflow: hidden;
            .arrow_box {
            width: 6px;
            height: 6px;
            box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
            background: #fff;
            transform: rotate(45deg);
            margin-left: 2px;
            margin-top: 7px;
            }
        }
    }
</style>

