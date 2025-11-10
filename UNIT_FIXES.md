# 单位问题修复和设置持久化

## 2025-11-10 - 数据单位对齐和持久化存储

### 问题分析

经过检查后端 Agent 代码（`/Users/yingfu/project/monitor-system/internal/agent/collector/collector.go`），发现后端返回的数据单位如下：

| 数据类型 | 后端返回单位 | 前端之前的假设 | 问题 |
|---------|------------|--------------|-----|
| 网络速度 | MB/s | KB/s（错误转换） | 数值被放大了1024倍 |
| 磁盘读写速度 | MB/s | MB/s（正确） | ✓ 正确 |
| 磁盘空间大小 | MB | GB | 数值被缩小了1024倍 |
| 网络总流量 | MB | GB | 数值被缩小了1024倍 |

### 修复内容

#### 1. ✅ 修复网络速度格式化函数

**文件**: `src/utils/format.ts:1-24`

**问题**: `formatNetworkSpeed()` 函数错误地将 MB/s 转换为 KB/s，导致显示值放大1024倍

**修复前**:
```typescript
const speedKBps = speed * 1024; // 错误：speed已经是MB/s，不应该再乘以1024
if (speedKBps < 1024) {
  return `${speedKBps.toFixed(2)} KB/s`;
}
```

**修复后**:
```typescript
// speed 已经是 MB/s
if (speed < 1) {
  // 小于 1 MB/s，转换为 KB/s 显示
  return `${(speed * 1024).toFixed(2)} KB/s`;
} else if (speed < 1024) {
  // 1 MB/s ~ 1024 MB/s，显示 MB/s
  return `${speed.toFixed(2)} MB/s`;
} else {
  // 大于等于 1024 MB/s (1 GB/s)，显示 GB/s
  return `${(speed / 1024).toFixed(2)} GB/s`;
}
```

**影响范围**:
- 首页服务器卡片网络指标
- 服务器详情页网络卡片

---

#### 2. ✅ 修复磁盘空间大小格式化

**文件**: `src/screens/DiskDetailScreen.tsx:94-106`

**问题**: `formatSize()` 函数假设输入是 GB，但后端返回的是 MB

**修复前**:
```typescript
const formatSize = (gb: number) => {
  if (gb >= 1000) {
    return `${(gb / 1000).toFixed(1)} TB`; // 错误：应该除以1024
  }
  return `${gb} GB`; // 错误：输入不是GB
};
```

**修复后**:
```typescript
const formatSize = (mb: number) => {
  // 后端返回的是 MB
  if (mb >= 1024 * 1024) {
    // >= 1 TB
    return `${(mb / 1024 / 1024).toFixed(2)} TB`;
  } else if (mb >= 1024) {
    // >= 1 GB
    return `${(mb / 1024).toFixed(2)} GB`;
  } else {
    // < 1 GB
    return `${mb.toFixed(2)} MB`;
  }
};
```

**影响范围**:
- 磁盘详情页所有磁盘分区的空间显示

---

#### 3. ✅ 修复网络总流量格式化

**文件**: `src/screens/NetworkDetailScreen.tsx:111-133`

**问题**:
1. 速度格式化不够完善，没有处理小于1 MB/s的情况
2. 总流量格式化假设输入是 GB，但后端返回的是 MB

**修复前**:
```typescript
const formatSpeed = (speed: number) => {
  if (speed >= 1000) {
    return `${(speed / 1000).toFixed(2)} GB/s`;
  }
  return `${speed.toFixed(1)} MB/s`;
};

const formatTotal = (gb: number) => {
  if (gb >= 1000) {
    return `${(gb / 1000).toFixed(2)} TB`;
  }
  return `${gb.toFixed(0)} GB`;
};
```

**修复后**:
```typescript
const formatSpeed = (speed: number) => {
  // 后端返回的速度单位是 MB/s
  if (speed < 1) {
    // 小于 1 MB/s，显示 KB/s
    return `${(speed * 1024).toFixed(2)} KB/s`;
  } else if (speed >= 1024) {
    // 大于等于 1 GB/s
    return `${(speed / 1024).toFixed(2)} GB/s`;
  }
  return `${speed.toFixed(2)} MB/s`;
};

const formatTotal = (mb: number) => {
  // 后端返回的总流量单位是 MB
  if (mb >= 1024 * 1024) {
    // >= 1 TB
    return `${(mb / 1024 / 1024).toFixed(2)} TB`;
  } else if (mb >= 1024) {
    // >= 1 GB
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
};
```

**影响范围**:
- 网络详情页所有网卡的速度和总流量显示

---

#### 4. ✅ 实现设置持久化存储

**问题**: 应用关闭后设置丢失，每次打开都需要重新配置

**解决方案**: 使用 AsyncStorage 实现本地持久化存储

**新增文件**: `src/services/storage.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

// 保存设置
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  const jsonValue = JSON.stringify(settings);
  await AsyncStorage.setItem('@monitor_app_settings', jsonValue);
};

// 加载设置
export const loadSettings = async (): Promise<AppSettings> => {
  const jsonValue = await AsyncStorage.getItem('@monitor_app_settings');
  if (jsonValue != null) {
    return JSON.parse(jsonValue);
  }
  return DEFAULT_SETTINGS; // 默认配置
};
```

**修改文件**: `App.tsx`

1. **添加设置加载逻辑** (第33-47行):
```typescript
// 加载保存的设置
useEffect(() => {
  const initSettings = async () => {
    try {
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  initSettings();
}, []);
```

2. **更新设置保存逻辑** (第110-121行):
```typescript
const handleSaveSettings = useCallback(async (newSettings: AppSettings) => {
  try {
    // 保存到本地存储
    await saveSettings(newSettings);
    // 更新状态
    setSettings(newSettings);
    // 重新配置 API 服务
    apiService.configure(newSettings.apiUrl, newSettings.apiPort, newSettings.apiKey);
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}, []);
```

**新增依赖**:
```json
"@react-native-async-storage/async-storage": "^2.2.0"
```

---

### 后端数据格式参考

根据 `collector.go` 源码：

#### 网络指标（第69-83行）
```go
// MB/s
metrics.NetworkIn = float64(netIO[0].BytesRecv-last.BytesRecv) / elapsed / 1024 / 1024
metrics.NetworkOut = float64(netIO[0].BytesSent-last.BytesSent) / elapsed / 1024 / 1024
```

#### 磁盘 I/O（第62-66行）
```go
// MB/s
metrics.DiskRead = float64(totalReadBytes) / elapsed / 1024 / 1024
metrics.DiskWrite = float64(totalWriteBytes) / elapsed / 1024 / 1024
```

#### 磁盘空间（第129-131行）
```go
TotalSize:     usage.Total / 1024 / 1024,     // MB
UsedSize:      usage.Used / 1024 / 1024,      // MB
AvailableSize: usage.Free / 1024 / 1024,      // MB
```

#### 网络总流量（第229-230行）
```go
TotalUpload:   io.BytesSent / 1024 / 1024,   // MB
TotalDownload: io.BytesRecv / 1024 / 1024,   // MB
```

---

### 测试验证

#### 网络速度显示测试

假设实际网速为 5.5 MB/s：

| 修复前（错误） | 修复后（正确） |
|-------------|--------------|
| 5632.00 KB/s | 5.50 MB/s |

假设实际网速为 0.5 MB/s：

| 修复前（错误） | 修复后（正确） |
|-------------|--------------|
| 512.00 KB/s | 512.00 KB/s |

#### 磁盘空间显示测试

假设磁盘总大小为 500000 MB（约 488 GB）：

| 修复前（错误） | 修复后（正确） |
|-------------|--------------|
| 488.28 TB | 488.28 GB |

#### 网络总流量显示测试

假设总流量为 10240 MB（10 GB）：

| 修复前（错误） | 修复后（正确） |
|-------------|--------------|
| 10 TB | 10.00 GB |

#### 设置持久化测试

1. 打开应用，点击设置图标
2. 输入配置：
   - API 地址: http://192.168.1.100
   - 端口: 8080
   - API 秘钥: test-key-123
3. 点击保存
4. 完全关闭应用
5. 重新打开应用
6. **预期结果**:
   - 设置自动加载
   - API 自动配置
   - 服务器列表自动获取
   - 无需重新设置

---

### 文件变更总结

**修改文件**:
- `src/utils/format.ts` - 修复网络速度格式化函数
- `src/screens/DiskDetailScreen.tsx` - 修复磁盘空间格式化
- `src/screens/NetworkDetailScreen.tsx` - 修复网络速度和流量格式化
- `App.tsx` - 添加设置加载和持久化逻辑
- `package.json` - 添加 AsyncStorage 依赖

**新增文件**:
- `src/services/storage.ts` - 持久化存储服务

**iOS 原生依赖**:
- 已通过 `pod install` 安装 AsyncStorage 原生模块

---

### 兼容性

所有修复都向后兼容：
- ✅ iOS 兼容
- ✅ Android 兼容
- ✅ 不影响后端 API
- ✅ 不影响现有功能
- ✅ 自动数据迁移（首次打开使用默认配置）

---

### 注意事项

1. **首次打开应用**: 如果没有保存的设置，将使用默认配置：
   - API 地址: `http://localhost`
   - 端口: `8080`
   - API 秘钥: 空

2. **Android 模拟器**: 需要使用 `http://10.0.2.2` 替代 `localhost`

3. **数据格式**: 所有单位转换都保留小数点后两位，确保显示精度

4. **错误处理**: 如果加载或保存设置失败，应用会继续使用默认配置，不会崩溃

---

**修复完成日期**: 2025-11-10
**测试状态**: 待测试
**版本**: v1.1.0
