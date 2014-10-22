/*自定义函数*/
//Class样式操作
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += ' ' + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}

//AJAX接口
function ajaxHTML(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open('GET', url + (url.indexOf('?') == -1 ? '?' : '&') + 't=' + Math.random(), true);
    xmlhttp.send();
}


//获取Url参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/*显示提示信息部分*/
function showMessage(msg, type) {
    if (msg) {
        removeClass(document.getElementById('pageMessageDialog'), 'hide');
        document.getElementById('pageDialogMessage').innerHTML = msg;
    }
}


/*显示隐藏DIV部分*/
function showDiv(div) {
    addClass(document.getElementById(currentDiv), 'hide');
    removeClass(document.getElementById(div), 'hide');
    currentDiv = div;
}

/*显示用户名*/
function getUserName(userID, callback) {
    ajaxHTML(baseHostPath + 'ajax/getUserName.asp?userID=' + userID, callback);
}

//设置副标题的标题，点击事件，点击事件的参数
function setSubTitle(subTitle) {
    document.getElementById('subTitle').innerHTML = subTitle==null ? '' : '&nbsp;' + subTitle;
}

