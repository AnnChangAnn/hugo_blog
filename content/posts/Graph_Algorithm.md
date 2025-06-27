---
title: "解題：Graph 資料結構與演算法"
date: 2025-06-26T16:30:00+08:00
draft: false
---


在 LeetCode、競程或面試中，許多圖論題目會涉及「最短路徑」或「圖的遍歷」等情境。根據圖的性質（是否有權重、有沒有負權、有沒有負環等），我們可以快速判斷使用哪種演算法來達到最好的效果。

<br/>

以下先整理了常見的圖論題型與其對應的最佳演算法，後續我們再來一一介紹每個演算法~


### 解題場景
| 場景                           | 最適演算法       | 適用情況描述                              |
|------------------------------|------------------|-------------------------------------------|
| 無權圖（所有邊為 1）          | BFS              | 最短步數問題（地圖、字串轉換等）         |
| 有非負權重                    | Dijkstra         | 各路徑代價不同但都非負                   |
| 有負權重但無負環              | Bellman-Ford     | 有負邊但沒有負環，適合部分金融問題等     |
| 有負環需偵測                  | Bellman-Ford / Floyd-Warshall | 判斷圖是否有邏輯錯誤或陷阱     |
| 所有點對最短路徑              | Floyd-Warshall   | 多源最短路徑查詢，適合節點數不大的圖     |
| 權重只有 0 或 1               | 0-1 BFS          | 更快的最短路計算，適合特殊地圖類型       |


<br/>

### BFS 演算法
廣度優先搜尋演算法（英語：Breadth-first search，縮寫：BFS），一種圖形搜尋演算法。簡單的說，BFS是從根節點開始，沿著樹的寬度遍歷樹的節點。如果所有節點均被訪問，則演算法中止(對這是抄維基的)  
BFS 可用在找無權圖(所有邊線的權重都是1)的最短路線，像是迷宮找路、最短跳躍步數等等，通常透過使用 list 或 dictionary 建立各節點相連的鄰接表，再用 queue 來一步步找到最短距離

例題:   
給你一個無權圖，有 n 個節點（從 0 到 n-1），和一組邊 edges，每條邊連接兩個節點。請你計算從起點 start 出發，到每個節點的最短距離（用幾步表示）。  
若某節點無法到達，回傳距離為 -1。

```python
from collections import deque
from typing import List, Tuple

def bfs_shortest_path(n: int, edges: List[Tuple[int, int]], start: int) -> List[int]:
    # 建立鄰接表
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # 如果是無向圖，記得雙向加邊

    # 初始距離設為 -1（表示尚未拜訪）
    dist = [-1] * n
    dist[start] = 0

    # BFS 初始化
    q = deque([start])

    while q:
        u = q.popleft()
        for v in graph[u]:
            if dist[v] == -1:  # 還沒拜訪過
                dist[v] = dist[u] + 1
                q.append(v)
    
    return dist

```
測試資料與測試結果  
```python
n = 6
edges = [
    (0, 1),
    (0, 2),
    (1, 3),
    (2, 3),
    (3, 4),
    (4, 5)
]
start = 0

result = bfs_shortest_path(n, edges, start)
print("最短距離:", result)
```

Time complexity: **O(V + E)**  
Space complexity: **O(V)**

其中:  
V 是城市（節點）數量  
E 是航班（邊）數量  

---

<br/>


### 0-1 BFS 演算法
算是 BFS 的變形，因為邊線的權重只有 0 和 1 ，當遇到權重為 0 的路線時，則需優先走這個路線，因此將原本使用 queue 改為使用 deque，並透過 appendleft 和 popleft 來優先尋找權重為 0 的路線

例題:   
給你一個圖，每個邊的權重要嘛是 0 (免費移動)，要嘛是 1 (需要花費一次移動)，  
請從起點 0 找到所有點的最短距離。  
列表 "edges" 內的資料代表 (from, to, weight)  
```python
from collections import deque

def zero_one_bfs(n, edges, start):
    # 建圖：鄰接表
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))  # 如果是無向圖，記得雙向加邊

    # 距離初始化
    dist = [float('inf')] * n
    dist[start] = 0

    dq = deque()
    dq.append(start)

    while dq:
        u = dq.popleft()

        for v, w in graph[u]:
            # 如果找到更短的距離
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if w == 0:
                    dq.appendleft(v)  # 0權重 → 優先處理
                else:
                    dq.append(v)      # 1權重 → 放後面慢慢處理

    return dist
```

測試資料與測試結果
```python
edges = [
    (0, 1, 0),
    (0, 2, 1),
    (1, 2, 0),
    (1, 3, 1),
    (2, 3, 0),
]
print(zero_one_bfs(4, edges, 0))  # ➜ [0, 0, 0, 0]
```

Time complexity: **O(V + E)**  
Space complexity: **O(V)**  

其中:  
V 是城市（節點）數量  
E 是航班（邊）數量  

---

<br/>


### Dijkstra 演算法
Dijkstra 是荷蘭的 CS 學者，發音讀作 d /ai/ kstra，適合找出有非負權重的最短路徑算法，例如：找最便宜機票路線  
算是 Greedy 演算法在 Graph 圖形資料上的應用，使用 BFS 搭配 binary heap 來進行計算，可搭配 set 來記錄走過的節點，或在 heap 中增加一個 list 來記錄完整路徑

例題:   
找出從 城市A 飛到 城市F 的最便宜機票路徑，  
列表 "flights" 內的資料代表 [起始城市, 到達城市, 花費]
```python
import heapq
from collections import defaultdict

def find_cheapest_path(flights, start, end):
    # 建立圖（鄰接表）
    graph = defaultdict(list)
    for src, dst, cost in flights:
        graph[src].append((dst, cost))

    # 優先隊列：每個元素是 (目前總花費, 當前城市, 路徑)
    heap = [(0, start, [start])]
    visited = set()

    while heap:
        cost, city, path = heapq.heappop(heap)

        if city in visited:
            continue
        visited.add(city)

        # 若到達終點，回傳答案
        if city == end:
            return cost, path

        # 將鄰近城市加入優先隊列
        for neighbor, flight_cost in graph[city]:
            if neighbor not in visited:
                heapq.heappush(heap, (cost + flight_cost, neighbor, path + [neighbor]))

    return float('inf'), []  # 無法到達的情況

# 測試資料
flights = [
    ['A', 'B', 4],
    ['A', 'C', 2],
    ['B', 'F', 5],
    ['C', 'D', 3],
    ['C', 'E', 4],
    ['D', 'E', 3],
    ['D', 'F', 1],
    ['E', 'F', 1],
]

# 測試：從 A 到 F
total_cost, route = find_cheapest_path(flights, 'A', 'F')

print("最便宜的票價總和:", total_cost)
print("最便宜的路線:", " -> ".join(route))
```
Time complexity: **O((V + E) log V)**  
Space complexity: **O(E * V)**, 若不記錄路徑則可降為 **O(E + V)**  

其中:  
V 是城市（節點）數量  
E 是航班（邊）數量  

---

<br/>


### Bellman-Ford 演算法
和 Dijkstra 演算法類似，皆是找出**最短路徑**算法，不同的是 Bellman-Ford 可接受含有**負值**的權重，但遇到**負循環**時則無法計算，可增加是否含有負循環的判斷  
若以 "找出便宜機票路徑" 的範例來說， Bellman-Ford 算法類似於搭配紅眼班機轉機給的折價優惠  

例題:   
找出從 城市A 飛到 城市C 的最便宜機票路徑，票價可為負值，  
列表 "flights" 內的資料代表 [起始城市, 到達城市, 花費]

```python
def bellman_ford(flights, start, end):
    # 初始化圖中所有節點
    vertices = set()
    for u, v, _ in flights:
        vertices.add(u)
        vertices.add(v)
    vertices = list(vertices)

    # 初始化距離與前驅節點
    dist = {v: float('inf') for v in vertices}
    prev = {v: None for v in vertices}
    dist[start] = 0

    # 執行 V-1 輪鬆弛 (relaxation)
    # 每輪鬆弛會嘗試讓所有邊的目標節點 v 得到更短的距離
    for _ in range(len(vertices) - 1):
        for u, v, cost in flights:
            if dist[u] + cost < dist[v]:
                dist[v] = dist[u] + cost
                prev[v] = u

    # 檢查是否存在負環
    # 若在第 V 輪還能鬆弛，表示一定有 負環
    for u, v, cost in flights:
        if dist[u] + cost < dist[v]:
            raise ValueError("圖中包含負權重環，無法正確計算最短路徑")

    # 回溯路徑
    if dist[end] == float('inf'):
        return float('inf'), []  # 無法到達

    path = []
    curr = end
    while curr:
        path.append(curr)
        curr = prev[curr]
    path.reverse()

    return dist[end], path

# 測試：從 A 到 C
try:
    flights = [
        ['A', 'B', 1],
        ['B', 'C', 3],
        ['A', 'C', 10],
        ['C', 'D', -4],
        ['D', 'B', -2],  # 創造一個負環：B → C → D → B
    ]

    cost, route = bellman_ford(flights, 'A', 'C')
    print("最便宜的票價總和:", cost)
    print("最便宜的路線:", " -> ".join(route))
except ValueError as e:
    print("錯誤:", e)
```
<br/>

此次的執行結果為:
```
錯誤: 圖中包含負權重環，無法正確計算最短路徑
```
若拿掉```['D', 'B', -2]```，則會得到：
```python
最便宜的票價總和: 4
最便宜的路線: A -> B -> C
```
<br/>

Time complexity: **O(V * E)**  
Space complexity: **O(V + E)**  

其中:  
V 是城市（節點）數量  
E 是航班（邊）數量  

---

<br/>


### Floyd–Warshall 演算法
若 Dijkstra 演算法是找出A到B的最短路徑，那 Floyd–Warshall 演算法就是找出**任兩點之間的最短路徑**，和 Bellman-Ford 一樣可接受含有**負值**的權重，但遇到**負循環**時則無法計算，可增加是否含有負循環的判斷  
因為需要三層迴圈來遍歷所以的起點、中繼點和終點，因此時間複雜度較高，適合節點不多但需做多種查詢的情境  
若以 "找出便宜機票路徑" 的範例來說， Floyd–Warshall 算法則類似於找出任兩個城市間的最便宜機票  

例題:   
找出任兩個城市間的最便宜機票，票價可為負值，  
列表 "flights" 內的資料代表 [起始城市, 到達城市, 花費]
```python
def floyd_warshall(flights):
    # 初始化節點清單
    cities = set()
    for u, v, _ in flights:
        cities.add(u)
        cities.add(v)
    cities = sorted(cities)  # 可讓結果更穩定好讀
    n = len(cities)

    # 城市 → 索引 對照表
    idx = {city: i for i, city in enumerate(cities)}
    inv_idx = {i: city for city, i in idx.items()}

    # 建立距離與前驅矩陣
    dist = [[float('inf')] * n for _ in range(n)]
    next_hop = [[None] * n for _ in range(n)]

    for i in range(n):
        dist[i][i] = 0  # 自己到自己距離為 0

    for u, v, cost in flights:
        i, j = idx[u], idx[v]
        dist[i][j] = cost
        next_hop[i][j] = j

    # 核心：三層迴圈進行距離鬆弛
    for k in range(n):          # 中繼點
        for i in range(n):      # 起點
            for j in range(n):  # 終點
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    next_hop[i][j] = next_hop[i][k]

    # 回傳一個查詢函數，可輸入起訖城市得到最短路徑與成本
    def get_path(from_city, to_city):
        if from_city not in idx or to_city not in idx:
            return float('inf'), []
        i, j = idx[from_city], idx[to_city]
        if dist[i][j] == float('inf'):
            return float('inf'), []

        # 重建路徑
        path = [from_city]
        while i != j:
            i = next_hop[i][j]
            path.append(inv_idx[i])
        return dist[idx[from_city]][idx[to_city]], path

    return get_path, dist
```

測試範例
```python
flights = [
    ['A', 'B', 3],
    ['A', 'C', 8],
    ['B', 'C', 2],
    ['B', 'D', 5],
    ['C', 'D', 1],
    ['D', 'A', 4],
]

get_path, _ = floyd_warshall(flights)

cost, route = get_path('A', 'D')
print("A → D 最便宜票價:", cost)
print("路徑:", " -> ".join(route))

cost, route = get_path('C', 'A')
print("C → A 最便宜票價:", cost)
print("路徑:", " -> ".join(route))
```

可獲得結果
```python
A → D 最便宜票價: 6
路徑: A -> B -> C -> D

C → A 最便宜票價: 5
路徑: C -> D -> A
```

若需檢查是否存在負環，可增加這個判斷式
```python
for i in range(n):
    if dist[i][i] < 0:
        raise ValueError("圖中包含負權重環")
```
<br/>

Time complexity: **O(V³)**  
Space complexity: **O(V²)**  

其中:  
V 是城市（節點）數量  

<br/>
<br/>

### 參考來源:
1. Wiki
2. ChatGPT