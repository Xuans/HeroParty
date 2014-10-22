/*加载完毕后使用的*/
var messageList = new Array();//信息列表
document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        currentUserID = getQueryString('userID');
        if (currentUserID == null || currentUserID == '') {
            //转跳到登录或注册界面
            goLogin();
        }else{
            //登录后的操作
            showUserName();
        }
    }
}

//显示登陆后的内容程序
function showUserName() {
    document.getElementById('mainTitle').innerHTML = currentUserID;
    getUserName(currentUserID, function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('mainTitle').innerHTML = responseText;

            //页面基本内容内容
            showPageContent();

            //绑定Menu部分
            bindMenu();
            //Menu选项点击绑定
            onMenuClick();

            //监听消息
            //添加监听
            var getDilalogMessageListener = window.setInterval(listenMessage, 5000);

            document.getElementById('pageDialogIcon').onclick = function () {
                addClass(document.getElementById('pageMessageDialog'), 'hide');
            };
        }
    });
}

//页面基本内容内容
function showPageContent(parms) {
    if (parms) {
        showDiv(parms[1]);
        setSubTitle('');
    } else {
        ajaxHTML('main/pageHeader.html', function (responseText) {
            if (responseText != null && responseText != '') {
                document.getElementById('pageContent').innerHTML = responseText;
                currentDiv = 'pageIndex';
            }
        });
    }
}

//显示或隐藏目录
function toggleMenu(type) {
    if (type) {
        switch (type) {
            case 'active':
                addClass(document.getElementById('menuDiv'), 'active');
                break;
            default:
                removeClass(document.getElementById('menuDiv'), 'active');
                break;
        }
    } else {
        toggleClass(document.getElementById('menuDiv'), 'active');
    }
}

//绑定Menu滑动，点击事件
function bindMenu() {
    var flag = false, mouseOff = new Object();
    mouseOff.x = 0;
    mouseOff.y = 0;
    window.onmousedown = function (e) {
        flag = true;
        mouseOff.x = e.screenX || window.event.screenX;
        mouseOff.y = e.screenY || window.event.screenY;
    }
    window.onmouseup = function (e) {
        if (flag) {
            flag = false;
            mouseOff.x -= e.screenX || window.event.screenX;
            mouseOff.y -= e.screenY || window.event.screenY;
            if (Math.abs(mouseOff.y) < 50) {
                if (mouseOff.x > 50) {
                    toggleMenu('active');
                } else if (mouseOff.x < -50) {
                    toggleMenu('hide');
                }
            }
        }
    }
    document.getElementById('menuInnerDiv').onclick = function () { toggleMenu(); };
    removeClass(document.getElementById('menuDiv'), 'hide');
}
function onMenuClick() {
    document.getElementById('runningList').onclick = function (e) {
        e = e.target || window.event.srcElement;
        var target = e.getAttribute('data-target');
        if (target != null && target != "") {
            switch (target) {
                case 'dialogList':
                    showDialogList(e);
                    break;
                default:
                    showDiv(target);
                    break;
            }
            this.removeChild(e);
            this.insertBefore(e, this.firstElementChild || this.firstChild);
            setSubTitle(e.getAttribute('data-title'));
            removeClass(document.getElementById('menuDiv'), 'active');
        }
    }
}
//添加进入RunningList
function addToRunningList(dataTarget, dataContent, dataID) {
    var runningList = document.getElementById('runningList');
    var li
    var flag = false;
    for (var i = 0, e; e = runningList.children[i++];) {
        if (dataID == e.getAttribute('data-id')) {
            flag = true;
            li = e;
            runningList.removeChild(e);
            break;
        }
    }
    if (!flag) {
        li = document.createElement('LI');
        li.setAttribute('data-target', dataTarget);
        li.setAttribute('data-id', dataID);
        li.setAttribute('data-title', dataContent);
        li.innerText = dataContent;
    }
    runningList.insertBefore(li, runningList.firstElementChild || runningList.firstChild);
}


//监听消息
function listenMessage() {
    ajaxHTML(baseHostPath + 'ajax/getDialogMessage.asp?toWhom=' + currentUserID, function (responseText) {
        if (responseText != null && responseText != "") {
            var receiveMessage = eval("(" + responseText + ")");
            if (receiveMessage.message.length > 0) {
                for (var i = 0; i < receiveMessage.message.length; i++) {
                    messageList[messageList.length] = receiveMessage.message[i];
                }
            }
            setFunctionDisplayNum('functionDialog', messageList.length);

            if (!hasClass(document.getElementById('dialogList'), 'hide')) {
                showDialogMessage();
            }
        }
    });
}
//在功能列表中显示消息数
function setFunctionDisplayNum(target, num) {
    if (num>0) {
        if (num > 99) {
            document.getElementById(target).getElementsByTagName('SPAN')[0].innerText = '99+';
        } else {
            document.getElementById(target).getElementsByTagName('SPAN')[0].innerText = num;
        }
    } else {
        document.getElementById(target).getElementsByTagName('SPAN')[0].innerText = '';
    }
}

