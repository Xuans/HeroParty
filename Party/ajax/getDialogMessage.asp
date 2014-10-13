<!--#include file="header.inc"-->
<%
    sql="SELECT * FROM message WHERE toWhom='" & Request.QueryString("toWhom") &"';"
    sql2="DELETE FROM message WHERE id="

    rs.Open sql,conn

    if rs.EOF then
        Response.Write("{'message':[]}")
    else
        dim message,deleteSql
            message="{'message':["
        do until rs.EOF
            message=message & "{'messageTime':'" & rs.Fields("messageTime") & "','fromWhom':'" & rs.Fields("fromWhom") & "','message':'" & rs.Fields("message") & "'},"
                deleteSql=sql2 & rs.Fields("id")
                conn.Execute deleteSql
            rs.MoveNext
        loop
        Response.Write(message & "]}")
    end if
%>
<!--#include file="footer.inc"-->