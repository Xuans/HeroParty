<!--#include file="header.inc"-->
<%if request.QueryString("userID")<>"" then

    sql="INSERT INTO users(userID,userName,userPwd) VALUES ('"
    sql=sql & request.QueryString("userID") &"','"
    sql=sql & request.QueryString("userName") &"','"
    sql=sql & request.QueryString("userPwd") &"')"

    on error resume next
    conn.Execute sql
    
    if err<>0 then
   	    response.Write("0")
    else
        response.Write("1")
    end if
end if%>
<!--#include file="footer.inc"-->