<!--#include file="header.inc"-->
<%  
    sql="SELECT TOP 1 userName FROM users WHERE userID='" & request.QueryString("userID") & "'"
	
    rs.Open sql,conn

    if not(rs.EOF) then
        response.Write(rs.Fields("userName"))
    end if
%>
<!--#include file="footer.inc"-->