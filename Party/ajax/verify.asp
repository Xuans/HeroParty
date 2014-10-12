<!--#include file="header.inc"-->
<%
    set rs=Server.CreateObject("ADODB.recordset")
        sql="select userPwd from users where userID='" & request.QueryString("userID") & "'"

		rs.Open sql,conn

    dim isTrue

    if rs.EOF then
        isTrue=0
    elseif rs.Fields("userPwd")=request.QueryString("userPwd") then
        isTrue=1
    else
        isTrue=0
    end if

    response.Write(isTrue)
%>
<!--#include file="footer.inc"-->