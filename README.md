## glory-cli

前端脚手架



### FAQ

1. 提示API速率限制，详细报错信息如下：
```
API rate limit exceeded for x.x.x.x. (But here's the good news: Authenticated 
requests get a higher rate limit. Check out the documentation for more details.)
```


解决方法如下：
1. 去 https://github.com/settings/tokens/new 这个地址申请token
2. 将token写入环境变量
  
```
export GLORY_CLI_GITHUB_API_TOKEN=XXXXXXXXXX
```


