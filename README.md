# 服务器监控 - React Native 前端

这是服务器监控系统的 React Native 移动端应用。

## 功能特性

- ✅ 服务器列表展示
- ✅ 实时监控数据显示（CPU、内存、网络）
- ✅ 服务器状态指示（在线/警告/离线）
- ✅ API 服务集成
- 🚧 服务器详情页面（待完善）
- 🚧 历史数据图表（待完善）
- 🚧 设置页面（待完善）

## 技术栈

- React Native 0.82.1
- TypeScript
- React Navigation（已安装）
- React Native Chart Kit（已安装）
- React Native Vector Icons（已安装）
- Axios（HTTP 客户端）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. iOS 依赖（仅 macOS）

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 3. 配置后端连接

在应用启动后，点击右上角设置按钮（⚙️），配置：

- **API 地址**: `http://localhost` 或您的服务器 IP
- **API 端口**: `8080`
- **API 密钥**: 与后端 `server-config.yaml` 中的 `api_key` 一致

> 注意：如果在模拟器中访问本地服务器：
> - iOS 模拟器: 使用 `http://localhost:8080`
> - Android 模拟器: 使用 `http://10.0.2.2:8080`

### 4. 启动开发服务器

```bash
npm start
```

### 5. 运行应用

**iOS**:
```bash
npm run ios
```

**Android**:
```bash
npm run android
```

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── ui/           # 基础组件（Button, Card, Badge）
│   └── ServerCard.tsx
├── screens/          # 页面
│   └── ServerListScreen.tsx
├── services/         # API 服务
│   └── api.ts
├── types/            # TypeScript 类型
│   └── index.ts
└── utils/            # 工具函数
    └── theme.ts      # 主题配置
```

## 组件说明

### 基础 UI 组件

#### Button
```typescript
<Button
  onPress={() => {}}
  variant="default" // default | ghost | outline | destructive
  size="default"    // default | sm | lg | icon
>
  按钮文字
</Button>
```

#### Card
```typescript
<Card onPress={() => {}}>
  <Text>卡片内容</Text>
</Card>
```

#### Badge
```typescript
<Badge variant="success"> // default | secondary | destructive | success
  正常
</Badge>
```

### 业务组件

#### ServerCard
显示单个服务器的卡片，包含：
- 服务器名称和 IP
- 状态徽章
- 实时监控指标（CPU、内存、网络）

#### ServerListScreen
服务器列表页面，显示所有服务器

## API 服务

API 服务位于 `src/services/api.ts`，提供以下方法：

```typescript
// 配置 API
apiService.configure(apiUrl, apiPort, apiKey);

// 验证认证
await apiService.verifyAuth();

// 获取服务器列表
const servers = await apiService.getServers();

// 获取服务器详情
const server = await apiService.getServerDetail(serverId);

// 获取历史数据
const history = await apiService.getServerHistory(serverId, '20m');

// 获取磁盘信息
const disks = await apiService.getDisks(serverId);

// 获取进程列表
const processes = await apiService.getProcesses(serverId);

// 获取网络信息
const network = await apiService.getNetwork(serverId);
```

## 主题系统

主题配置位于 `src/utils/theme.ts`：

```typescript
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

// 颜色
colors.primary      // 主色
colors.success      // 成功色
colors.warning      // 警告色
colors.error        // 错误色
colors.textPrimary  // 主文字色

// 间距
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px

// 字体大小
fontSize.xs   // 12px
fontSize.sm   // 14px
fontSize.md   // 16px

// 圆角
borderRadius.sm   // 4px
borderRadius.md   // 8px
borderRadius.lg   // 12px
```

## 开发说明

### 待完成功能

1. **服务器详情页面**
   - 详细监控数据
   - 历史数据图表
   - 磁盘、进程、网络详情入口

2. **设置对话框**
   - API 配置界面
   - 保存和验证功能

3. **导航系统**
   - 使用 React Navigation
   - 页面间跳转

4. **图表组件**
   - 使用 React Native Chart Kit
   - 显示 CPU、内存、网络历史数据

5. **数据刷新**
   - 下拉刷新
   - 自动轮询更新

### 添加新页面

1. 在 `src/screens/` 创建新页面
2. 在 `App.tsx` 中集成
3. 配置导航（如果使用 React Navigation）

### 调用 API

```typescript
import { apiService } from './src/services/api';

// 在组件中
const [servers, setServers] = useState([]);

useEffect(() => {
  const fetchServers = async () => {
    try {
      const data = await apiService.getServers();
      setServers(data);
    } catch (error) {
      console.error('获取服务器列表失败:', error);
    }
  };

  fetchServers();
}, []);
```

## 故障排查

### 常见问题

1. **npm install 失败**
   - 确保 Node.js 20+ 已安装
   - 删除 `node_modules` 和 `package-lock.json`，重新安装

2. **iOS 编译失败**
   - 运行 `cd ios && pod install`
   - 清理缓存: `cd ios && pod deintegrate && pod install`

3. **Android 编译失败**
   - 清理缓存: `cd android && ./gradlew clean`
   - 确保 JDK 17 已安装

4. **无法连接后端**
   - 检查后端是否运行
   - 检查 API 配置是否正确
   - iOS 模拟器使用 `localhost`，Android 模拟器使用 `10.0.2.2`

### 调试

```bash
# 查看日志
npx react-native log-ios
npx react-native log-android

# 重置缓存
npm start -- --reset-cache
```

## 相关文档

- [React Native 官方文档](https://reactnative.dev/)
- [React Navigation 文档](https://reactnavigation.org/)
- [后端 API 文档](../monitor-system/README.md)
- [项目总结](../PROJECT_SUMMARY.md)

## 后续计划

### 第一阶段
- [ ] 实现服务器详情页面
- [ ] 实现设置对话框
- [ ] 集成 React Navigation

### 第二阶段
- [ ] 实现历史数据图表
- [ ] 添加下拉刷新
- [ ] 实现自动数据更新

### 第三阶段
- [ ] 优化 UI 和动画
- [ ] 添加错误处理
- [ ] 添加离线缓存

## 许可证

MIT License

---

**注意**: 这是一个基于 Figma Make 生成的 UI 转换而来的 React Native 项目。原 Figma 设计是 Web 版本，已转换为 React Native 移动端适配。
