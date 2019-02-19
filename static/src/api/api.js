const MyApi = {};
MyApi.install = function (Vue, options) {
    // urls: 请求地址; obj: 参数;
    // type: 请求方式(默认是get); headers: 请求头
    Vue.prototype.$HTTP = function (type, urls, obj, load) {
         if(load) {
          var loading = this.$loading({
            target: load,
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255,255,255, 0.3)'
          });
        }
        let obj1 = Object.assign({}, obj);
        let key = "4951841F25AF0C695331B3F3C0369089";
        for(let x in obj) {
            obj[x] = encodeURIComponent(obj[x]);
        }
       
        obj1.key = key;
        obj.sign = objSortJoin(obj1);
        if (type === 'post') {
            let axios = {
                method: type,
                url: urls === 'file' ? '/img.ashx' : this.global.urlPath + urls,
                data: this.$qs.stringify(obj),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': urls === 'file' ? 'application/x-www-form-urlencoded' : 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return this.$axios(axios).then(res => {
                if(load) {
                  loading.close();
                }
                return res.data;
                
            }).catch(err => {
                if(load) {
                    loading.close();
                }
            });
        }
        if (type === 'get') {
            return this.$axios({
                method: type,
                url: this.global.urlPath + urls,
                params: obj,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then(res => {
                // if(load) {
                //   loading.close();
                // }
                return res.data;
            });
        }
    }
    var UTF8 = (str) => {
        if(window.TextEncoder) {
        var encoder = new TextEncoder('utf8');
        var bytes = encoder.encode(str);
        var result = '';
        for(var i = 0; i < bytes.length; ++i) {
        result += String.fromCharCode(bytes[i]);
        }
        return result;
        }else {
        return eval('\''+encodeURI(str).replace(/%/gm, '\\x')+'\'');
        }
        }
    // 参数加密
    var objSortJoin = (obj) => {
        let upperJSONKey = (jsonObj) => {
            for (var key in jsonObj){
                jsonObj[key.toUpperCase()] = jsonObj[key];
                delete(jsonObj[key]);
            }
            return jsonObj;
        }
        let arys = upperJSONKey(obj);
        var newkey = Object.keys(arys).sort();
        var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {
          //遍历newkey数组
          newObj[newkey[i]] = arys[newkey[i]];
          //向新创建的对象中按照排好的顺序依次增加键值对
        }
        let str = '';    
        for (let i in newObj) {
            newObj[i] = encodeURIComponent(newObj[i]);
            str += i + '=' + newObj[i] + '&';
        }
        str = str.slice(0, str.length - 1);
        str = str.toLocaleUpperCase(); 
        str = Vue.prototype.$md5(str);
        str = str.toLocaleUpperCase();
        return str; //返回排好序连接好的新对象
    }


    // 时间格式化
    Vue.prototype.format = (dt, type) => {
        let str = ""; //存储时间的字符串
        //获取年
        let year = dt.getFullYear();
        //获取月
        let month = dt.getMonth() + 1;
        //获取日
        let day = dt.getDate();
        //获取小时
        let hour = dt.getHours();
        //获取分钟
        let min = dt.getMinutes();
        //获取秒
        let sec = dt.getSeconds();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        if(!type) {
            return str = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
        }
        if(type == 'yyyy-MM-dd HH:mm:ss') {
            return str = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
        }
        if(type == 'yyyy/MM/dd HH:mm:ss') {
            return str = year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
        }
        if(type == 'yyyy-MM-dd HH:mm') {
            return str = year + "-" + month + "-" + day + " " + hour + ":" + min;
        }
        if(type == 'yyyy/MM/dd HH:mm') {
            return str = year + "/" + month + "/" + day + " " + hour + ":" + min;
        }
        if(type == 'yyyy-MM-dd') {
            return str = year + "-" + month + "-" + day;
        }
        if(type == 'yyyy/MM/dd') {
            return str = year + "/" + month + "/" + day;
        }
        if(type == 'HH:mm:ss') {
            return str = hour + ":" + min + ":" + sec;
        }
        if(type == 'HH:mm') {
            return str = hour + ":" + min;
        }
        return str = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    }

    // 字节转换
    Vue.prototype.conver = (limit) => {
        var size = "";
        if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
            size = limit.toFixed(2) + "B";
        } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + "KB";
        } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        } else { //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }

        var sizestr = size + "";
        var len = sizestr.indexOf("\.");
        var dec = sizestr.substr(len + 1, 2);
        if (dec == "00") {//当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
        }
        return sizestr;
    }

    // 获取文件名后缀
    Vue.prototype.getSuffix = (filename) => {
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var suffix = filename.substring(index1 + 1, index2);//后缀名
        return suffix;
    }

    // 判断文件类型
    Vue.prototype.getFlieTyle = (surffix) => {
        surffix = surffix.toLocaleLowerCase();
        if (surffix === 'png' || surffix === 'jpeg' || surffix === 'jpg' || surffix === 'gif' || surffix === 'bmp') {
            return 1;
        } else if (surffix === 'doc' || surffix === 'docx') {
            return 2; // 文档
        } else if (surffix === 'xls' || surffix === 'xlsx') {
            return 3; // 表格
        } else if (surffix === 'psd') {
            return 4; // PS
        } else if (surffix === 'ppt' || surffix === 'pptx') {
            return 5; // ppt
        } else if (surffix === 'pdf') {
            return 6; // pdf
        } else if (surffix === 'mp3' || surffix === 'wma' || surffix === 'wav' || surffix === 'ogg' || surffix === 'ra') {
            return 7; // 音频
        } else if (surffix === 'wmv' || surffix === 'avi' || surffix === 'mpg' || surffix === 'rmvb' || surffix === 'mp4') {
            return 8; //视频
        } else if (surffix === 'zip' || surffix === 'rar') {
            return 9; // 压缩包
        } else if (surffix === 'ai') {
            return 10; // ai
        } else if (surffix === 'txt') {
            return 11; // txt文本
        } else if (surffix === 'folder') {
            return 12; // txt文本
        } else {
            return 0; // 其他
        }
    }


    // 时间差计算
    Vue.prototype.timeDiff = (time) => {
        if(!time) {
            return {
                state: '',
                date: '',
            }
        }
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
        let year1 = dateEnd.getFullYear();
        //获取月
        let month = dateBegin.getMonth() + 1;
        let month1 = dateEnd.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        month1 = month1 < 10 ? '0' + month1 : month1;

        //获取日
        let day = dateBegin.getDate();
        let day1 = dateEnd.getDate();

        // 获取时
        let H = dateBegin.getHours();
        H = H < 10 ? '0' + H : H;

        // 获取时
        let Min = dateBegin.getMinutes();
        Min = Min < 10 ? '0' + Min : Min;


        let dd = new Date();
        dd.setDate(dd.getDate() - 2);
        let isQT = dd.getDate();
        if(isQT === day && dd.getMonth() + 1 === parseInt(month)) {
            isQT = true;
        }else {
            isQT = false;
        }

        let dd1 = new Date();
        dd1.setDate(dd1.getDate() - 1);
        let isZT = dd1.getDate();
        if(isZT === day && dd1.getMonth() + 1 ===  parseInt(month)) {
            isZT = true;
        }else {
            isZT = false;
        }

        let dd2 = new Date();
        dd2.setDate(dd2.getDate() - 3);
        let isLong = dd2.getDate();
        if(isLong === day && dd2.getMonth() + 1 ===  parseInt(month)) {
            isLong = true;
        }else {
            isLong = false;
        }

        // 1.刚刚（一分钟之内）
        // 2.XX分钟前（一分钟到一小时之间）
        // 3.XX小时前（一小时到24小时之间）
        // 4.昨天
        // 5.前天
        // 6.今年
        // 7.以前
        // console.log(time, dateDiff, " 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");

        if(year !== year1) {
            return year + '/' + month + '/' + day + ' ' + H + ':' + Min;
        }else if(dayDiff >= 3 || isLong) {
            return month + '/' + day + ' ' + H + ':' + Min;
        }else if(isQT) {
            return '前天 ' + H + ':' + Min;
        }else if(isZT) {
            return '昨天 ' + H + ':' + Min;
        }else if(dayDiff == 0 && day == day1) {
            if(hours > 0) {
                if(minutes > 0 || seconds > 0) {
                    return (hours + 1) + '小时前';
                }else {
                    return hours + '小时前';
                }
            }else if(minutes > 0){
                return minutes + '分钟前';
            }else {
                return '刚刚';
            }
            if(minutes > 0 || seconds > 0) {
                return (hours + 1) + '小时前';
            }else {
                return hours + '小时前';
            }
        }
        return;
        if(dateDiff <= 0) { // 未超时
            if(dayDiff == 0 && day == day1) { // 今日截止 state = 2
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
 
        
        // console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
        //     ,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");
            

    }
}
export default MyApi;
