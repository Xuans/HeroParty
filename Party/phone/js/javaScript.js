var baseHostPath = 'http://192.168.253.4/party/';
var currentUserID,toUserID;

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



/*加载完毕后使用的*/
document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        showUserName();
        document.getElementById('pageDialogIcon').onclick = function () {
            addClass(document.getElementById('pageMessageDialog'), 'hide');
        };
    }
}

/*显示提示信息部分*/
function showMessage(msg, type) {
    if (msg) {
        removeClass(document.getElementById('pageMessageDialog'), 'hide');
        document.getElementById('pageDialogMessage').innerHTML = msg;
    }
}


/*登录注册部分*/
function goLogin() {
    ajaxHTML('login/login.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
            document.getElementById('pageContent').onkeyup = function (e) { submitForm(e.which,toLogin) };
        }
    });
    return false;
}
function goRegister() {
    ajaxHTML('login/register.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
            document.getElementById('pageContent').onkeyup = function (e) { submitForm(e.which, toRegister) };
        }
    });
    return false;
}
function submitForm(keyCode, callback) {
    if (keyCode == 13) {
        callback();
    }
}
function toRegister() {
    var userID = document.getElementById('userID'),
        userName = document.getElementById('userName'),
        userPwd = document.getElementById('userPwd'),
        userPwdConfirm = document.getElementById('userPwdConfirm'),
        userIDReg = /^[\d]{12}$/,
        userNameReg = /^[\u4e00-\u9fa5]{2,5}/;

    /*用户ID*/
    if (userIDReg.test(userID.value)) {
        document.getElementById('userIDError').innerHTML = '';
    } else {
        document.getElementById('userIDError').innerHTML = '用户ID输入有误';
        userID.focus();
        return;
    }
    /*用户名*/
    if (userNameReg.test(userName.value)) {
        document.getElementById('userNameError').innerHTML = '';
    } else {
        document.getElementById('userNameError').innerHTML = '请输入2-5个汉字作为用户名';
        userName.focus();
        return;
    }
    /*用户密码*/
    if (userPwd.value.length == 6) {
        document.getElementById('userPwdError').innerHTML = '';
    } else {
        document.getElementById('userPwdError').innerHTML = '请输入6位密码';
        userPwd.focus();
        return;
    }
    /*确认密码*/
    if (userPwd.value == userPwdConfirm.value) {
        document.getElementById('userPwdConfirmError').innerHTML = '';
    } else {
        document.getElementById('userPwdConfirmError').innerHTML = '输入密码不一致';
        userPwdConfirm.focus();
        return;
    }

    ajaxHTML(baseHostPath + 'ajax/createUser.asp?userID='
            + userID.value
            + '&userName='
            + escape(userName.value)
            + '&userPwd='
            + escape(userPwd.value), loginSuccess);
}
function toLogin() {
    var userID = document.getElementById('userID'),
        userPwd = document.getElementById('userPwd'),
        userIDReg = /^[\d]{12}$/;

    /*用户ID*/
    if (userIDReg.test(userID.value)) {
        document.getElementById('userIDError').innerHTML = '';
    } else {
        document.getElementById('userIDError').innerHTML = '用户ID输入有误';
        userID.focus();
        return;
    }
    /*用户密码*/
    if (userPwd.value.length == 6) {
        document.getElementById('userPwdError').innerHTML = '';
    } else {
        document.getElementById('userPwdError').innerHTML = '请输入6位密码';
        userPwd.focus();
        return;
    }

    ajaxHTML(baseHostPath + 'ajax/verify.asp?userID='
            + userID.value
            + '&userPwd='
            + escape(userPwd.value), loginSuccess);
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
//设置副标题的标题，点击事件，点击事件的参数
function setSubTitle(subTitle, callback, parms) {
    var obj = document.getElementById('subTitle');
    obj.innerHTML = subTitle == '' ? '' : '&lt;&nbsp;' + subTitle;
    obj.onclick = function () { callback(parms); };
}
/*显示内容*/
function showPageContent() {
    ajaxHTML('main/pageHeader.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
            setSubTitle('', null);
        }
    });
}
/*显示好友列表及对话框*/
function showDialog(title) {
    ajaxHTML(baseHostPath + 'ajax/getFriendsList.asp?userID=' + currentUserID, function (responseText) {
        if (responseText != null && responseText != "") {
            var friendsList = eval("(" + responseText + ")");
            ajaxHTML('main/dialogList.html', function (innerResponseText) {
                document.getElementById('pageContent').innerHTML = innerResponseText;
                removeClass(document.getElementById('pageFooter'), 'hide');
                setSubTitle(title, showPageContent);
                var friendListStr = '';
                for (var i = 0; i < friendsList.friends.length; i++) {
                    friendListStr += '<li data-user-id="' + friendsList.friends[i].userID + '"><p>' + friendsList.friends[i].userName + '</p></li>';
                }
                document.getElementById('friendsList').innerHTML = friendListStr;
                document.getElementById('friendsList').addEventListener('click', function (e) {
                    e = e.srcElement || window.event.srcElement;
                    toUserID = e.getAttribute('data-user-id') || e.parentElement.getAttribute('data-user-id');
                    ajaxHTML('main/dialog.html?userID=' + toUserID, function (dialogResponseText) {
                        document.getElementById('pageContent').innerHTML = dialogResponseText;
                        addClass(document.getElementById('pageFooter'), 'hide');
                        getUserName(toUserID, function (toUserName) {
                            setSubTitle(toUserName, showDialog, [title]);
                        });
                    });
                }, false);
            });
        } else {
            showMessage('您的私聊圈是空的哦~','error');
        }
    });
}
var timeStamp;//判断时间是否超过1分钟，如果跟上次时间超过1分钟，则插入时间轴
function sendDialogMessage() {
    var msg = document.getElementById('dialogInput');
    if (msg.value != null && msg.value != '') {
        var innerTimeStamp = new Date();
        if (!timeStamp || innerTimeStamp.getMinutes() - 1 > timeStamp) {
            var timeLabel = document.createElement('LI');
            timeLabel.className = 'time';
            timeLabel.innerHTML = '<span>' + innerTimeStamp.toLocaleString() + '</span>';
            document.getElementById('dialogContent').appendChild(timeLabel);
        }
        timeStamp = innerTimeStamp.getMinutes();
        var msgLabel = document.createElement('LI');
        msgLabel.className = 'right send-not-sure';
        msgLabel.innerHTML = '<span>' + msg.value + '</span>';
        document.getElementById('dialogContent').appendChild(msgLabel);
        window.scrollTo(0, 100000);
        ajaxHTML((baseHostPath + 'ajax/sendDialogMessage.asp?fromWhom='+currentUserID+'&toWhom='+toUserID+'&message='+escape(msg.value)),
                function (sendOK) {
                    if (sendOK == '1') {
                        removeClass(msgLabel, 'send-not-sure');
                    } else {
                        //发送失败迟点做


                        fdsfdsfsdfdfds
                    }
                });
        msg.value = '';
    } else {
        showMessage('发送的消息不能为空哦', 'error');
    }
}

function getDialogMessage() {
    ajaxHTML(
        baseHostPath + 'ajax/getDialogMessage.asp?toWhom=' + currentUserID, function (responseText) {
            if (responseText != null && responseText != "") {
                var messageList = eval("(" + responseText + ")"), msgLabel;
                for (var i = 0; i < messageList.message.length; i++) {
                    if (messageList.message[i].fromWhom == toUserID) {
                        msgLabel = document.createElement('LI');
                        msgLabel.className = 'left';
                        msgLabel.innerHTML = '<span>' + msg.value + '</span>';
                        document.getElementById('dialogContent').appendChild(msgLabel);
                    }
                }
            }
        });
}
