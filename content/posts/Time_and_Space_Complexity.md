---
title: "解題：透過 Constraints 來判斷可接受的時間與空間複雜度"
date: 2025-06-15T15:00:00+08:00
draft: false
keywords: ["Time Complexity", "Space Complexity", "Big O Notation", "Algorithm", "Data Structure", "LeetCode", "演算法", "資料結構"]
description: "本文深入探討了演算法中的時間複雜度與空間複雜度，並介紹了 Big O Notation 的概念與常見表示法。文章特別強調在 LeetCode 等解題平台中，如何透過題目給定的 Constraints 來判斷可接受的演算法複雜度，並歸納了不同輸入大小下，適合使用的演算法類型，幫助讀者更有效率地解題。"
images: ["/images/favicon.svg"]
---


在解題或競程時，通常都會有一些時間或記憶體的限制  
若超出限制，就可能會出現 TLE（Time Limit Exceed）或 MLE（Memory Limit Exceed）的錯誤  
為了能夠讓程式順利執行，處理時間複雜度和空間複雜度的部分就格外重要  

<br/>

### 時間複雜度 (Time Complexity)
簡單來說，就是電腦在執行這段演算法時所需的計算量  
但不同的電腦因為硬體或其他因素，在實際執行演算法時所花費的時間還是不同，因此時間複雜度並不代表實際所花費的時間

### 空間複雜度 (Space Complexity)
電腦在執行這段演算法時所需的最大記憶體使用量  

<br/>

### Big O Notation (大 O 符號)

一般我們會用 Big O Notation (簡稱 big O) 來表示時間與空間複雜度  
例如給定一個 array 的輸入資料，當這個演算法需要遍歷整個 array 一遍才能完成計算，我們就可以用 O(n) 來表示這個演算法的時間複雜度，n 代表這個輸入資料 array 的長度  

```python
for i in array:
    print(i)
```

若今天是兩個 for loop 的巢狀結構來遍歷 array:

```python
for i in array:
    for j in array:
        current = i + j
        print(current)
```
此時的時間複雜度就可以寫成 O(n²)

若今天的計算量是成 **對數成長**，譬如經典的二分搜尋法 (binary search)
```python
def binary_search(array: List[int], target: int):
    left = 0
    right = len(array) - 1
    
    while (left <= right):
        mid = (left + right) // 2;
        if array[mid] == target:
            return mid
        elif array[mid] < target
            left = mid + 1;
        else{
            right = mid - 1;
        
    return -1;
```
此時的時間複雜度就可以寫成 O(log n)

<br/>

空間複雜度也與時間複雜度算方式類似，若今天給定一個輸入資料 array，在演算法的執行過程中，須建立一個長度相同的 new_array 才能完成計算，則一樣可用 O(n) 來表示這個演算法的空間複雜度
```python
new_array = []
for i in array:
    new_array.append(i)
```

若是兩個 for loop 的巢狀結構，則可以表示為 O(n²)
```python
new_array = []
for i in array:
    for j in array:
        current = i + j
        new_array.append(current)
```

<br/>

### 解題
在解題時，以 Leetcode 為例，通常題目都會給我們一些條件限制，也就是 Constraints 的部分，我們就可以透過 Constraints 來簡單判斷這題可接受的最大時間與空間複雜度是多少，進而來思考我們能用的演算法有哪些  
以下就用表格稍微歸納了在不同的時間與空間複雜度之下，我們能用哪些演算法來解題~

<br/>

### Time Complexity : 操作步驟次數約小於 10^7 次
| 輸入大小 `n` | 可接受的最大時間複雜度 | 範例演算法                          |
|--------------|--------------------------|-------------------------------------|
| ≤ 10         | O(n!)、O(2^n)             | 暴力列舉、DFS、排列組合             |
| ≤ 100        | O(n³)                     | 三層迴圈、DP with 3D state          |
| ≤ 1,000      | O(n²)                     | 雙層迴圈、Floyd-Warshall、窮舉配對  |
| ≤ 10⁴        | O(n log n)                | 排序、堆、貪心、分治                |
| ≤ 10⁵        | O(n log n)                | Hash、Union-Find、線段樹            |
| ≤ 10⁶        | O(n)                      | 一次遍歷、prefix sum、bucket sort  |
| ≤ 10⁷        | O(n) (極限)               | Bitwise 處理、rolling hash 等       |

<br/>

### Space Complexity : 約小於 10^6
| 空間複雜度   | 安全上限（元素數量） | 範例資料結構                    |
|--------------|----------------------|----------------------------------|
| O(1)         | 任意                 | 原地操作（in-place）、指標        |
| O(n)         | n ≤ 10⁶              | list, set, dict, DSU, prefix sum |
| O(n log n)   | n ≈ 10⁵              | 排序輔助陣列、線段樹              |
| O(n²)        | n ≤ 10³              | 矩陣、鄰接矩陣、DP 二維狀態表     |
| O(2^n)       | n ≤ 20               | Bitmask DP、狀態記憶               |

<br/>
<br/>

### 參考來源:
1. 我的小腦袋
2. ChatGPT