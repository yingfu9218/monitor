export interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  os: string;
  location: string;
  lastHeartbeat?: string;
  currentMetrics?: {
    cpu: number;
    memory: number;
    network?: number;
    upload?: number;   // MB/s - 上行速度
    download?: number; // MB/s - 下行速度
  };
}

export interface ServerDetail extends Server {
  metrics: {
    cpu: number;
    memory: number;
    diskRead: number;
    diskWrite: number;
    networkIn: number;
    networkOut: number;
  };
  info: {
    cpuCores: number;
    totalMemory: number;
    usedMemory: number;
    uptime: number;
  };
}

export interface Disk {
  id?: string;          // 前端添加的字段，用于 React key
  name: string;
  mountPoint: string;
  fsType: string;
  totalSize: number;
  usedSize: number;
  availableSize: number;
  usagePercent: number;
}

export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
  status: string;
}

export interface NetworkInterface {
  id?: string;          // 前端添加的字段，用于 React key
  name: string;
  type: string;
  uploadSpeed: number;
  downloadSpeed: number;
  totalUpload: number;
  totalDownload: number;
  status: string;
}

export interface MetricDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  diskRead?: number;
  diskWrite?: number;
  networkIn?: number;
  networkOut?: number;
}

export interface AppSettings {
  apiUrl: string;
  apiPort: string;
  apiKey: string;
}
