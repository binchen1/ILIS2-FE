import ajax from "@common/ajax";

// 获取指定cookie
function getCookie(NameOfCookie) {
    if (document.cookie.length > 0) {
        var begin = document.cookie.indexOf(NameOfCookie + "=");
        if (begin !== -1) {
            begin += NameOfCookie.length + 1;
            var end = document.cookie.indexOf(";", begin);
            if (end === -1) end = document.cookie.length;
            return unescape(document.cookie.substring(begin, end));
        }
    }
    return null;
}

/**
 * 时间戳转日期字符串
 * formatTime(1565625600000,yyyy-MM-dd) 2019-08-13
 */
function formatTime(timestamp, fmt) {
    const date = new Date(timestamp);
    const o = {
        'Y+': date.getFullYear(),
        'M+': date.getMonth() + 1, // 月份
        'D+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    for (const k in o) { if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))); }
    return fmt;
}
function ajaxRequest(url, formData, successFunc, succFuncMyParam) {
    ajax({
        method: "post",
        url: url,
        data: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
      .then(res => {
          successFunc(res, succFuncMyParam);
      })
      .catch(error => console.log(error, "error"));
}

// 从url获取指定参数
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

export { getCookie, formatTime, ajaxRequest, getQueryVariable };