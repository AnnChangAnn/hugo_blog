---
title: "Google Kubernetes Engine：從零開始部署 GKE 的完整流程教學（含清除資源）"
date: 2025-08-06T16:00:00+08:00
draft: false
author: "Wayne"
keywords: ["GKE 教學", "GKE", "k8s", "GCP Kubernetes 部署實例", "從建立 Cluster 到 Ingress HTTPS 與資源清除", "GKE Cluster", "Ingress", "Google Kubernetes Engine", "Kubernetes"]
description: "本文教你如何從 0 開始部署一個 Google Kubernetes Engine（GKE）應用，由建立一個基本的網頁開始，後續包括建立 Cluster、撰寫 Dockerfile、上傳 Artifact Registry、設定 Ingress 與 HTTPS 憑證，最後完整刪除所有資源。適合 GCP 初學者與 DevOps 工程師參考的實戰指南。"
images: ["/images/favicon.svg"]
---

本文教你如何從 0 開始部署一個 Google Kubernetes Engine（GKE）應用，由建立一個基本的網頁開始，後續包括建立 Cluster、撰寫 Dockerfile、上傳 Artifact Registry、設定 Ingress 與 HTTPS 憑證，最後完整刪除所有資源。適合 GCP 初學者與 DevOps 工程師參考的實戰指南。  

<br/>

### Step 1: 建立一個簡單的node.js App  
首先進到 Google Cloud 頁面，點選右上方的 Cloud Shell  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide1.png)  

接著網頁下方會開啟終端機畫面，並且終端機的分頁名稱就是你的 project ID  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide2.png)  

先來建立一個簡單的網頁吧!  
我們先建立一個 server.js，在終端機上輸入 ```vi server.js```，按 Enter 後，將以下內容複製貼上  
```js
var http = require('http');
var handleRequest = function(request, response) {
          response.writeHead(200);
          response.end("Hello World from Wayne!");
}
var www = http.createServer(handleRequest);
www.listen(8080);
```
接著按下 ```Esc```，輸入 ```:wq``` 儲存並離開  

可以先試著預覽網頁看看，輸入 ```node server.js``` 並點選預覽，可看到網頁畫面  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide3.png)  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide4.png)  


<br/>

### Step 2: 建立一個 Dockerfile  

關閉預覽畫面，我們回到 Cloud Shell  
輸入指令 ```vi Dockerfile``` 並按下 Enter，將以下內容複製貼上  
```dockerfile
FROM node:6.9.2
EXPOSE 8080
COPY server.js .
CMD node server.js
```
一樣 ```Esc```、```:wq``` 儲存並離開  
此時我們已經有 server.js、Dockerfile 兩個檔案了，可以準備將其打包成 image 並放上 Artifact Registry 了  

<br/>

### Step 3: 建立一個 Artifact Registry 存放區  

我們直接搜尋 Artifact Registry，找到他並點進去  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide5.png)  

可以釘選他以後方便維護  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide6.png)  

點選 "建立存放區"  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide7.png)  

輸入名稱，格式選擇 Docker，區域選擇台灣，按下建立後即可看到我們所建立的存放區  
這邊先建立一個名稱為 "hello-node" 的存放區  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide8.png)  


<br/>

### Step 4: 授權 Docker 使用 Artifact Registry  

在存放區的畫面上，我們找到 "設定操作說明"  
點選他，旁邊會顯示一段指令，直接貼到 Cloud Shell 上執行即可  
執行完成後會看到它顯示註冊成功  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide9.png)  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide10.png)  


<br/>

### Step 5: 建立 Docker image  

在同樣的存放區畫面上，點選 "複製路徑"  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide11.png)  

再加上我們自行設定的 image 名稱和版本(tag)，即可組成 image的完整路徑  
```asia-east1-docker.pkg.dev/{my-project-id}/hello-node/{image_name}:{tag}```  

以我的 image 為例，完整路徑大概會長這樣:  
```asia-east1-docker.pkg.dev/my-project-id/hello-node/hello-node:v1```  

接著將他組成指令，並於 Cloud Shell 上執行  
(注意! 指令最後面有個 ```.``` 是不可缺少的喔)  
```docker build -t asia-east1-docker.pkg.dev/{my-project-id}/hello-node/hello-node:v1 . ```  

等他跑一段時間，可以看到他成功的 build 起來了  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide12.png)  
  
  
<br/>

### Step 6: 測試並推送 Docker image 到 Artifact Registry  
  
要確認我們 build 的 image 是否可以正常運作，當然是讓他跑起來看看囉!  
剛剛已經有 image 的完整路徑了，要執行的指令大致如下:  
```docker run -d -p [port]:[port] {image 完整路徑}```  

以我的為例，就會是  
```docker run -d -p 8080:8080 asia-east1-docker.pkg.dev/my-project-id/hello-node/hello-node:v1```  

執行完後，我們一樣可以預覽網頁看看  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide13.png)  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide14.png)  

看來沒什麼問題，那就可以先把它停掉了  
我們先查詢一下目前正在跑的 container，執行 ```docker ps```  
可以看到有一個 container 正在執行，並且有顯示 container ID  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide15.png)  

執行 ```docker stop {constiner ID}``` 來關閉它  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide16.png)  


接著就是把她推送上去，輸入指令並等待他推送完成  

```docker push {image 完整路徑}```  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide17.png)  


<br/>

### Step 7: 建立 GKE Cluster  

輸入指令來建立 GKE Cluster  
```
gcloud container clusters create hello-cluster \
  --zone asia-east1 \
  --num-nodes=2 \
  --disk-type=pd-standard
```
這邊我建立了兩個 nodes，並使用標準磁碟 (pd-standard) 而不是 SSD (pd-ssd)，對於我們要建立的小型測試來說已經足夠了，也不會佔用到我們 SSD 的配額  

等待幾分鐘後就建立完成了，可以看到建立後的相關資訊  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide18.png)  

我們也可以用指令來查看 cluster 內的 nodes  
```gcloud compute instances list | grep gke ```  

接著執行指令來取得 cluster 認證  
```gcloud container clusters get-credentials hello-cluster --zone asia-east1```  


<br/>

### Step 8: 建立 Deployment + Service + Ingress YAML 檔案  

接下來就是建立各個 YAML 檔來部屬資源了  
這裡我們會建立 3 個 YAML 檔，分別是  
- deployment.yaml : 定義要部屬的 pod
- service.yaml : 建立服務並提供統一入口
- ingress.yaml : 建立 Load Balance 並提供對外入口

<br/>

輸入 ```vi deployment.yaml``` 並執行，將以下內容複製貼上，記得修改自己的 name 和 image 路徑，最後一樣 ```Esc```, ```:wq``` 儲存並離開  
這邊我設定名稱為 "hello-node"  
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-node
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-node
  template:
    metadata:
      labels:
        app: hello-node
    spec:
      containers:
      - name: hello-node
        image: asia-east1-docker.pkg.dev/{my-project-id}/node-app/hello-node:v1
        ports:
        - containerPort: 8080
```  
<br/>

輸入 ```vi service.yaml``` 來建立其內容，這邊我們設定 NodePort 讓後續 Ingress 可以對應進來  
這邊我設定名稱為 "hello-node-service"  
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-node-service
spec:
  selector:
    app: hello-node
  ports:
  - port: 80
    targetPort: 8080
  type: NodePort

```

<br/>

輸入 ```vi ingress.yaml``` 來建立 ingress 相關資訊  
這邊我設定名稱為 "hello-node-ingress"  
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-node-ingress
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: hello-node-service
                port:
                  number: 80
```

<br/>

### Step 9: 部屬所有資源以及建立 Domain  

終於到了部屬資源的環節了，分別執行以下三個指令來部屬我們剛剛建立的 YAML 資源  
```
kubectl apply -f deployment.yaml  
kubectl apply -f service.yaml  
kubectl apply -f ingress.yaml   
```

接下來需要等幾分鐘才拿得到我們的 External IP  
這時可以先來申請個免費的 domain，我們使用 DuckDNS 來申請  
進入 [DuckDNS](https://www.duckdns.org/)  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide19.png)  

上面有各種登入方式，登入後可以輸入自己想要的 domain name  
譬如我這裡輸入 "hello-node-test"  
按下 "add domain"，就會出現我們剛剛設定好的 domain 以及目前 domain 的 IP  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide20.png)  


<br/>

### Step 10: 連結 External IP  

隔幾分鐘後，來查一下我們的 External IP  
```kubectl get ingress hello-node-ingress```  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide21.png)  

這裡可以看到 IP 了  

接著回到 DuckDNS 上，將 domain 後面的 current ip 更新成我們剛剛拿到的 External IP  
最後開啟我們的 domain，譬如我的是：http://hello-node-test.duckdns.org/  
就可以成功看到我們的網站了!  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide22.png)  


<br/>

### Step 11: 啟用 Https (可選)  

此時我們的網站還是 http，沒有 SSL 憑證  
因此我們可以使用 GCP ManagedCertificate 來建立憑證  

首先輸入 ```vi certificate.yaml``` 並建立我們的第 4 個 YAML 檔
這邊我設定名稱為 "hello-cert"  
domains 記得設定為自己的 domain  
```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: hello-cert
spec:
  domains:
    - hello-node-test.duckdns.org
```

儲存好後，執行  
```kubectl apply -f certificate.yaml```  

可以使用以下指令看看是否建立成功  
```kubectl get managedcertificate hello-cert```  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide23.png)  


建立成功後，我們要修改原本的 ingress.yaml  
輸入 ```vi ingress.yaml``` ，我們要增加憑證和 domain 的相關內容  
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-node-ingress
  # ------ 增加憑證的部分 ------
  annotations:
    networking.gke.io/managed-certificates: hello-cert
  # --------------------------
spec:
  rules:
    - host: hello-node-test.duckdns.org  #增加 domain
      http:                              #注意 http 前面的"-"拿掉了
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: hello-node-service
                port:
                  number: 80
```

修改完成後，執行  
```kubectl apply -f ingress.yaml```  

這邊可能要等個 5~15 分鐘等待憑證生效，我們可以用指令查詢  
```kubectl describe managedcertificate hello-cert```  

當憑證準備完成時，你會看到狀態為 Active  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide24.png)  

這時我們就可以再回到我們的網頁了  
這次輸入 ```https://{domain}``` 就不會再顯示是不安全的網頁了!  
![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide25.png)  


<br/>

### Step 12: 清除 cluster 資源避免帳單暴增 (可選)  

如果你要讓你的網頁持續運作，那這個步驟可以跳過，基本上網頁部屬已經完成了  
但如果你只是做個測試，想必是玩完就該關掉了，不然下個月收到帳單可能會有點難過><  

如果你還想留著 GKE cluster，則可以執行以下 3 個指令  
```
kubectl delete deployment hello-node
kubectl delete service hello-node-service
kubectl delete ingress hello-node-ingress
```
如果你想連 GKE cluster 整個刪除，可以直接執行  

```gcloud container clusters delete hello-cluster --zone asia-east1```  

這邊可能須等個 5~10 分鐘才會刪除完成  

接著可以來刪除 repositories，執行  

```gcloud artifacts repositories delete hello-node --location=asia-east1```  

![image](/images/posts/GKECompletePracticalGuide/GKE_Practical_Guide26.png)  

最後，回到 [DuckDNS](https://www.duckdns.org/)  
如果 domain 還需要用的話可以留，但建議 IP 的部分要刪除  
這樣就把所有啟用的資源都差不多清除了~  

    
<br/>
<br/>

### 總結
對於初次嘗試 k8s 相關操作的我來說，這次在 GKE 上使用算是蠻複雜的，而且網路上不少操作說明都可能只做某一些部分，或是因為 Google 政策上的調整，有些作法或指令已無法再使用。還有部分指令等待的時間蠻久的，讓我懷疑我到底有沒有做對 哈哈！ 透過這次完整的紀錄下建立 GKE 的過程和步驟，自己也更了解每個步驟在做什麼，也希望能幫助到看到這裡的你😊


<br/>
<br/>

### 參考來源與相關資料:
1. [Google 官方文件](https://cloud.google.com/kubernetes-engine/docs?hl=zh-tw)
2. https://dongdonggcp.com/2025/07/20/artifact-registry-tutorials/
3. https://ikala.cloud/blog/application-modernization/tutorials-kubernetes-engine-load-balancer
4. https://blog.cloud-ace.tw/application-modernization/devops/google-kubernetes-engine-tutorial-create-a-cluster/