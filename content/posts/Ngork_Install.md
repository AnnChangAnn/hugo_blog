---
title: "ngrok : 在 Debug mode 時架站"
date: 2025-07-25T12:00:00+08:00
draft: false
author: "Wayne" 
keywords: ["ngork", "localhost", "localhost server", "本地開發", "本機開發", "本地架站", "本機架站"]
description: "當我們在本機進行開發時，有時候會想要用一些實體的外部裝置進行測試，來看看實際的結果如何，譬如用手機測試網站畫面等等。這時就可透過 ngrok 來將我們的服務直接放到線上，使外部裝置可以連進本機上的這個 localhost 服務"
images: ["/images/favicon.svg"]
---

當我們在本機進行開發時，有時候會想要用一些實體的外部裝置進行測試，來看看實際的結果如何，譬如用手機測試網站畫面等等。這時就可透過 ngrok 來將我們的服務直接放到線上，使外部裝置可以連進本機上的這個 localhost 服務  

<br/>

### Setp 1: 註冊並下載 [ngrok](https://ngrok.com/)  
點選 Sign up 註冊  

![image](/images/posts/ngork/ngork1.png)  

註冊完成後，依照 ngrok 網站上的步驟操作，執行下載的 ngrok.exe  

![image](/images/posts/ngork/ngork2.png)  

<br/>

### Setp 2: ngork 設定
依照 ngrok 網站上的步驟操作，在 ngrok.exe 開啟的 Command Line 畫面上執行 add-authtoken 指令:  

``` ngrok config add-authtoken XXXXXXXXXXX ```  

![image](/images/posts/ngork/ngork3.png)  

![image](/images/posts/ngork/ngork4.png)  

    
<br/>

### Setp 3: 執行 ngork，讓外部裝置來使用本地服務
執行 ngork，若你使用的是 http，則執行: ```ngrok http http://localhost:8080```  

![image](/images/posts/ngork/ngork5.png)  

執行後會顯示如下:  

![image](/images/posts/ngork/ngork6.png)  

Forwarding 後面的 url 就是讓外部裝置可以直接開啟本機服務的 url  
按 ```Ctrl+C``` 即可結束 ngork 服務

<br/>

若是 https，則執行:  

```ngrok http https://localhost:443 --host-header=localhost:443```  

![image](/images/posts/ngork/ngork7.png)  

<br/>

P.S. 若有自行設定的 port，則也需做調整  



<br/>
<br/>

### 參考來源:
1. [ngrok](https://ngrok.com/)