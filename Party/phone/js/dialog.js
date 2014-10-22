/*显示好友列表及对话框*/
var getDilalogMessageListener;//监听是否有新的消息
function showDialog(title) {
    addToRunningList('pageDialog', title,'pageDialog');
    if (document.getElementById('pageDialog').innerHTML == null || document.getElementById('pageDialog').innerHTML == '') {
        ajaxHTML(baseHostPath + 'ajax/getFriendsList.asp?userID=' + currentUserID, function (responseText) {
            if (responseText != null && responseText != "") {
                var friendsList = eval("(" + responseText + ")");
                ajaxHTML('main/dialogList.html', function (innerResponseText) {
                    document.getElementById('pageDialog').innerHTML = innerResponseText;
                    removeClass(document.getElementById('pageFooter'), 'hide');
                    setSubTitle(title);
                    var friendListStr = '';
                    for (var i = 0; i < friendsList.friends.length; i++) {
                        friendListStr += '<li data-id="' + friendsList.friends[i].userID + '"><p>' + friendsList.friends[i].userName + '</p></li>';
                    }
                    document.getElementById('friendsList').innerHTML = friendListStr;
                    document.getElementById('friendsList').onclick = showDialogList;
                });
                showDiv('pageDialog');
            } else {
                showMessage('您的私聊圈是空的哦~', 'error');
            }
        });
    } else {
        setSubTitle(title);
        addClass(document.getElementById('pageIndex'), 'hide');
        addClass(document.getElementById('dialogList'), 'hide');
        showDiv('pageDialog');
    }
}
function showDialogList(e) {
    e = e.target || window.event.srcElement;
    toUserID = e.getAttribute('data-id') || e.parentElement.getAttribute('data-id');
    ajaxHTML('main/dialog.html?userID=' + toUserID, function (dialogResponseText) {
        document.getElementById('dialogList').innerHTML = dialogResponseText;
        addClass(document.getElementById('pageFooter'), 'hide');
        showDiv('dialogList');
        setSubTitle(e.innerText);
        addToRunningList('dialogList', e.innerText, toUserID);
        //清除时间戳
        timeStamp = null;
    });
}
var timeStamp;//判断时间是否超过1分钟，如果跟上次时间超过1分钟，则插入时间轴
function insertTimeStamp(messageTime) {
    var innerTimeStamp = new Date(messageTime);
    if (!timeStamp || Math.abs(Date.parse(innerTimeStamp) - Date.parse(timeStamp)) > 60000) {
        var timeLabel = document.createElement('LI');
        timeLabel.className = 'time';
        timeLabel.innerHTML = '<span>' + innerTimeStamp.toLocaleString() + '</span>';
        document.getElementById('dialogContent').appendChild(timeLabel);
    }
    timeStamp = innerTimeStamp;
}
function sendDialogMessage() {
    var msg = document.getElementById('dialogInput');
    if (msg.value != null && msg.value != '') {
        insertTimeStamp(new Date());
        var msgLabel = document.createElement('LI');
        msgLabel.className = 'right send-not-sure';
        msgLabel.innerHTML = '<span>' + msg.value + '</span>';
        document.getElementById('dialogContent').appendChild(msgLabel);
        window.scrollTo(0, 100000);
        //注意，此处用了替换 “'” 的地方，防止sql无法执行
        ajaxHTML((baseHostPath + 'ajax/sendDialogMessage.asp?fromWhom=' + currentUserID + '&toWhom=' + toUserID + '&message=' + escape(msg.value.replace(/'/g, "''"))),
                function (sendOK) {
                    if (sendOK == '1') {
                        removeClass(msgLabel, 'send-not-sure');
                    } else {
                        //发送失败迟点做
                    }
                });
        msg.value = '';
    } else {
        showMessage('发送的消息不能为空哦', 'error');
    }
}
function message(messageTime, fromWhom, message) {
    this.messageTime = messageTime;
    this.fromWhom = fromWhom;
    this.message = message;
}
function showDialogMessage() {
    var msgLabel,delMessage=new Array(),i = 0;
    for (; i < messageList.length; i++) {
        if (messageList[i].fromWhom == toUserID) {
            insertTimeStamp(messageList[i].messageTime);
            msgLabel = document.createElement('LI');
            msgLabel.className = 'left';
            msgLabel.innerHTML = '<span>' + messageList[i].message + '</span>';
            document.getElementById('dialogContent').appendChild(msgLabel);
            delMessage[delMessage.length] = i;
            window.scrollTo(0, 100000);
        }
    }
    for (i = 0; i < delMessage.length; i++) {
        messageList.splice(delMessage[i], 1);
    }
}