---
title: "在小黑框上玩 AI : 手把手帶你安裝 Google Gemini CLI !"
date: 2025-07-01T16:40:00+08:00
draft: false
keywords: ["Gemini CLI", "Google Gemini", "安裝 Gemini CLI", "終端機 AI 工具", "Gemini Code Assist", "AI 自動化", "AI 終端機整合", "Gemini CLI 教學", "Google AI CLI"]
description: "本文介紹如何安裝與使用 Google Gemini CLI，教你如何在終端機與 Gemini AI 對話，甚至自動生成與存取本地檔案，適合工程師與想體驗 AI 工具的使用者。"
images: ["/images/favicon.svg"]
---

# 在小黑框上玩 AI : 手把手帶你安裝 Google Gemini CLI !

聽說最近 Gemini CLI 很夯，小弟我這兩天也試了一下覺得蠻好用的  
輸入一些 prompt 就可以讓他直接在我的電腦上完成我要的檔案了，真的很方便~

<br/>

### Gemini CLI 是什麼?
Gemini 是由 Google 開發的生成式人工智慧聊天機器人，而 Gemini CLI 則是將 Gemini 整合進命令列介面 (Command Line Interface, CLI)，讓使用者可以在終端機 (俗稱小黑框) 上使用 Gemini，對於愛用終端機的工程師來說，可說是一大福音! 對於一般用戶而言其實也是很好用的。

<br/>

### Gemini CLI 能做什麼?
其實就跟一般常用的 ChatGPT 或 Gemini 一樣，你可以透過對話聊天來向 AI 詢問或找資料，而且幾乎不會受到用量上的限制。而且厲害的是，因為他是安裝在你的個人電腦上，你甚至可以要求他直接將你要的資料放到你給的指定路徑內~ 非常方便!  
> 目前使用個人 Google 帳戶登入，即可免費獲得 Gemini Code Assist 授權，額度高達**每分鐘 60 次**，**每日最多 1,000 次**的請求次數。    

<br/>

主要功能包含：  
* **問答聊天:** 如一般常用的 AI，透過問答的方式幫你解決問題
* **內建 Google Search:** 可幫你上網找資料
* **程式優化、除錯:** 可查看你的專案架構和程式碼，直接幫你除錯與做調整
* **內建 MCP:** 對於較熟悉的工程師而言，可支援建立外部套件的連接

<br/>
<br/>


### 安裝 Gemini CLI

### Setp 1:
需先安裝 [Node.js](https://nodejs.org/en/download/current)，版本需為 18 以上，可以直接選最新版本安裝  
我是 Windows 系統，因此直接點擊 Windows 安裝下載點，下載後照著步驟安裝即可  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial1.png)


<br/>

### Step 2:
安裝完 Node.js 後，可在 windows 搜尋列輸入 ```cmd``` 並按下 Enter，即可開啟終端機  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial2.png)
![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial3.png)

接著執行 ```npm install -g @google/gemini-cli``` 指令進行 Gemini CLI 的安裝  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial4.png)

按下 Enter，等他跑一下就安裝完成了  


<br/>

### Step 3:
此時已經安裝完 Gemini CLI 了，接著就是把它開啟來囉~  
輸入指令 ```gemini``` 來開啟 Gemini CLI  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial5.png)

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial6.png)

一開始會要你選擇主題，用上下鍵選擇並按 Enter 確認  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial7.png)

接著是選擇授權方式  
若你有 Gemini API Key 的話可以選第二種  
不然最簡單的方式就是選第一種，直接用 Google 帳號授權  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial8.png)

接著會開啟瀏覽器跳出授權畫面，選你要用的帳號登入即可  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial9.png)

接著就可以使用了! 右下角可以看到預設的模型是 ```gemini-2.5-pro```  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial10.png)

隨便先來問他個問題吧~  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial11.png)

看來可以正常運作了，接著我們來讓他整理一些資料，並放到我們要的指定位置吧~  



<br/>
<br/>

### 用 Gemini CLI 來操作檔案資料

Gemini CLI 比線上 AI 更好用的地方就在於他已經整合進了我們的終端機，可以直接操作我們電腦內的檔案，這裡來嘗試個簡單的操作吧~  

範例: 我想請他抓最新的匯率資料，整理成 CSV 檔並放到指定路徑  
輸入要求並按下 Enter  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial12.png)

接著，他問我們同不同意擷取網頁內容，當然是要同意阿不然資料怎麼抓!  
選 Yes，按 Enter  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial13.png)

接著問我們要不要下載，一樣選同意  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial14.png)

等了很久終於下載好了，他要建立指定路徑的資料夾，但其實我已經建好了，他執行指令建立資料夾應該會失敗，但反正他會處理好的吧🤣  
按同意

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial15.png)

因為我們一開始開啟 Gemini 的地方是在 ```C:\User\Wayne```，但我們要求他將檔案存放在 D 槽，導致他沒有權限執行這個操作...  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial16.png)

這裡選擇 No 來取消這次的請求，因為我不想讓他把檔案存放在目前的路徑下  
我試過在 Gemini 中操作指令 ```cd /d D:\XXX``` 來移動到 D 槽，但似乎都沒有真的移動過去，看來需要退出 Gemini 後再進行移動  

**Gemini CLI ... 我對你很失望 QQ**

我決定按兩次 Ctrl + C 來退出 Gemini  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial17.png)


<br/>
<br/>

### 用 Gemini CLI 來操作檔案資料，Again...

沒錯，這次我們改成在 D 槽開啟 Gemini，然後再試一次吧!  
輸入 ```cd /d D:\``` 來進到 D 槽  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial18.png)

然後再開啟一次 Gemini  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial19.png)

並且一樣輸入剛剛的要求  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial20.png)

接著就跟前面一樣，不斷的回覆 Yes，最後終於成功把匯率檔案存下來了~  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial21.png)

開啟來看看，確實資料都有寫入成功，大致上也有符合我要的要求  

![image](/images/posts/GeminiCliTutorial/Gemini_Cli_Tutorial22.png)


<br/>

### 總結
這次嘗試使用 Google Gemini CLI 的體驗讓我覺得很有趣也很實用！從安裝到啟用過程都算順利，可以直接在終端機操作 AI 且授權操作本機內的檔案真的很方便。雖然中間因為權限問題遇到一點小挫折，但只要切到正確的路徑下執行就沒問題了。整體來說，Gemini CLI 對於開發者或習慣使用終端機的使用者來說，是個強大又方便的新工具！推薦大家也來試試看，想了解更多功能也能去他們的 [github](https://github.com/google-gemini/gemini-cli) 看看😊


<br/>
<br/>

### 參考來源與相關資料:
1. [Gemini cli github](https://github.com/google-gemini/gemini-cli)
2. [Google 官方 blog](https://blog.google/intl/zh-tw/products/cloud/gemini-cli-your-open-source-ai-agent/)