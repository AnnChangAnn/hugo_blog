---
title: "安裝 Docker on Windows，並在 Docker 上執行 Redis"
date: 2025-05-04T17:00:00+08:00
draft: false
keywords: ["Docker", "Windows", "Redis", "WSL", "安裝", "教學"]
description: "本篇教學將引導您如何在 Windows 作業系統上，從零開始下載並安裝 Docker Desktop，並解決常見的 WSL 更新問題。接著，我們將示範如何透過 Docker 指令拉取最新的 Redis 映像檔，並成功在本機端啟動一個 Redis 容器，最後包含進入容器內操作 Redis CLI 的基本指令。"
images: ["/images/favicon.svg"]
---


### Setp 1:
Google 搜尋 "docker download"，可以直接找到 docker 下載的官方網站  
https://www.docker.com/products/docker-desktop/

<br/>

### Step 2:
執行安裝檔並安裝，選擇一般安裝即可，安裝完後開啟 docker，可能會需要重新開機

P.S. 若開啟過程中跳出 WSL 錯誤，可能會需要安裝或更新 WSL，錯誤提示訊息中會告訴你須執行的指令，開啟 command line 並執行該指令，譬如:
```bash
wsl --update
```
待 WSL 安裝或更新完後再重新開啟 docker 即可

<br/>

### Step 3:
順利安裝完成後，docker desktop 應該可以正確顯示畫面  
此時可再開啟 command line 來準備安裝 Redis  
可先執行以下命令來查看可用版本  
```bash
docker search redis
```

<br/>

### Step 4:
這邊我們直接拉取官方最新版本的 image
```bash
docker pull redis:latest
```
執行完成後可使用以下命令查看已安裝的 images
```bash
docker images
```

<br/>

### Step 5:
安裝完成後，可執行命令來啟動 Redis
```bash
docker run -itd --name redis-test -p 6379:6379 redis
```
```-itd``` : 表示讓容器在背景模式執行，可使用終端機  
```--name redis-test``` : 幫 container 命名為 redis-test  
```-p 6379:6379``` : 設定 Redis 的預設 port 號: 6379  

此時的 Redis 以正在運行

<br/>

### Step 6:
執行命令以進入 container 並且在內部執行指令
```bash
docker exec -it redis-test /bin/bash
```
```docekr exec``` : 進入 container 來執行指令  
```-it``` : 在前景模式執行  
```/bin/bash``` : 在 container 中開啟 command line  

輸入 ```redis-cli``` 來執行 Redis 相關的指令  
輸入 ```set test 01``` 來設定 key=test, value=1 ，會看到回傳 ```OK```  
輸入 ```get test``` 來獲取 key=test 的 value，會看到回傳 ```"01"```  


<br/>

### Step 7:
離開 container 內的終端機，輸入 ```exit``` 或按下快捷鍵 ```ctrl+d``` 

最後，我們要關閉 Redis，也就是關閉在 docker 上這個正在執行 Redis 的 container，因為前面命名這個 container 為 **redis-test**，因此執行
```bash
docker stop redis-test
```

<br/>
<br/>

### 參考來源:
1. https://www.runoob.com/docker/windows-docker-install.html
2. https://www.runoob.com/docker/docker-install-redis.html
3. ChatGPT
