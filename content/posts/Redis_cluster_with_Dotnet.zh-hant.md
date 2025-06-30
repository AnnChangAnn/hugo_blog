---
title: "使用 .Net Core 註冊 StackExchange.Redis 並操作 Redis Cluster on Docker"
date: 2025-06-05T16:00:00+08:00
draft: false
keywords: [".Net Core", "Redis", "Redis Cluster", "StackExchange.Redis", "Docker", "Web API", "教學"]
description: "本篇教學詳細介紹如何在 .Net Core Web API 專案中，整合 StackExchange.Redis 函式庫來操作 Redis Cluster。內容涵蓋了 Redis 設定檔的配置、服務註冊的擴充方法、Redis 服務介面與實作，以及透過 API 控制器進行 Redis 資料的 Get/Set/Delete 操作。文章也提供了完整的程式碼範例與測試步驟，幫助開發者快速上手。"
images: ["/images/favicon.svg"]
---


### Setp 1: 基本環境:
1. Windows 11
2. .Net Core 8.0 Web API 專案
3. NuGet packages
    * StackExchange.Redis
    * StackExchange.Redis.Extensions.AspNetCore
    * StackExchange.Redis.Extensions.Core
    * StackExchange.Redis.Extensions.Newtonsoft
4. Docker desktop 4.41.2
5. Redis 7.4

<br/>

p.s. Nuget 可能不用裝這麼多， uninstall 幾個也許還是可以 work 的，但我懶得試了XD

<br/>


### Step 2: 建立 Redis Cluster
可參考我之前的筆記: [建立 Redis cluster on Docker (Windows)](/posts/redis_cluster_on_docker_on_windows/)  
這次的範例也會使用這份筆記內的 Redis Cluster 設定

<br/>


### Setp 3: 加入 Redis 的相關 config 到 appsetting.json 中

```json
// some settings ...

"Redis": {
  "Password": "mypassword",
  "Endpoints": [
    "localhost:7000",
    "localhost:7001",
    "localhost:7002",
    "localhost:7003",
    "localhost:7004",
    "localhost:7005"
  ],
  "ConnectTimeout": 5000,
  "SyncTimeout": 5000,
  "AbortOnConnectFail": false
},

// some settings ...
```

```Password``` 設定為自己的 Redis Cluster 密碼  
```Endpoints``` 為 cluster 的 6 個 nodes，依照原本的 redis conf 內的 ip 和 yaml 內每個節點的 port 設定  


<br/>

### Setp 4: 建立 RedisSettings.cs
在專案下建立 Configurations 資料夾，並在該資料夾下新增一個 RedisSettings.cs 來存放 Config 內容，column 就會依照 appsetting.json 內的設定

```C#
public class RedisSettings
{
    public const string SectionName = "Redis";

    public string Password { get; set; } = string.Empty;
    public List<string> Endpoints { get; set; } = new();
    public int ConnectTimeout { get; set; } = 5000;
    public int SyncTimeout { get; set; } = 5000;
    public bool AbortOnConnectFail { get; set; } = false;
}
```


<br/>
    
### Setp 5: 建立 ServiceCollectionExtensions.cs
在專案下建立 Extensions 資料夾，並在該資料夾下建立 ServiceCollectionExtensions.cs，後續會在 Program.cs 來加入服務  
當然也可以在 Program.cs 內直接做 AddSingleton，但用 Extension 可以增加一些異常判斷，然後看起來好像比較複雜比較厲害一點XD  

```C#
public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
{
    // 使用 Configure<RedisSettings> 來綁定其他簡單的屬性
    services.Configure<RedisSettings>(configuration.GetSection(RedisSettings.SectionName));

    services.AddSingleton<IDatabase>(serviceProvider =>
    {
        // 從配置中獲取整個 RedisSettings 對象
        var redisSettings = configuration.GetSection(RedisSettings.SectionName).Get<RedisSettings>();
        List<string> actualEndpoints = redisSettings.Endpoints;

        // 檢查是否有端點，如果沒有，則拋出異常
        if (!actualEndpoints.Any())
        {
            throw new InvalidOperationException("No Redis endpoints found or could not be parsed from configuration.");
        }

        // 確保 password 即使為空也可用，如果設定為 null，StackExchange.Redis 可能會報錯
        string password = redisSettings?.Password ?? string.Empty;

        var configurationOptions = new ConfigurationOptions
        {
            Password = password,
            ConnectTimeout = redisSettings?.ConnectTimeout ?? 5000,
            SyncTimeout = redisSettings?.SyncTimeout ?? 5000,
            AbortOnConnectFail = redisSettings?.AbortOnConnectFail ?? false,
            Ssl = false, // 如果沒有使用 SSL/TLS
        };

        foreach (var endpoint in actualEndpoints)
        {
            configurationOptions.EndPoints.Add(endpoint);
        }

        // 執行連接
        Log.Information("Connecting to Redis with endpoints: {Endpoints}", string.Join(", ", actualEndpoints));
        Log.Information("Using Redis password: {PasswordPresent}", !string.IsNullOrEmpty(password) ? "Yes" : "No");

        // 直接註冊 do0 對於後續使用比較方便
        return ConnectionMultiplexer.Connect(configurationOptions).GetDatabase(0);
    });

    return services;
}
```

接著在 Program.cs 加入服務
```C#
builder.Services.AddRedis(builder.Configuration);
```
看起來如下
![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet1.png)


<br/>

### Step 6: 建立 IRedisService、RedisService
在專案下建立 Services 資料夾，並在該資料夾下再建立一個 Interfaces 資料夾，接著在 Interfaces 資料夾內建立 IRedisService.cs
```C#
public interface IRedisService
{
    Task<string?> GetAsync(string key);
    Task<bool> SetAsync(string key, string value, TimeSpan? expiry = null);
    Task<bool> DeleteAsync(string key);
}
```

回到上一層，在 Services 資料夾下建立 RedisService.cs，這邊就會建立針對 Redis 的操作，包含基本的 Get/Set/Delete，_logger 的部分若不需使用，也可以全部拿掉
```C#
public class RedisService : IRedisService
{
    private readonly IDatabase _redisDb;
    private readonly ILogger<RedisService> _logger;

    public RedisService(IDatabase redisDb, ILogger<RedisService> logger)
    {
        _redisDb = redisDb;
        _logger = logger;
    }

    public async Task<string?> GetAsync(string key)
    {
        try
        {
            var value = await _redisDb.StringGetAsync(key);
            return value.HasValue ? value.ToString() : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis GET error for key '{Key}': {ErrorMessage}", key, ex.Message);
            return null;
        }
    }

    public async Task<bool> SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        try
        {
            return await _redisDb.StringSetAsync(key, value, expiry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis SET error for key '{Key}': {ErrorMessage}", key, ex.Message);
            return false;
        }
    }

    public async Task<bool> DeleteAsync(string key)
    {
        try
        {
            return await _redisDb.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis DELETE error for key '{Key}': {ErrorMessage}", key, ex.Message);
            return false;
        }
    }
}
```
接著再回到 Program.cs 將 RedisService 注入
```C#
builder.Services.AddScoped<IRedisService, RedisService>();
```

這步驟完成後，包含前面的 Extension，Program.cs 新增的部分會長這樣:  

![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet2.png)

<br/>

### Step 7: 建立 RedisController.cs
最後一步，在專案下的 Controller 資料夾建立 RedisController.cs，用來建立操作 Redis 的 API 服務
```C#
[ApiController]
[Route("api/[controller]")]
public class RedisController : ControllerBase
{
    private readonly IRedisService _redisService;

    public RedisController(IRedisService redisService)
    {
        _redisService = redisService;
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<string>> Get(string key)
    {
        var value = await _redisService.GetAsync(key);
        if (value == null)
            return NotFound();

        return Ok(value);
    }

    [HttpPost("{key}")]
    public async Task<ActionResult> Set(string key, string value)
    {
        var success = await _redisService.SetAsync(key, value);
        if (!success)
            return StatusCode(500, "Failed to set value");

        return Ok();
    }

    [HttpPost("{key}/expire")]
    public async Task<ActionResult> SetWithExpiry(string key, string Value, int ExpirySeconds)
    {
        var expiry = TimeSpan.FromSeconds(ExpirySeconds);
        var success = await _redisService.SetAsync(key, Value, expiry);
        if (!success)
            return StatusCode(500, "Failed to set value");

        return Ok();
    }

    [HttpDelete("{key}")]
    public async Task<ActionResult> Delete(string key)
    {
        var success = await _redisService.DeleteAsync(key);
        return Ok(new { Deleted = success });
    }
}
```

<br/>

最後的資料夾結構如下
```yaml
RedisTest/
├── ...
├── Configurations/
│ └── RedisSettings.cs
├── Controllers/
│ └── RedisController.cs
├── Extensions/
│ └── ServiceCollectionExtensions.cs
├── Services/
│ ├── Interfaces/
│ │ └── IRedisService.cs
│ └── RedisService.cs
├── appsettings.json
└── Program.cs
```
![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet3.png)


<br/>

### Step 8: 執行測試
終於可以執行了，直接按 F5 來執行專案，可以看到 Swagger UI  
(我不小心把 Test 寫成 Text 了... 請忽略這個不重要的小細節^^)  

![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet4.png)

來操作 Post 看看，點開 Post 並點右上方的 Try it out，接著輸入要設定的 key, value，得到 Response Code 200，看來有執行成功  

![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet5.png)

再來試試看 Get，輸入我們剛剛設定的 key 看看能不能拿到一樣的 value 

![image](/images/posts/RedisClusterWithDotnet/RedisClusterWithDotnet6.png)

結果也是成功的~完成!


<br/>

### 程式碼範例
Github: [Redis_Cluster_with_Dotnet ](https://github.com/AnnChangAnn/Redis_Cluster_with_Dotnet)

<br/>

### 總結
網路上找到的資料並沒有設定地這麼複雜，比較多是只用一行的 Redis Config 和一行的AddSingleton 直接完成註冊，但這樣 appsetting 會比較不好看一點。  
這次利用 AI 同步調整和測試，將 config 寫得整齊一點，並且透過 Extension 增加一些判定來讓整個架構更完整，所以說~善用 AI 工具真的很重要XD


<br/>
<br/>

### 參考來源:
1. [建立 Redis cluster on Docker (Windows)](/posts/redis_cluster_on_docker_on_windows/)
2. https://blog.yowko.com/stackexchange-redis-in-aspdotnet-core/
3. ChatGPT, Claude, Gemini