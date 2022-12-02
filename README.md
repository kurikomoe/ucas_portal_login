### Usage

1. 修改 login.js 中的 username & password
2. 执行 node index.js 或 npm start

### Example

ac86u 使用 entware 安装 node 之后
```
crontab -e  // 编辑 crontab

// 添加如下命令：每 5 秒执行一次联网检查，若发现断网则执行登录脚本。
// 警告：如果欠费或有其他问题，则会出现每分钟 10 次登录尝试。。。 
* * * * * cd /mnt/data/portal && for i in 1 1 1 1 1 1 1 1 1 1; do curl 223.5.5.5 --max-time 1 || (node login.js > /tmp/login.log && date >> /tmp/login.log); sleep 5; done
```


