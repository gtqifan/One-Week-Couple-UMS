# One-Week-Couple-UMS
This is the data manage system for one week couple website of GTCSSA. Use MSSQL as data storage and Node.JS as backend logic for data retriving, alternation, and deleting.

## Note for Mingxiao:
在运行这个项目之前需要在电脑上安装Node.JS环境以及Microsoft SQL（包括Microsoft SQL Server Express和SQL Server Management Studio）。首先需要配置SQL，需要创建一个名为Users的Database，创建一个用户名和密码都为｢foo｣的账号并且赋予它访问和更改Users的权限。在Users里面创建两个名为Account和Profile的table，并且往里面放入一些数据以便测试（我还没搞清楚怎么做但是等我搞清楚了可以分享给你）。接下来还要在电脑上打开1433端口确保node可以连接到本地的数据库上（https://knowledgebase.apexsql.com/configure-remote-access-connect-remote-sql-server-instance-apexsql-tools/）。
做完这些之后打开IDE（我用的是Webstrom但是VS Code也可），运行｢node server.js｣，网站会运行在port 5000上，可以在浏览器直接访问｢localhost:5000｣，如果没有什么问题可以看到数据库返回的JSON格式的信息。
有任何问题都可以随时联系我呀~
