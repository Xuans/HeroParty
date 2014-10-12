<!--#include file="header.inc"-->
<%
    sql="INSERT INTO message(fromWhom,toWhom,message) VALUES('"
    sql=sql & Request.QueryString("fromWhom") & "','" & Request.QueryString("toWhom") & "','"
    sql=sql & Request.QueryString("message") & "');"
    
    on error resume next
    
    conn.Execute sql

    if err<>0 then
        response.Write(sql)
        response.Write(err.Description)
    else
        response.Write(1)
    end if
%>
<!--#include file="footer.inc"-->