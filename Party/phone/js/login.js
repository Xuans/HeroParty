/*登录注册部分*/
function goLogin() {
    ajaxHTML('login/login.html', function (responseText) {
        if (responseText != null && responseText != '') {
            document.getElementById('pageContent').innerHTML = responseText;
            document.getElementById('pageContent').onkeyup = function (e) { submitForm(e.which, toLogin) };
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
        document.location.replace('?userID=' + currentUserID);
    } else {
        document.getElementById("userIDError").innerHTML = "账号输入有误";
    }
}