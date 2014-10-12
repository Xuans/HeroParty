<%	set	conn=Server.CreateObject("ADODB.Connection")
		conn.Provider="Microsoft.Jet.OLEDB.4.0"
		conn.Open(Server.Mappath("..\data\data.mdb"))
	set rs=Server.CreateObject("ADODB.recordset")%>