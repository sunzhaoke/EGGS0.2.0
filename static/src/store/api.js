
let timeDiff = (time) => {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    // var dateBegin = new Date(time.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateBegin = new Date(time);//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiffAbs = Math.abs(dateDiff);

    var dayDiff = Math.floor(dayDiffAbs / (24 * 3600 * 1000));//计算出相差天数
    var leave1=dayDiffAbs%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算出小时数
    //计算相差分钟数
    var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000) //计算出相差的秒数

    // 获取年月日
    //获取年
    let year = dateBegin.getFullYear();
    //获取月
    let month = dateBegin.getMonth() + 1;
    //获取日
    let day = dateBegin.getDate();
    let day2 = dateEnd.getDate();
    if(dateDiff <= 0) { // 未超时
        if(dayDiff == 0 && day == day2) { // 今日截止 state = 2
            return {
                countDown: ( minutes > 0 || seconds > 0 ) ? '剩余' + (hours + 1) + '小时' : '剩余' + hours + '小时',
                state: 2,
                date: '今日截止',
            }

        }else { // 到日期截止 state = 4;
            return {
                state: 4,
                date: month + '月' + day + '日截止',
            }
        }
    }else { // 已超时 state = 3
       
        if((dayDiff > 98) && (hours > 0 || minutes > 0 || seconds > 0)) {
            return {
                state: 3,
                date: '已超时99+天',
            }
        }else {
            return {
                state: 3,
                date: (hours > 0 || minutes > 0 || seconds > 0) ? '已超时' + (dayDiff + 1) + '天' : '已超时' + dayDiff + '天',
            }
        }
    }
    // console.log(time, dateDiff, " 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
    // console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
    //     ,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");

}

export {
    timeDiff
}