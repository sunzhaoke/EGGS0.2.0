<template>
    <div class="no_task">
        <div class="no_task_content">
            <img src="../../assets/img/404.png" alt="">
            <p>您所访问的任务已被删除，即将返回任务目录 <span>（{{times}}）</span></p>
            <div class="return_back" @click="returnBack">立即返回</div>
        </div> 
    </div>
</template>
<script>
export default {
    data() {
        return {
            times: 5,
            setTime: null
        }
    },
    methods: {
        returnBack() {
            this.$router.push('/notice');
        }
    },
    created() {
        this.setTime = setInterval(() => {
            this.times--;
            if(this.times <= 0) {
                clearInterval(this.setTime);
                this.setTime = null;
                this.$router.push('/notice');
            }
        }, 1000);
    },
    beforeDestory() {
        clearInterval(this.setTime);
        this.setTime = null;
    }
    
}
</script>
<style lang="less">
    .no_task {
        position: fixed;
        width: 100%;
        height: calc(100vh - 50px);
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 11;
        background: #FFFFFF;
        .no_task_content {
            width: 450px;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -55%);
            img {
                width: 450px;
                height: 225px;
            }
            p {
                margin-top: 70px;
                margin-bottom: 50px;
            }
            .return_back {
                width: 100px;
                height: 30px;
                line-height: 30px;
                color: #FFFFFF;
                background: #3684FF;
                box-shadow: 0px 2px 4px 0px rgba(16,79,176,0.47);
                border-radius: 2px;
                margin: 0 auto;
                cursor: pointer;

            }
        }
    }
</style>


