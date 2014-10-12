<!--#include file="header.inc"-->
<%
    sql="SELECT TOP 1 friends FROM users WHERE userID='" & request.QueryString("userID") & "';"
    
    rs.Open sql,conn
    
    if not(rs.EOF) AND rs.Fields("friends")<>"" then
        dim friendsArray,i,friends
            friendsArray=Split(rs.Fields("friends"),",")
            friends="{'friends':["
        
    
        for i =0 to UBound(friendsArray)
            sql="SELECT TOP 1 userName FROM users WHERE userID='" & friendsArray(i) & "';"
            rs.Close
            rs.Open sql,conn
            if not(rs.EOF) then
                friends=friends & "{'userID':'" & friendsArray(i) & "','userName':'" & rs.Fields("userName") & "'},"
            end if
        next

            friends=friends & "]}"
            response.Write(friends)
    end if
%>
<!--#include file="footer.inc"-->
