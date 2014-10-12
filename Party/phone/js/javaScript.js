var baseHostPath = 'http://192.168.253.4/party/';
var currentUserID;

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


/*登录注册部分*/
function goLogin() {
    ajaxHTML('login/login.html', function (responseText) {
        if(responseText!=null&&responseText!=''){
        document.getElementById('pageContent').innerHTML = responseText;
        }
    });
    return false;
}
function goRegister() {
    ajaxHTML('login/register.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
        }
    });
    return false;
}
function toRegister() {
    var userID = document.getElementById('userID').value,
        userName=document.getElementById('userName').value,
        userPwd = document.getElementById('userPwd').value,
        userPwdConfirm = document.getElementById('userPwdConfirm').value,
        userIDReg = /^[\d]{12}$/,
        userNameReg=/^[\u4e00-\u9fa5]{2,5}/,
        flag = true;

    /*用户ID*/
    if (userIDReg.test(userID)) {
        document.getElementById('userIDError').innerHTML = '';
    } else {
        document.getElementById('userIDError').innerHTML = '用户ID输入有误';
        flag = false;
    }
    /*用户名*/
    if (userNameReg.test(userName)) {
        document.getElementById('userNameError').innerHTML = '';
    } else {
        document.getElementById('userNameError').innerHTML = '请输入2-5个汉字作为用户名';
        flag = false;
    }
    /*用户密码*/
    if (userPwd.length == 6) {
        document.getElementById('userPwdError').innerHTML = '';
    } else {
        document.getElementById('userPwdError').innerHTML = '请输入6位密码';
        flag = false;
    }
    /*确认密码*/
    if (userPwd == userPwdConfirm) {
        document.getElementById('userPwdConfirmError').innerHTML = '';
    } else {
        document.getElementById('userPwdConfirmError').innerHTML = '输入密码不一致';
        flag = false;
    }

    if (flag) {
        var url = baseHostPath + 'ajax/createUser.asp?userID='
                + userID
                + '&userName='
                + escape(userName)
                + '&userPwd='
                + escape(userPwd);
        ajaxHTML(url, loginSuccess);
    }
}
function toLogin() {
    var userID = document.getElementById('userID').value,
        userPwd = document.getElementById('userPwd').value,
        userIDReg = /^[\d]{12}$/,
        flag = true;

    /*用户ID*/
    if (userIDReg.test(userID)) {
        document.getElementById('userIDError').innerHTML = '';
    } else {
        document.getElementById('userIDError').innerHTML = '用户ID输入有误';
        flag = false;
    }
    /*用户密码*/
    if (userPwd.length == 6) {
        document.getElementById('userPwdError').innerHTML = '';
    } else {
        document.getElementById('userPwdError').innerHTML = '请输入6位密码';
        flag = false;
    }

    if (flag) {
        var url = baseHostPath + 'ajax/verify.asp?userID='
                + userID
                + '&userPwd='
                + escape(userPwd);
        ajaxHTML(url, loginSuccess);
    }
}
function loginSuccess(responserText) {
    if (responserText == '1') {
        currentUserID = document.getElementById('userID').value;
        getUserName(currentUserID, function (responseText) {
            if (responseText != null && responseText != '') {
                document.getElementById('mainTitle').innerHTML = responseText;
                document.getElementById('pageContent').innerHTML = '';
                showPageContent();
            }
        });
    } else {
        document.getElementById("userIDError").innerHTML = "账号输入有误";
    }
}

/*显示用户名*/
function getUserName(userID,callback){
    ajaxHTML(baseHostPath + 'ajax/getUserName.asp?userID=' + userID,callback);
}
function showUserName() {
    currentUserID = getQueryString('userID');
    if (currentUserID == null || currentUserID == '') {
        goLogin();
    } else {
        document.getElementById('mainTitle').innerHTML = currentUserID;
        getUserName(currentUserID, function (responseText) {
            if (responseText != null && responseText != '') {
                document.getElementById('mainTitle').innerHTML = responseText;
                showPageContent();
            }
        });
    }
}
/*显示内容*/
function showPageContent() {
    ajaxHTML('main/pageHeader.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
        }
    });
}
/*显示好友列表*/
function showDialog() {
    ajaxHTML(baseHostPath + 'ajax/getFriendsList.asp?userID=' + currentUserID, function (responseText) {
        if (responseText != null && responseText != "") {
            var friendsList = eval("(" + responseText + ")");
            ajaxHTML('main/dialogList.html', function (innerResponseText) {
                document.getElementById('pageContent').innerHTML = innerResponseText;
                setSubTitle(subTitle,showPageContent);
                var friendListStr='';
                for (var i = 0; i < friendsList.friends.length; i++) {
                    friendListStr += '<li data-user-id="' + friendsList.friends[i].userID+ '"><p>' + friendsList.friends[i].userName + '</p></li>';
                }
                document.getElementById('friendsList').innerHTML = friendListStr;
                document.getElementById('friendsList').addEventListener('click', function (e) {
                    e = e.srcElement || window.event.srcElement;
                    var toUserID=e.getAttribute('data-user-id')||e.parentElement.getAttribute('data-user-id');
                    ajaxHTML('main/dialog.html?userID=' + toUserID, function (dialogResponseText) {
                        document.getElementById('pageContent').innerHTML = dialogResponseText;
                        getUserName(toUserID, function (toUserName) {
                            document.getElementById('subTitle').innerHTML = toUserName;
                        });
                    });
                }, false);
            });
        }
    });
}
function setSubTitle(subTitle, callback) {
    var obj = document.getElementById('subTitle');
    obj.innerHTML = '私聊圈';
    obj.addEventListener('click',callback, false);
}