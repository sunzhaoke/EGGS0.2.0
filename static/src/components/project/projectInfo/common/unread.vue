<template>
    <div class="unread_list">
        <p class="unread_list_top" @click.stop="() => {}">未读成员</p>
        <ul class="unread_list_ul" @click.stop="() => {}">
             <li
                v-for="(item, index) in lists"
                :key="index"
                >
                <img  class="header" :src="item.Images" alt="">
                <span class="names">{{item.Realname}}</span>
            </li>
        </ul>
        <div class="unread_list_bot">
            <button v-if="teskRemind" class="main_button_bg" @click.stop="remind">一键提醒</button>
            <button v-else class="main_button_disabled_bg" disabled>已提醒</button>
        </div>
        <div class="arrow_div">
           <div class="arrow_box"></div>
       </div>
    </div>
</template>
<script>
import { people } from '../data.js';
import { mapState } from 'vuex';

export default {
    props: ["list"],
    computed: {
        ...mapState(['teskRemind']),

    },
    data() {
        return {
            lists: [...people],
        }
    },
    methods: {
       remind() {
           this.$emit('handleRemind');
       }
    },
    created() {
     
    }
}
</script>
<style lang="less">
@import "../../../../../assets/css/base.less";
.unread_list {
    position: absolute;
    top: 30px;
    left: -20px;
    box-shadow:0px 1px 8px 0px rgba(59,81,133,0.3);
    -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
    -moz-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
    -webkit-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
    -moz-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
    width: 135px;
    background: #fff;
    .border_radius(@br: 4px;);
    z-index: 10;
    .unread_list_top {
        width: 100%;
        height: 38px;
        line-height: 38px;
        padding-left: 14px;
        .box_sizing;

    }
    .unread_list_ul {
        max-height: 160px;
        overflow: auto;
        border-top: 1px solid @bg-f2f2f2;
        border-bottom: 1px solid @bg-f2f2f2;;
        li {
            height: 32px;
            line-height: 32px;
            .header {
                vertical-align: middle;
                margin-left: 14px;
            }
            .names {
                vertical-align: middle;
                margin-left: 10px;
                .dis-in-bl;
                width: 70px;
                .word_over;
            }

            &:hover {
                background: @bg-f2f2f2;
            }
         
        }
    }

    .unread_list_bot {
        height: 50px;
        line-height: 50px;
        text-align: center;
        button {
            vertical-align: middle;
        }
    }
    .arrow_div {
        position: absolute;
        top: -10px;
        left: 35px;
        width: 12px;
        height: 12px;
        overflow: hidden;
        .arrow_box {
            width: 8px;
            height: 8px;
            box-shadow:0px 1px 8px 0px rgba(59,81,133,0.3);
            -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
            -moz-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
            -webkit-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
            -moz-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
            background: #fff;
            transform: rotate(45deg);
            margin-top: 7px;
        }
    }
}

</style>




