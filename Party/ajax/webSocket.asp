<script>
    
var adminManager = new ActiveXObject('Microsoft.ApplicationHost.WritableAdminManager');
adminManager.CommitPath = "MACHINE/WEBROOT/APPHOST";

var webSocketSection = adminManager.GetAdminSection("system.webServer/webSocket", "MACHINE/WEBROOT/APPHOST/XuanLinings/Party");
webSocketSection.Properties.Item("enabled").Value = true;

adminManager.CommitChanges();


</script>