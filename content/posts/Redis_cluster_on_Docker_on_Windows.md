---
title: "建立 Redis cluster on Docker (Windows)"
date: 2025-05-15T17:00:00+08:00
draft: false
---


### Setp 1: 基本環境:
1. Windows 11
2. docker desktop 4.41.2

<br/>


### Setp 2: 建立檔案
建立相關檔案，包含 Dockerfile、config 檔 以及 yaml 檔
* 資料夾結構:
    ```yaml
    redis-cluster/
    ├── nodes/
    │ ├── Dockerfile
    │ └── rediscluster.conf
    ├── docker-compose.yml
    └── README.md
    ```
* Dockerfile
    ```yaml
    FROM redis:7.4

    MAINTAINER Ann Chang <test@gmail.com>
    COPY rediscluster.conf /etc/redis/rediscluster.conf
    ENTRYPOINT redis-server /etc/redis/rediscluster.conf
    ```

* rediscluster.conf
    ```yaml
    # ip
    bind 0.0.0.0
    # 啟用 cluster
    cluster-enabled yes
    # 指定 cluster config 檔案
    cluster-config-file nodes.conf
    # 指定 node 無法連線時間
    cluster-node-timeout 5000
    #設置主服務的連接密碼(mypassword 為自定義的密碼)
    masterauth mypassword
    #設置從服務的連接密碼(mypassword 為自定義的密碼)
    requirepass mypassword
    #設定回報給 client 的可達 IP（外部 IP）
    cluster-announce-ip 127.0.0.1
    ```

* docker-compose.yml
    ```yaml
    services:
      redis-node1:
        build:
          context: nodes
        container_name: redis-node1 # 為了方便識別，建議加上 container_name
        hostname: redis-node1 # 添加 hostname
        ports:
          - "7000:7000"
          - "17000:17000"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7000"]
        volumes:
          - ./data/node1:/data # 建議為每個節點掛載獨立的數據卷，以便持久化和調試

      redis-node2:
        build:
          context: nodes
        container_name: redis-node2
        hostname: redis-node2 # 添加 hostname
        ports:
          - "7001:7001"
          - "17001:17001"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7001"]
        volumes:
          - ./data/node2:/data

      redis-node3:
        build:
          context: nodes
        container_name: redis-node3
        hostname: redis-node3 # 添加 hostname
        ports:
          - "7002:7002"
          - "17002:17002"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7002"]
        volumes:
          - ./data/node3:/data

      redis-node4:
        build:
          context: nodes
        container_name: redis-node4
        hostname: redis-node4 # 添加 hostname
        ports:
          - "7003:7003"
          - "17003:17003"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7003"]
        depends_on:
          - redis-node1
          - redis-node2
          - redis-node3
        volumes:
          - ./data/node4:/data

      redis-node5:
        build:
          context: nodes
        container_name: redis-node5
        hostname: redis-node5 # 添加 hostname
        ports:
          - "7004:7004"
          - "17004:17004"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7004"]
        depends_on:
          - redis-node1
          - redis-node2
          - redis-node3
        volumes:
          - ./data/node5:/data

      redis-node6:
        build:
          context: nodes
        container_name: redis-node6
        hostname: redis-node6 # 添加 hostname
        ports:
          - "7005:7005"
          - "17005:17005"
        restart: always
        entrypoint: [redis-server, /etc/redis/rediscluster.conf, --port, "7005"]
        depends_on:
          - redis-node1
          - redis-node2
          - redis-node3
        volumes:
          - ./data/node6:/data

      redis-cluster-creator:
        # 使用 redis 官方的最新穩定版本: 7.4
        image: redis:7.4
        # 增加 sleep 時間，確保所有節點完全啟動
        # mypassword 為自定義的密碼
        entrypoint: [/bin/sh, -c, 'sleep 30 && echo "yes" | redis-cli -a mypassword --cluster create redis-node1:7000 redis-node2:7001 redis-node3:7002 redis-node4:7003 redis-node5:7004 redis-node6:7005 --cluster-replicas 1']
        depends_on:
          - redis-node1
          - redis-node2
          - redis-node3
          - redis-node4
          - redis-node5
          - redis-node6
    ```

<br/>

### Step 3: 執行指令以啟動 redis cluster
* 檔案建立完成後，可開啟 command line，並進入到該資料夾結構的根目錄，譬如範例中使用的根目錄是 redis-cluster  
![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker1.png)
![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker2.png)

* 執行指令以建立 redis cluster:
  ```bash
  docker-compose up -d --build
  ```
  可看到預期成功的結果:

  ![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker3.png)

* 執行 `docker ps` 可看到目前所有 nodes 的狀態

  ![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker4.png)


* 最後進入 node1 ，執行 redis-cli 來查看 cluster 是否有正確被建立起來 ("mypassword" 的部分請改為自定義的密碼)
  ```bash
  docker exec redis-node1 redis-cli -h 127.0.0.1 -p 7000 -a mypassword cluster info
  ```
    
  執行結果應該顯示 ```cluster_state:ok``` 

  ![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker5.png)
    
  ```cluster_known_nodes:6``` 表示總共連接 6 個節點
  ```cluster_size:3``` 表示有 3 個主節點（3 個主節點和 3 個從節點）


<br/>

### Step 4: 關閉或移除 redis cluster
* 若要關閉 redis cluster，可執行
  ```bash
  docker-compose down
  ```
  ![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker6.png)

  那下次要重啟只要執行 ```docker-compose up -d``` 即可，會繼續使用舊的 images 來啟動，就不需要加上 ```--build``` 了
    
* 若要關閉並移除 image，則需要執行
  ```bash
  docker-compose down --rmi all
  ```
  ![image](/images/posts/RedisClusterOnDocker/RedisClusterOnDocker7.png)

  ```--rmi``` 會移除 images，這樣下次重啟就都要再加上 ``` --build``` 了
    

<br/>
<br/>

### 參考來源:
1. https://blog.yowko.com/docker-compose-redis-cluster/
2. ChatGPT, Gemini